import React, {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {RunnerLayerT} from '../schema';

type V = [number, number];
type Leg = {k: V; a: V; foot: {ang: number; c: V}; hip?: V}; // hip riêng từng chân (gốc đùi, tools/run20-track/08); không có thì dùng hip chung
type TrackFrame = {belt: V; chest: V; rot: number; hip: V; legs: [Leg, Leg]; hand: V; handSeen: boolean; elbow?: V; shoulder?: V};
type Track = {fps: number; refW: number; refH: number; frames: TrackFrame[]};

const DEG = Math.PI / 180;
const f2 = (n: number) => n.toFixed(2);

// Nạp JSON số đo một lần (delayRender để khung không dựng khi chưa có dữ liệu).
const useTrack = (path: string): Track | null => {
  const [track, setTrack] = useState<Track | null>(null);
  const [handle] = useState(() => delayRender(`runner-track ${path}`));
  useEffect(() => {
    fetch(staticFile(path))
      .then((r) => r.json())
      .then((j: Track) => {
        setTrack(j);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [path, handle]);
  return track;
};

// Chân là MỘT đa giác liền: hông → gối (nối nhọn kiểu miter) → cổ chân (đầu phẳng, như gấu quần). Pháp tuyến n hướng "phía trước".
// grow: nới đều mỗi bên (viền); scale/shift: thu hẹp và dịch về phía trước (mảng sáng); ext: kéo dài đầu cổ chân.
const legPolygon = (pts: V[], widths: number[], grow: number, scale = 1, shift = 0, ext = 0) => {
  const seg = [0, 1].map((i) => {
    const dx = pts[i + 1][0] - pts[i][0];
    const dy = pts[i + 1][1] - pts[i][1];
    const L = Math.hypot(dx, dy) || 1;
    return {dx: dx / L, dy: dy / L, nx: dy / L, ny: -dx / L};
  });
  const half = widths.map((w) => (w * scale + grow) / 2);
  const c = pts.map((p, i) => {
    const sg = seg[Math.min(i, 1)];
    const sg0 = seg[Math.max(i - 1, 0)];
    const nx = i === 1 ? sg0.nx + sg.nx : sg.nx;
    const ny = i === 1 ? sg0.ny + sg.ny : sg.ny;
    const nl = Math.hypot(nx, ny) || 1;
    return [p[0] + (nx / nl) * shift * widths[i], p[1] + (ny / nl) * shift * widths[i]] as V;
  });
  const end: V = [c[2][0] + seg[1].dx * ext, c[2][1] + seg[1].dy * ext];
  const P: V[] = [c[0], c[1], end];
  const side = (sgn: 1 | -1) => {
    const out: V[] = [];
    // hông
    out.push([P[0][0] + sgn * seg[0].nx * half[0], P[0][1] + sgn * seg[0].ny * half[0]]);
    // gối: phía ngoài bo tròn (cung bán kính = nửa bề rộng), phía trong giao nhọn (miter)
    const cross = seg[0].dx * seg[1].dy - seg[0].dy * seg[1].dx;
    const outerSgn = cross < 0 ? -1 : 1;
    if (sgn === outerSgn) {
      const a0 = Math.atan2(sgn * seg[0].ny, sgn * seg[0].nx);
      const a1 = Math.atan2(sgn * seg[1].ny, sgn * seg[1].nx);
      const dl = ((((a1 - a0 + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
      for (let t = 0; t <= 8; t++) {
        const an = a0 + (dl * t) / 8;
        out.push([P[1][0] + Math.cos(an) * half[1], P[1][1] + Math.sin(an) * half[1]]);
      }
    } else {
      const mx = seg[0].nx + seg[1].nx;
      const my = seg[0].ny + seg[1].ny;
      const dot = seg[0].nx * seg[1].nx + seg[0].ny * seg[1].ny;
      let kx = (mx / (1 + dot)) * half[1];
      let ky = (my / (1 + dot)) * half[1];
      const kl = Math.hypot(kx, ky);
      const lim = half[1] * 1.6;
      if (kl > lim) {
        kx *= lim / kl;
        ky *= lim / kl;
      }
      out.push([P[1][0] + sgn * kx, P[1][1] + sgn * ky]);
    }
    // cổ chân
    out.push([P[2][0] + sgn * seg[1].nx * half[2], P[2][1] + sgn * seg[1].ny * half[2]]);
    return out;
  };
  const L = side(1);
  const R = side(-1);
  return [...L, ...R.reverse()].map((p) => `${f2(p[0])},${f2(p[1])}`).join(' ');
};

// Chân: viền ink, một màu phẳng (chân xa tối hơn), vài nét nhăn ở gối và gấu quần như hoạt hình gốc. Cùng một hình học nên viền liền.
const LegTube: React.FC<{pts: V[]; layer: RunnerLayerT; far: boolean}> = ({pts, layer, far}) => {
  const {widths, outline, fill, shade, ink} = layer.leg;
  const hip = pts[0];
  const knee = pts[1];
  const end = pts[2];
  const d0x = knee[0] - hip[0];
  const d0y = knee[1] - hip[1];
  const d1x = end[0] - knee[0];
  const d1y = end[1] - knee[1];
  const l0 = Math.hypot(d0x, d0y) || 1;
  const l1 = Math.hypot(d1x, d1y) || 1;
  // nét nhăn ngắn: hai nét chéo ở phía trong gối (hướng về giữa hai đoạn) + một nét ngang gần gấu quần
  const cross = d0x * d1y - d0y * d1x;
  const inner = cross < 0 ? 1 : -1; // phía trong chỗ gập
  const bis: V = [-(d0x / l0) + d1x / l1, -(d0y / l0) + d1y / l1];
  const bl = Math.hypot(bis[0], bis[1]) || 1;
  const bx = bis[0] / bl;
  const by = bis[1] / bl;
  void inner;
  const crease = (cx: number, cy: number, dx: number, dy: number, len: number) => (
    <line x1={cx} y1={cy} x2={cx + dx * len} y2={cy + dy * len} stroke={ink} strokeWidth={2.4} strokeLinecap="round" opacity={0.75} />
  );
  return (
    <g>
      <polygon points={legPolygon(pts, widths, outline * 2, 1, 0, outline)} fill={ink} />
      <circle cx={hip[0]} cy={hip[1]} r={widths[0] / 2 + outline} fill={ink} />
      <polygon points={legPolygon(pts, widths, 0)} fill={far ? shade : fill} />
      <circle cx={hip[0]} cy={hip[1]} r={widths[0] / 2} fill={far ? shade : fill} />
      {crease(knee[0] + bx * 6, knee[1] + by * 6, bx * 0.85 - by * 0.35, by * 0.85 + bx * 0.35, 30)}
      {crease(knee[0] + bx * 20, knee[1] + by * 20, bx * 0.85 + by * 0.35, by * 0.85 - bx * 0.35, 26)}
      {crease(end[0] - (d1x / l1) * 34 - (d1y / l1) * 12, end[1] - (d1y / l1) * 34 + (d1x / l1) * 12, -(d1y / l1), d1x / l1, 24)}
    </g>
  );
};

export const RunnerAsset: React.FC<{layer: RunnerLayerT}> = ({layer}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const track = useTrack(layer.track);
  if (!track) return null;

  const n = track.frames.length;
  const idx = Math.floor((frame / fps) * track.fps + 1e-6) % n;
  const T = track.frames[idx];
  const T0 = track.frames[0];
  const s = width / track.refW;
  const oy = (height - track.refH * s) / 2;

  const rot = T.rot * DEG;
  // Biến đổi thân: từ toạ độ nghỉ (hình 0) sang hình hiện tại, xoay quanh thắt lưng.
  const bodyT = `translate(${f2(T.belt[0])} ${f2(T.belt[1])}) rotate(${f2(T.rot)}) translate(${f2(-T0.belt[0])} ${f2(-T0.belt[1])})`;
  const toBody = (p: V): V => {
    const x = p[0] - T0.belt[0];
    const y = p[1] - T0.belt[1];
    return [T.belt[0] + Math.cos(rot) * x - Math.sin(rot) * y, T.belt[1] + Math.sin(rot) * x + Math.cos(rot) * y];
  };

  const u = layer.upper;
  const upperT = `translate(${u.at[0]} ${u.at[1]}) rotate(${u.rotDeg}) scale(${u.scale}) translate(${-u.anchor[0]} ${-u.anchor[1]})`;

  // Tay tự do: khuỷu từng hình lấy từ track (IK vai → bàn tay, tools/run20-track/08); track cũ không có thì khuỷu theo thân.
  // Cẳng tay hướng từ khuỷu tới bàn tay đo được; tay áo trên quay quanh khuỷu để đỉnh hướng về vai.
  const E0: V = [T0.chest[0] + layer.elbow[0], T0.chest[1] + layer.elbow[1]];
  const E = T.elbow ?? toBody(E0);
  const psi = Math.atan2(T.hand[1] - E[1], T.hand[0] - E[0]) / DEG;
  const af = layer.armFore;
  const phiArt = Math.atan2(af.hand[1] - af.pivot[1], af.hand[0] - af.pivot[0]) / DEG;
  const foreT = `translate(${f2(E[0])} ${f2(E[1])}) rotate(${f2(psi - phiArt)}) scale(${layer.armScale}) translate(${-af.pivot[0]} ${-af.pivot[1]})`;
  const au = layer.armUp;
  let upT = `${bodyT} translate(${E0[0]} ${E0[1]}) rotate(${au.rotDeg}) scale(${layer.armScale}) translate(${-au.pivot[0]} ${-au.pivot[1]})`;
  if (T.elbow && T0.shoulder && au.top) {
    // Tay xa camera: gốc ảnh tay áo trên (đỉnh vai `top`) đặt LÙI vào trong ngực (`shoulderShift`, hệ nghỉ, quay theo thân)
    // để vòm vai khuất sau thân; ảnh kéo dọc trục đỉnh vai→khuỷu cho đầu khuỷu (`pivot`) trùng khuỷu hình hiện tại.
    // (Quay quanh khuỷu hay đặt vòm đúng vai IK đều làm vòm lòi ra trước mép ngực của ảnh thân trên.)
    const sh = au.shoulderShift ?? [0, 0];
    const Sv = toBody([T0.shoulder[0] + sh[0], T0.shoulder[1] + sh[1]]);
    const ax = au.pivot[0] - au.top[0];
    const ay = au.pivot[1] - au.top[1];
    const phi = Math.atan2(ay, ax) / DEG;
    const theta = Math.atan2(E[1] - Sv[1], E[0] - Sv[0]) / DEG;
    const k = Math.hypot(E[0] - Sv[0], E[1] - Sv[1]) / (layer.armScale * Math.hypot(ax, ay));
    upT = `translate(${f2(Sv[0])} ${f2(Sv[1])}) rotate(${f2(theta)}) scale(${f2(k * layer.armScale)} ${layer.armScale}) rotate(${f2(-phi)}) translate(${-au.top[0]} ${-au.top[1]})`;
  }

  // Chân: giày đặt theo tâm + trục đo được; ống nối hông → gối đo được → điểm cuối ở cổ chân của ảnh giày.
  const ft = layer.foot;
  const legs = ([0, 1] as const).map((j) => {
    const L = T.legs[j];
    const th = (L.foot.ang - ft.axisDeg) * DEG;
    const sc = ft.scale;
    // điểm ống kết thúc: biến đổi điểm `tube` trong ảnh giày
    const dx = (ft.tube[0] - ft.centroid[0]) * sc;
    const dy = (ft.tube[1] - ft.centroid[1]) * sc;
    const end: V = [L.foot.c[0] + Math.cos(th) * dx - Math.sin(th) * dy, L.foot.c[1] + Math.sin(th) * dx + Math.cos(th) * dy];
    const footT = `translate(${f2(L.foot.c[0])} ${f2(L.foot.c[1])}) rotate(${f2(L.foot.ang - ft.axisDeg)}) scale(${sc}) translate(${-ft.centroid[0]} ${-ft.centroid[1]})`;
    return {j, footT, pts: [L.hip ?? T.hip, L.k, end] as V[]};
  });
  const order = layer.nearLeg === 0 ? [legs[1], legs[0]] : [legs[0], legs[1]];

  return (
    <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(0 ${f2(oy)}) scale(${s})`}>
        {order.map((l) => (
          <g key={l.j}>
            <image href={staticFile(ft.src)} width={ft.w} height={ft.h} transform={l.footT} />
            <LegTube pts={l.pts} layer={layer} far={l.j !== layer.nearLeg} />
          </g>
        ))}
        <image href={staticFile(au.src)} width={au.w} height={au.h} transform={upT} />
        <image href={staticFile(af.src)} width={af.w} height={af.h} transform={foreT} />
        <image href={staticFile(u.src)} width={u.w} height={u.h} transform={`${bodyT} ${upperT}`} />
      </g>
    </svg>
  );
};
