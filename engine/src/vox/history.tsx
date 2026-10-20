import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {voxTheme as T} from '../theme';
import {voxFonts as F} from './fonts';
import {StampText, Tape, asset, clamp, useEnter} from './paper';
import type {ShotCtx} from './shots';

// Các kind cho phim tài liệu lịch sử (history-cel-docu.md, dự án 2026-truecrime-my-lai). Đăng ký qua HISTORY_SHOTS trong shots.tsx.
type K = React.FC<ShotCtx>;
const sec = (fps: number, s: number) => Math.round(fps * s);

// Ảnh tràn khung (minh họa AI), camera đẩy vào chậm; nhãn nhỏ góc dưới trái nếu có.
// v: {img, from?: 1.0, to?: 1.08, x?: 0.5, y?: 0.5 (tâm đẩy, tỉ lệ khung), label?, dim?}
const Scene: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const s = interpolate(frame, [0, D], [v.from ?? 1.0, v.to ?? 1.08], clamp);
  const fade = interpolate(frame, [0, sec(fps, 0.4)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: T.paperDark}}>
      <AbsoluteFill style={{opacity: fade, transform: `scale(${s})`, transformOrigin: `${(v.x ?? 0.5) * 100}% ${(v.y ?? 0.5) * 100}%`}}>
        <Img src={asset(project, v.img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {v.dim > 0 && <AbsoluteFill style={{background: `rgba(16,14,12,${v.dim})`}} />}
      {v.label && (
        <div style={{position: 'absolute', left: W * 0.05, bottom: H * 0.2}}>
          <Tape text={t(v.label)} rot={-2} size={26} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Trang tài liệu scan (trái) + băng nguồn (locale) + bên phải: cụm chữ đóng dấu, gạch đỏ ở `strikeAt`, rồi dòng kết luận.
// v: {src, source (key băng nguồn), stamp? (key), strikeAt?: 0..1, verdict? (key), quote? (key, trích ≤25 từ), quoteVi?, cite?}
const DocScan: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const e = useEnter(0, 120, 16);
  // Không có strikeAt: không gạch chữ đóng dấu, kết luận hiện ngay sau dấu.
  const strike = v.strikeAt != null;
  const strikeAt = Math.round(D * (v.strikeAt ?? 0.15));
  const mark: number[] | undefined = v.mark; // [x, y, w, h] tỉ lệ trang: khung bút dạ quanh đoạn được trích
  const mp = interpolate(frame, [sec(fps, 0.8), sec(fps, 1.3)], [0, 1], clamp);
  const sp = interpolate(frame, [strikeAt, strikeAt + 10], [0, 1], clamp);
  const vo = interpolate(frame, [strikeAt + 8, strikeAt + 20], [0, 1], clamp);
  const qo = interpolate(frame, [sec(fps, 1.0), sec(fps, 1.4)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: W * 0.07,
          top: H * 0.5,
          height: H * 0.84,
          transform: `translateY(-50%) translateY(${(1 - e) * 70}px) rotate(${-2 + (1 - e) * 4}deg)`,
          opacity: Math.min(1, e * 2),
          filter: `drop-shadow(0 12px 16px ${T.shadow})`,
        }}
      >
        <div style={{background: T.paperEdge, padding: 16, height: '100%', boxSizing: 'border-box'}}>
          <div style={{position: 'relative', height: '100%'}}>
            <Img src={asset(project, v.src)} style={{height: '100%', display: 'block', filter: 'contrast(1.1)'}} />
            {mark && (
              <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x={mark[0] * 100} y={mark[1] * 100} width={mark[2] * 100} height={mark[3] * 100} fill={T.highlight} opacity={0.4 * mp} />
                <rect
                  x={mark[0] * 100}
                  y={mark[1] * 100}
                  width={mark[2] * 100}
                  height={mark[3] * 100}
                  fill="none"
                  stroke={T.red}
                  vectorEffect="non-scaling-stroke"
                  style={{strokeWidth: 5}}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - mp}
                />
              </svg>
            )}
          </div>
        </div>
        {/* Băng nguồn ở mép trên: mép dưới khung là chỗ phụ đề. */}
        <div style={{position: 'absolute', left: -14, top: -20}}>
          <Tape text={t(v.source)} rot={-3} size={22} />
        </div>
      </div>
      <div style={{position: 'absolute', left: W * 0.5, top: H * 0.22, width: W * 0.44}}>
        {v.stamp && (
          <div style={{position: 'relative', display: 'inline-block'}}>
            <StampText text={t(v.stamp)} at={sec(fps, 0.3)} size={88} color={T.ink} rot={-2} style={{whiteSpace: 'normal', lineHeight: 1.05}} />
            <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Chỉ vẽ khi nét đã chạy: đầu tròn của nét dài 0 vẫn hiện thành chấm đỏ. */}
              {strike && sp > 0 && (
                <line x1={-3} y1={58} x2={-3 + 106 * sp} y2={42} stroke={T.red} strokeWidth={3.5} vectorEffect="non-scaling-stroke" style={{strokeWidth: 12}} strokeLinecap="round" />
              )}
            </svg>
          </div>
        )}
        {v.verdict && (
          <div style={{opacity: vo, transform: `translateY(${(1 - vo) * 16}px)`, marginTop: 36}}>
            <StampText text={t(v.verdict)} at={strikeAt + 8} size={64} color={T.red} rot={-3} boxed style={{whiteSpace: 'normal', lineHeight: 1.1, display: 'inline-block'}} />
          </div>
        )}
        {v.quote && (
          <div style={{opacity: qo, marginTop: 40, borderLeft: `6px solid ${T.red}`, paddingLeft: 22}}>
            <div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 36, lineHeight: 1.35, color: T.inkSoft}}>“{t(v.quote)}”</div>
            {v.quoteVi && <div style={{fontFamily: F.body, fontSize: 34, lineHeight: 1.35, color: T.ink, marginTop: 12}}>{t(v.quoteVi)}</div>}
            {v.cite && <div style={{fontFamily: F.mono, fontSize: 22, color: T.inkSoft, marginTop: 14, letterSpacing: 2}}>{t(v.cite)}</div>}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Lịch giấy bóc tờ: tháng chạy từ `from` tới `to` ("YYYY-MM"), dừng ở tờ cuối; nhãn đếm tháng bên dưới.
// v: {from: "1968-03", to: "1969-11", label? (key, có thể chứa {n} = số tháng)}
const Calendar: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const [y0, m0] = (v.from as string).split('-').map(Number);
  const [y1, m1] = (v.to as string).split('-').map(Number);
  const total = (y1 - y0) * 12 + (m1 - m0);
  const run = interpolate(frame, [sec(fps, 0.4), Math.round(D * 0.7)], [0, total], {...clamp, easing: (x) => x * x * (3 - 2 * x)});
  const k = Math.floor(run);
  const peel = run - k; // tờ đang bóc
  const ym = (i: number) => {
    const m = m0 - 1 + i;
    return {y: y0 + Math.floor(m / 12), m: (m % 12) + 1};
  };
  const cw = 520;
  const ch = 560;
  const Page: React.FC<{i: number; style?: React.CSSProperties}> = ({i, style}) => {
    const {y, m} = ym(i);
    return (
      <div style={{position: 'absolute', inset: 0, background: T.paperEdge, boxShadow: `0 10px 18px ${T.shadow}`, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>
        <div style={{width: '100%', height: 120, background: T.red, color: T.paperEdge, fontFamily: F.mono, fontSize: 52, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 6}}>
          {y}
        </div>
        <div style={{fontFamily: F.display, fontSize: 300, color: T.ink, lineHeight: 1.25}}>{String(m).padStart(2, '0')}</div>
        <div style={{fontFamily: F.mono, fontSize: 30, color: T.inkSoft, letterSpacing: 4}}>THÁNG</div>
      </div>
    );
  };
  const label = v.label ? t(v.label).replace('{n}', String(total)) : '';
  const lo = interpolate(frame, [Math.round(D * 0.7), Math.round(D * 0.7) + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: cw, height: ch, marginTop: -H * 0.16}}>
        <Page i={Math.min(k + 1, total)} />
        {k < total && <Page i={k} style={{transformOrigin: '50% 0%', transform: `rotateX(${peel * 100}deg)`, opacity: 1 - peel * 0.6}} />}
        {/* gáy lịch */}
        <div style={{position: 'absolute', left: -14, right: -14, top: -18, height: 26, background: T.ink, borderRadius: 6}} />
      </div>
      {label && (
        <div style={{position: 'absolute', top: H * 0.72, width: W, textAlign: 'center', opacity: lo, fontFamily: F.body, fontWeight: 800, fontSize: 52, color: T.ink}}>{label}</div>
      )}
    </AbsoluteFill>
  );
};

// Sơ đồ đơn vị bậc thang (history-cel-docu.md §3.3): thẻ trắng viền đen + khiên trơn vẽ code (không chép phù hiệu thật),
// hiện lần lượt từ trên xuống; mục `hot` tô đỏ; `side` là thẻ bên phải nối bằng mũi tên từ mục cuối.
// v: {items: [{text (key), sub? (key), hot?, badge?}], side?: {text, sub?}, at?: 0..1 (khoảng giữa các bậc), reverse?}
const Shield: React.FC<{size: number; color: string; label: string}> = ({size, color, label}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115">
    <path d="M50 4 L94 18 L90 64 Q84 96 50 111 Q16 96 10 64 L6 18 Z" fill={color} stroke={T.ink} strokeWidth={6} />
    <text x={50} y={72} textAnchor="middle" fontFamily={F.display} fontSize={label.length > 2 ? 34 : 46} fill={T.paperEdge}>
      {label}
    </text>
  </svg>
);

const UnitChart: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const items: {text: string; sub?: string; hot?: boolean; badge?: string}[] = v.items ?? [];
  const step = Math.round(D * (v.at ?? 0.13));
  const rowH = Math.min(175, (H * 0.68) / Math.max(1, items.length));
  const x0 = W * 0.08;
  const dx = W * 0.06;
  // Căn giữa theo chiều dọc, chừa dải phụ đề ở đáy.
  const top = (H * 0.86 - items.length * rowH) / 2;
  const sideAt = sec(fps, 0.3) + items.length * step;
  const so = interpolate(frame, [sideAt, sideAt + 12], [0, 1], clamp);
  const last = items.length - 1;
  return (
    <AbsoluteFill>
      {items.map((it, i) => {
        // reverse: hiện từ dưới lên, khớp lời dẫn kể từ đơn vị nhỏ lên đơn vị lớn.
        const at = sec(fps, 0.2) + (v.reverse ? last - i : i) * step;
        const e = interpolate(frame, [at, at + 10], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + i * dx,
              top: top + i * rowH,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              opacity: e,
              transform: `translateX(${(1 - e) * -40}px)`,
            }}
          >
            <Shield size={rowH * 0.62} color={it.hot ? T.red : T.blue} label={it.badge ?? ''} />
            <div style={{background: T.paperEdge, border: `4px solid ${T.ink}`, boxShadow: `4px 4px 0 ${T.ink}`, padding: '8px 22px'}}>
              <div style={{fontFamily: F.display, fontSize: rowH * 0.36, color: it.hot ? T.red : T.ink, letterSpacing: 2, lineHeight: 1.1}}>{t(it.text)}</div>
              {it.sub && <div style={{fontFamily: F.body, fontSize: rowH * 0.17, color: T.inkSoft}}>{t(it.sub)}</div>}
            </div>
          </div>
        );
      })}
      {v.side && (
        <div style={{position: 'absolute', left: W * 0.5, top: top + last * rowH, opacity: so, display: 'flex', alignItems: 'center', gap: 22}}>
          <svg width={120} height={40}>
            <line x1={0} y1={20} x2={100 * so} y2={20} stroke={T.red} strokeWidth={6} />
            <path d="M96 6 L118 20 L96 34 Z" fill={T.red} opacity={so} />
          </svg>
          <div style={{background: T.paperEdge, border: `4px solid ${T.red}`, padding: '10px 24px', transform: 'rotate(-1.5deg)'}}>
            <div style={{fontFamily: F.display, fontSize: rowH * 0.36, color: T.red, letterSpacing: 2}}>{t(v.side.text)}</div>
            {v.side.sub && <div style={{fontFamily: F.body, fontSize: rowH * 0.17, color: T.inkSoft}}>{t(v.side.sub)}</div>}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Thẻ tên (không ảnh): cấp bậc + họ tên lớn + vai trò, rơi vào lần lượt.
// v: {items: [{name (key), role (key)}]}
const People: K = ({v, t, D}) => {
  const {width: W} = useVideoConfig();
  const items: {name: string; role: string}[] = v.items ?? [];
  return (
    <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: W * 0.05}}>
      {items.map((it, i) => (
        <PersonCard key={i} at={Math.round(D * (0.05 + i * 0.4))} name={t(it.name)} role={t(it.role)} rot={i % 2 ? 2 : -2} />
      ))}
    </AbsoluteFill>
  );
};

const PersonCard: React.FC<{at: number; name: string; role: string; rot: number}> = ({at, name, role, rot}) => {
  const e = useEnter(at);
  return (
    <div
      style={{
        width: 700,
        background: T.paperEdge,
        boxShadow: `0 12px 18px ${T.shadow}`,
        borderTop: `14px solid ${T.ink}`,
        padding: '34px 40px',
        opacity: Math.min(1, e * 2),
        transform: `translateY(${(1 - e) * -60}px) rotate(${rot * e}deg)`,
      }}
    >
      <div style={{fontFamily: F.display, fontSize: 72, color: T.ink, letterSpacing: 2, lineHeight: 1.05}}>{name}</div>
      <div style={{height: 6, width: 120, background: T.red, margin: '18px 0'}} />
      <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 36, color: T.inkSoft}}>{role}</div>
    </div>
  );
};

