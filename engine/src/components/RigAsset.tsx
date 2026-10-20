import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {LayerT, RigLayerT} from '../schema';
import {noise2D} from '@remotion/noise';
import {fx} from '../theme';
import {overScene} from '../utils';
import {angleSet, apply, mul, rigBounds, solveRig, translate, walkAngles, type Mat} from '../walkCycle';

type Props = {layer: RigLayerT; durationInFrames: number; allLayers: LayerT[]};

// Nhân vật rig: động học thuận từ cây bộ phận + chu kỳ đi chung. Chân luôn chạm đất (tự tính từ gót/mũi thấp nhất).
// Hỗ trợ: đổi bộ phận sang layer rig khác theo mốc (kèm tia sáng), vòng chú thích, vũ khí và tư thế mang/ngắm.
export const RigAsset: React.FC<Props> = ({layer, durationInFrames, allLayers}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const sec = frame / fps;

  // Bộ phận hiệu lực tại thời điểm này: áp các lần đổi đã tới.
  const parts = layer.parts.map((p) => ({...p}));
  for (const sw of layer.swaps) {
    if (sec < sw.atSec) continue;
    const src = allLayers.find((l) => l.id === sw.fromLayer);
    const repl = src && src.type === 'rig' ? src.parts.find((p) => p.id === sw.part) : undefined;
    const i = parts.findIndex((p) => p.id === sw.part);
    if (repl && i >= 0) parts[i] = {...repl};
  }
  if (layer.weapon && sec >= layer.weapon.fromSec) {
    const w = layer.weapon;
    parts.push({id: 'weapon', src: w.src, parent: w.parent, w: w.w, h: w.h, pivot: w.pivot, attach: w.attach, z: 17, joint: 'weapon', shade: 1});
  }

  // Cỡ chuẩn hóa theo bộ phận gốc của layer (không đổi khi hoán đổi bộ phận, tránh nhân vật giật to nhỏ).
  const standing = solveRig(layer.parts, walkAngles(0, false));
  const sb = rigBounds(layer.parts, standing);
  const scale = (layer.height * height) / (sb.maxY - sb.minY);

  // Bước đi không đều tuyệt đối: pha dao động chậm + biên độ thân/đầu/súng lệch nhẹ (chống cảm giác máy móc).
  const t = sec / layer.cycleSec + layer.phase + noise2D(`${layer.id}-ph`, sec * 0.35, 0) * 0.035;
  const ang = angleSet(t, layer.moving, sec, layer.poses, layer.crouch);
  // Góc súng trong tư thế tính theo tay trên; nếu súng gắn vào cẳng tay thì trừ góc khuỷu để súng giữ hướng.
  ang.upperArmN = (ang.upperArmN ?? 0) * layer.armSwing + layer.armBias;
  ang.upperArmF = (ang.upperArmF ?? 0) * layer.armSwing + layer.armBias;
  ang.torso = (ang.torso ?? 0) + noise2D(`${layer.id}-tr`, sec * 0.9, 0) * 1.2;
  ang.head = (ang.head ?? 0) + noise2D(`${layer.id}-hd`, sec * 0.8, 0) * 1.8;
  ang.weapon = (ang.weapon ?? 0) + noise2D(`${layer.id}-wp`, sec * 1.3, 0) * 1.6;
  if (layer.weapon?.parent === 'foreArmN') ang.weapon = (ang.weapon ?? 0) - (ang.foreArmN ?? 0);
  let world = solveRig(parts, ang);
  // Cầm hai tay: tay xa (2 đoạn) tự đưa bàn tay tới điểm nắm trên súng bằng IK hai đoạn.
  const sup = layer.weapon?.support;
  const wpn = parts.find((p) => p.id === 'weapon');
  const uF = parts.find((p) => p.id === 'upperArmF');
  const fF = parts.find((p) => p.id === 'foreArmF');
  if (sup && wpn && uF && fF) {
    const T = apply(world.get('weapon')!, sup[0] * wpn.w, sup[1] * wpn.h);
    const S = apply(world.get('upperArmF')!, uF.pivot[0] * uF.w, uF.pivot[1] * uF.h);
    const L1 = ((fF.attach?.[1] ?? 0.93) - uF.pivot[1]) * uF.h;
    const L2 = (0.8 - fF.pivot[1]) * fF.h; // lòng bàn tay (không phải đầu ngón)
    const dx = T[0] - S[0];
    const dy = T[1] - S[1];
    const D = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(L1 - L2) + 1), (L1 + L2) * 0.999);
    const phi = Math.atan2(dy, dx);
    const al = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + D * D - L2 * L2) / (2 * L1 * D))));
    const e = Math.sin(phi + al) > Math.sin(phi - al) ? phi + al : phi - al; // khuỷu nằm phía dưới
    const E: [number, number] = [S[0] + L1 * Math.cos(e), S[1] + L1 * Math.sin(e)];
    const th1 = Math.atan2(-Math.cos(e), Math.sin(e));
    const fx = T[0] - E[0];
    const fy = T[1] - E[1];
    const th2 = Math.atan2(-fx, fy);
    const deg = (r: number) => (r * 180) / Math.PI;
    ang.upperArmF = deg(th1) - (ang.torso ?? 0);
    ang.foreArmF = deg(th2) - deg(th1);
    world = solveRig(parts, ang);
    // Tay xa nằm trước thân (nhưng sau súng) khi cầm hai tay.
    uF.z = 12.2;
    fF.z = 12.4;
  }
  // Mặt đất theo bàn chân; ảnh không có bàn chân rời (cẳng chân đã gồm giày) thì theo cẳng chân.
  const hasFoot = parts.some((p) => p.joint.startsWith('foot'));
  const feet = rigBounds(parts, world, (p) => p.joint.startsWith(hasFoot ? 'foot' : 'shin'));
  const cx = overScene(frame, durationInFrames, layer.x, layer.ease) * width;
  const groundPx = layer.groundY * height;
  const root: Mat = mul(translate(cx, groundPx - feet.maxY * scale), [scale, 0, 0, scale, 0, 0]);
  const fadeIn = interpolate(sec, [layer.appearSec, layer.appearSec + 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (fadeIn <= 0) return null;

  // Tâm và bán kính (px màn hình) của một bộ phận, để đặt tia sáng/vòng chú thích bám theo khi nó chuyển động.
  const partCircle = (id: string) => {
    const p = parts.find((q) => q.id === id);
    const m = p ? world.get(p.id) : undefined;
    if (!p || !m) return null;
    const [x, y] = apply(mul(root, m), p.w / 2, p.h / 2);
    return {x, y, r: (Math.max(p.w, p.h) * scale) / 2};
  };
  // Tia sáng che khoảnh khắc đổi bộ phận: sáng lên 0,15 s trước mốc, tắt dần 0,45 s sau.
  const flashOf = (atSec: number) => interpolate(sec, [atSec - 0.15, atSec, atSec + 0.45], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const glow = new Map<string, number>();
  for (const sw of layer.swaps) {
    const k = flashOf(sw.atSec);
    if (k > 0) glow.set(sw.part, Math.max(glow.get(sw.part) ?? 0, k));
  }

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      {layer.shadow ? <svg width={width} height={height} style={{position: 'absolute', left: 0, top: 0, zIndex: -1, overflow: 'visible'}}>
        {/* Bóng elip dưới chân: dẹt, co lại một chút khi chân nâng */}
        <ellipse cx={cx} cy={groundPx + 4} rx={layer.height * height * 0.17} ry={layer.height * height * 0.022} fill={fx.groundShadow} opacity={0.28} />
      </svg> : null}
      {layer.moving && layer.dust
        ? (['N', 'F'] as const).map((side, i) => {
            // Chạm gót: chân gần ở pha 0, chân xa ở pha 0,5. Bụi bốc lên và trôi ra sau trong ~0,45 s.
            const age = (((t + (i === 0 ? 0 : 0.5)) % 1) + 1) % 1 * layer.cycleSec;
            if (age > 0.45) return null;
            const fp = parts.find((p) => p.joint === (hasFoot ? `foot${side}` : `shin${side}`));
            const m = fp ? world.get(fp.id) : undefined;
            if (!fp || !m) return null;
            const [px] = apply(mul(root, m), fp.w * 0.3, fp.h * 0.5);
            const k = age / 0.45;
            const r = layer.height * height * (0.03 + 0.05 * k);
            return (
              <svg key={side} width={width} height={height} style={{position: 'absolute', left: 0, top: 0, zIndex: 390, overflow: 'visible'}}>
                {[0, 1, 2].map((j) => (
                  <circle key={j} cx={px - (14 + 22 * k) * (j + 1)} cy={groundPx - (6 + 26 * k) * (1 + j * 0.35)} r={r * (1 - j * 0.2)} fill={fx.dust} opacity={0.5 * (1 - k)} />
                ))}
              </svg>
            );
          })
        : null}
      {parts.map((p) => {
        const m = mul(root, world.get(p.id)!);
        return (
          <Img
            key={p.id}
            src={staticFile(p.src)}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: p.w,
              height: p.h,
              transformOrigin: '0 0',
              transform: `matrix(${m[0]}, ${m[1]}, ${m[2]}, ${m[3]}, ${m[4]}, ${m[5]})`,
              zIndex: Math.round(p.z * 10),
              filter: p.shade < 1 || glow.has(p.id) ? `brightness(${p.shade * (1 + 0.9 * (glow.get(p.id) ?? 0))})` : undefined,
            }}
          />
        );
      })}
      {[...glow].map(([id, k]) => {
        const c = partCircle(id);
        if (!c) return null;
        const r = c.r * (1.1 + 0.5 * k);
        return (
          <div
            key={`flash-${id}`}
            style={{
              position: 'absolute',
              left: c.x - r,
              top: c.y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${fx.swapFlash} 0%, ${fx.swapFlashMid} 40%, ${fx.swapFlashEdge} 70%)`,
              opacity: k,
              mixBlendMode: 'screen',
              zIndex: 400,
            }}
          />
        );
      })}
      {layer.callouts.map((co, i) => {
        // Vòng chú thích: vẽ dần 0,3 s, giữ, mờ đi 0,25 s cuối. Nhãn chữ là chip ở cấp cảnh.
        const k = sec - co.atSec;
        if (k < 0 || k > co.durSec) return null;
        const c = partCircle(co.part);
        if (!c) return null;
        const r = c.r * 1.25;
        const draw = interpolate(k, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'});
        const o = interpolate(k, [co.durSec - 0.25, co.durSec], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const len = 2 * Math.PI * r;
        return (
          <svg key={`callout-${i}`} width={width} height={height} style={{position: 'absolute', left: 0, top: 0, zIndex: 410, overflow: 'visible', opacity: o}}>
            <circle cx={c.x} cy={c.y} r={r} fill="none" stroke={fx.calloutShadow} strokeWidth={9} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} transform={`rotate(-90 ${c.x} ${c.y})`} />
            <circle cx={c.x} cy={c.y} r={r} fill="none" stroke={fx.callout} strokeWidth={5} strokeDasharray={len} strokeDashoffset={len * (1 - draw)} transform={`rotate(-90 ${c.x} ${c.y})`} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};