// Hai lời khai đối nghịch: cột trái, dải giữa (tùy chọn), cột phải hiện theo 3 nhịp; nguồn dưới cùng.
// v: {left: {who, quote, vi}, right: {who, quote, vi}, middle? (key), cite (key), at?: [l, m, r] (0..1)}
const Versus: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const [al, am, ar] = (v.at ?? [0.03, 0.4, 0.6]).map((x: number) => Math.round(D * x));
  const o = (at: number) => interpolate(frame, [at, at + 12], [0, 1], clamp);
  const line = interpolate(frame, [0, 14], [0, 1], clamp);
  const Col: React.FC<{c: {who: string; quote: string; vi: string}; at: number; color: string}> = ({c, at, color}) => (
    <div style={{width: W * 0.38, opacity: o(at), transform: `translateY(${(1 - o(at)) * 24}px)`}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color}}>{t(c.who)}</div>
      <div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 58, lineHeight: 1.25, color: T.ink, margin: '22px 0 16px'}}>“{t(c.quote)}”</div>
      <div style={{fontFamily: F.body, fontSize: 36, lineHeight: 1.35, color: T.inkSoft}}>{t(c.vi)}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - 3, top: H * 0.1, width: 6, height: H * 0.56 * line, background: T.red}} />
      <div style={{position: 'absolute', left: W * 0.06, top: H * 0.14}}>
        <Col c={v.left} at={al} color={T.red} />
      </div>
      <div style={{position: 'absolute', left: W * 0.56, top: H * 0.14}}>
        <Col c={v.right} at={ar} color={T.blue} />
      </div>
      {v.middle && (
        <div style={{position: 'absolute', top: H * 0.7, width: W, display: 'flex', justifyContent: 'center', opacity: o(am)}}>
          <div style={{background: T.ink, color: T.paperEdge, fontFamily: F.body, fontWeight: 800, fontSize: 38, padding: '12px 30px'}}>{t(v.middle)}</div>
        </div>
      )}
      {v.cite && (
        <div style={{position: 'absolute', left: W * 0.06, top: H * 0.06}}>
          <Tape text={t(v.cite)} rot={-1.5} size={20} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Cảnh dựng lại 2.5D (history-cel-docu.md §8, rules/reenactment-first.md): nền + lớp nhân vật tách nền, camera đẩy,
// parallax theo `depth` (0 = xa, đứng yên theo nền; 1 = gần, trôi nhiều), ánh đèn + bụi bằng code, nhãn tên/chữ phụ.
// v: {bg, zoom?: [from, to], pan?: [dxFrom, dxTo] (px), tint?, glow?: {x, y, r, color?},
//     layers: [{img, x, y (tâm-đáy, tỉ lệ khung), h (chiều cao, tỉ lệ khung), depth?, flip?, at? (0..1, vào bằng mờ dần)}],
//     tags?: [{text, x, y, at?, big?, sub?}] (nhãn tên trỏ vào nhân vật; big = số lớn kèm dòng phụ), caption? (băng chữ phụ góc trên trái),
//     label? ("Minh họa"), dust?, smoke? (khói trôi), embers? (tàn lửa bay lên), shake? (px, rung camera),
//     wash?: {x, y} (bụi gió cánh quạt tỏa ra từ điểm chạm đất), stamp?: {text, sub?, at?, color?, size?, x?} (tem đóng dấu đè lên cảnh)}
//     layer thêm: move?: [dx, dy] (px, trôi trong cả shot), bob? (px, nhấp nhô như trực thăng treo),
//     rotors?: [{x, y (tâm trục, tỉ lệ trong ảnh), w (đường kính, tỉ lệ chiều cao lớp), rps?, tilt?}] — cánh quạt quay bằng code
const Stage: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const u = interpolate(frame, [0, D], [0, 1], clamp);
  const [z0, z1] = v.zoom ?? [1.0, 1.08];
  const [p0, p1] = v.pan ?? [0, 0];
  const z = z0 + (z1 - z0) * u;
  const pan = p0 + (p1 - p0) * u;
  const layers: {img: string; x: number; y: number; h: number; depth?: number; flip?: boolean; at?: number; move?: [number, number]; bob?: number; rotors?: {x: number; y: number; w: number; rps?: number; tilt?: number}[]}[] =
    v.layers ?? [];
  const sh = v.shake ? {x: Math.sin(frame * 1.9) * v.shake + Math.sin(frame * 0.7) * v.shake * 0.5, y: Math.cos(frame * 2.3) * v.shake * 0.6} : {x: 0, y: 0};
  const fade = interpolate(frame, [0, sec(fps, 0.35)], [0, 1], clamp);
  // Lớp gần phóng/trôi mạnh hơn lớp xa: hệ số 1 + depth * 0.6.
  const tf = (depth: number) => {
    const k = 1 + depth * 0.6;
    return `translate(${pan * k + sh.x}px, ${sh.y}px) scale(${1 + (z - 1) * k})`;
  };
  return (
    <AbsoluteFill style={{background: T.paperDark, overflow: 'hidden', opacity: fade}}>
      <AbsoluteFill style={{transform: tf(0), transformOrigin: '50% 60%'}}>
        <Img src={asset(project, v.bg)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {v.glow && (
        <AbsoluteFill
          style={{
            transform: tf(0.3),
            transformOrigin: '50% 60%',
            mixBlendMode: 'screen',
            opacity: 0.75 + 0.1 * Math.sin(frame / 3.1) * Math.sin(frame / 1.7),
            background: `radial-gradient(circle at ${v.glow.x * 100}% ${v.glow.y * 100}%, ${v.glow.color ?? 'rgba(255,170,80,0.55)'} 0%, transparent ${(v.glow.r ?? 0.25) * 100}%)`,
          }}
        />
      )}
      {layers.map((l, i) => {
        const lo = l.at ? interpolate(frame, [Math.round(D * l.at), Math.round(D * l.at) + 12], [0, 1], clamp) : 1;
        const [mx, my] = l.move ?? [0, 0];
        const by = l.bob ? Math.sin(frame / 7) * l.bob : 0;
        return (
          <AbsoluteFill key={i} style={{transform: tf(l.depth ?? 0.5), transformOrigin: '50% 60%', opacity: lo}}>
            <div
              style={{
                position: 'absolute',
                left: l.x * W,
                top: l.y * H,
                height: l.h * H,
                transform: `translate(calc(-50% + ${mx * u}px), calc(-100% + ${my * u + by}px))${l.flip ? ' scaleX(-1)' : ''}`,
              }}
            >
              {/* Ảnh nhân vật vẽ với ánh sáng ban ngày: hạ sáng/bão hòa theo không khí của nền (v.grade). */}
              <Img src={asset(project, l.img)} style={{height: '100%', display: 'block', filter: v.grade ?? undefined}} />
              {(l.rotors ?? []).map((r, k) => {
                // Cánh quạt quay bằng code (như 2026-test-huey): đĩa mờ + một cánh co giãn theo cos (lật qua lại).
                const ph = (frame * (r.rps ?? 5) * 2 * Math.PI) / fps + k;
                return (
                  <div key={k} style={{position: 'absolute', left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: 0, height: 0}}>
                    <div style={{position: 'absolute', left: -r.w * l.h * H / 2, top: -r.w * l.h * H * (r.tilt ?? 0.06) / 2, width: r.w * l.h * H, height: r.w * l.h * H * (r.tilt ?? 0.06), borderRadius: '50%', background: 'rgba(40,40,36,0.22)'}} />
                    <div style={{position: 'absolute', left: -r.w * l.h * H / 2, top: -3, width: r.w * l.h * H, height: 6, background: 'rgba(30,30,28,0.85)', borderRadius: 3, transform: `scaleX(${Math.cos(ph)})`}} />
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        );
      })}
      {v.tint && <AbsoluteFill style={{background: v.tint, mixBlendMode: 'multiply'}} />}
      {v.wash && (
        // Bụi gió cánh quạt: hạt tỏa ra hai bên từ điểm chạm đất, mờ dần theo khoảng cách.
        <svg width={W} height={H} style={{position: 'absolute', inset: 0, filter: 'blur(10px)'}}>
          {Array.from({length: 70}, (_, i) => {
            const dir = i % 2 ? 1 : -1;
            const life = 45 + (i % 7) * 6;
            const ph = ((frame + i * 13) % life) / life;
            const x = v.wash.x * W + dir * ph * W * (0.18 + (i % 5) * 0.05);
            const y = v.wash.y * H - ph * H * (0.02 + (i % 4) * 0.025) + ((i * 37) % 30) - 15;
            return <circle key={i} cx={x} cy={y} r={6 + (i % 6) * 5 + ph * 18} fill="#c8b48a" opacity={0.28 * (1 - ph)} />;
          })}
        </svg>
      )}
      {v.smoke && (
        // Khói: các đốm mờ lớn trôi lên và sang phải, lặp vòng.
        <AbsoluteFill style={{filter: 'blur(28px)', opacity: 0.7}}>
          {Array.from({length: 14}, (_, i) => {
            const life = 260 + (i % 4) * 60;
            const ph = ((frame + i * 41) % life) / life;
            const x = ((i * 0.137) % 1) * W + ph * W * 0.18;
            const y = H * (0.75 - ph * 0.8);
            const r = 120 + (i % 5) * 50 + ph * 160;
            return (
              <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: i % 3 ? '#4a4640' : '#77706a', opacity: Math.sin(Math.PI * ph) * 0.55}} />
            );
          })}
        </AbsoluteFill>
      )}
      {v.embers && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
          {Array.from({length: 50}, (_, i) => {
            const life = 70 + (i % 9) * 10;
            const ph = ((frame + i * 17) % life) / life;
            const x = ((i * 0.293) % 1) * W + Math.sin(frame / 9 + i) * 18 + ph * 60;
            const y = H * (0.95 - ph * 0.7);
            return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} fill={i % 4 ? '#ff9a3c' : '#ffd27a'} opacity={(1 - ph) * 0.9} />;
          })}
        </svg>
      )}
      {v.dust && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 40}, (_, i) => {
            const sx = (i * 977) % W;
            const sy = (i * 613) % H;
            const x = (sx + frame * (0.4 + (i % 5) * 0.15)) % W;
            const y = (sy - frame * (0.2 + (i % 3) * 0.1) + H) % H;
            return <circle key={i} cx={x} cy={y} r={1 + (i % 3)} fill="#ffd9a0" opacity={0.18 + (i % 4) * 0.06} />;
          })}
        </svg>
      )}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 55%, ${T.vignette} 100%)`}} />
      {(v.tags ?? []).map((g: {text: string; x: number; y: number; at?: number; big?: boolean; sub?: string}, i: number) => {
        const go = interpolate(frame, [Math.round(D * (g.at ?? 0.2)), Math.round(D * (g.at ?? 0.2)) + 10], [0, 1], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: g.x * W, top: g.y * H, opacity: go, transform: `translateY(${(1 - go) * 12}px)`}}>
            <div style={{background: T.paperEdge, borderLeft: `${g.big ? 12 : 8}px solid ${T.red}`, padding: g.big ? '10px 26px 14px' : '8px 18px', boxShadow: `0 6px 10px ${T.shadow}`, fontFamily: F.display, fontSize: g.big ? 96 : 40, lineHeight: 1.05, color: g.big ? T.red : T.ink, letterSpacing: 1.5, whiteSpace: 'nowrap'}}>
              {t(g.text)}
              {g.sub && <div style={{fontFamily: F.body, fontSize: 26, color: T.ink, letterSpacing: 0.5, marginTop: 4}}>{t(g.sub)}</div>}
            </div>
          </div>
        );
      })}
      {v.stamp && (
        <div style={{position: 'absolute', left: W * (v.stamp.x ?? 0.5), top: H * 0.44, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
          <StampText text={t(v.stamp.text)} at={Math.round(D * (v.stamp.at ?? 0.08))} size={v.stamp.size ?? 150} color={v.stamp.color === 'ink' ? T.ink : T.red} boxed />
          {v.stamp.sub && (
            <div style={{opacity: interpolate(frame, [Math.round(D * (v.stamp.at ?? 0.08)) + 12, Math.round(D * (v.stamp.at ?? 0.08)) + 22], [0, 1], clamp)}}>
              <Tape text={t(v.stamp.sub)} rot={-1.5} size={30} />
            </div>
          )}
        </div>
      )}
      {v.caption && (
        <div style={{position: 'absolute', left: W * 0.05, top: H * 0.07}}>
          <Tape text={t(v.caption)} rot={-2} size={28} />
        </div>
      )}
      {v.label && (
        <div style={{position: 'absolute', right: W * 0.04, top: H * 0.07}}>
          <Tape text={t(v.label)} rot={2} size={20} />
        </div>
      )}
    </AbsoluteFill>
  );
};

export const HISTORY_SHOTS: Record<string, K> = {
  stage: Stage,
  scene: Scene,
  docscan: DocScan,
  calendar: Calendar,
  unitchart: UnitChart,
  people: People,
  versus: Versus,
};
