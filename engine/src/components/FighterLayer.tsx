import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {FighterLayerT} from '../schema';
import {Soldier, cast, toon} from '../theme';
import {JointName, Joints, Pt, headAngle, joints} from '../stick/pose';
import {Expr, fighterExpr, fighterPose} from '../stick/moves';

type Fx = FighterLayerT['fx'][number];
type FighterDef = FighterLayerT['fighters'][number];

// Giữ hình: frame hiệu lực không chạy trong [at, at+frames), phần sau dịch lùi.
const effectiveFrame = (frame: number, fx: Fx[]) => {
  let eff = frame;
  for (const f of fx) {
    if (f.kind !== 'freeze') continue;
    if (frame >= f.at + f.frames) eff -= f.frames;
    else if (frame >= f.at) eff = Math.min(eff, f.at);
  }
  return eff;
};

const noise = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const shakeOffset = (frame: number, fx: Fx[]): Pt => {
  let x = 0;
  let y = 0;
  for (const f of fx) {
    if (f.kind !== 'shake' || frame < f.at || frame >= f.at + f.dur) continue;
    const decay = 1 - (frame - f.at) / f.dur;
    x += (noise(frame * 2) - 0.5) * 2 * f.amp * decay;
    y += (noise(frame * 2 + 1) - 0.5) * 2 * f.amp * decay;
  }
  return {x, y};
};

const P = (...pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
const sub = (a: Pt, b: Pt): Pt => ({x: a.x - b.x, y: a.y - b.y});
const add = (a: Pt, b: Pt): Pt => ({x: a.x + b.x, y: a.y + b.y});
const mul = (a: Pt, k: number): Pt => ({x: a.x * k, y: a.y * k});
const unit = (a: Pt): Pt => {
  const l = Math.hypot(a.x, a.y) || 1;
  return {x: a.x / l, y: a.y / l};
};

// Chi dạng ống: viền mực dày bên dưới, màu phía trên.
const Limb: React.FC<{pts: Pt[]; w: number; o: number; color: string}> = ({pts, w, o, color}) => (
  <>
    <path d={P(...pts)} stroke={toon.ink} strokeWidth={w + 2 * o} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d={P(...pts)} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
);

const Glove: React.FC<{at: Pt; r: number; o: number; color: string}> = ({at, r, o, color}) => (
  <circle cx={at.x} cy={at.y} r={r} fill={color} stroke={toon.ink} strokeWidth={o * 1.6} />
);

const Shoe: React.FC<{knee: Pt; ankle: Pt; facing: 1 | -1; R: number; o: number; color?: string; big?: boolean}> = ({knee, ankle, facing, R, o, color = toon.shoe, big}) => {
  const s = unit(sub(ankle, knee));
  const fd = unit({x: facing * s.y, y: -facing * s.x}); // hướng bàn chân: vuông góc cẳng chân, về phía trước
  const c = add(ankle, mul(fd, 0.45 * R));
  const deg = (Math.atan2(fd.y, fd.x) * 180) / Math.PI;
  return <ellipse cx={0} cy={0} rx={(big ? 1.15 : 1.0) * R} ry={(big ? 0.55 : 0.5) * R} transform={`translate(${c.x},${c.y}) rotate(${deg})`} fill={color} stroke={toon.ink} strokeWidth={o * 1.6} />;
};

// Khuôn mặt vẽ theo hệ cục bộ: nhìn sang phải (+x), lên là -y, đơn vị = bán kính đầu H.
const Face: React.FC<{expr: Expr; H: number; o: number}> = ({expr, H, o}) => {
  const ink = {stroke: toon.ink, strokeWidth: o * 1.1, strokeLinecap: 'round' as const, fill: 'none'};
  const eyes = [0.18, 0.66];
  return (
    <g>
      {expr === 'neutral' || expr === 'shout'
        ? eyes.map((x, i) => (
            <g key={i}>
              <ellipse cx={x * H} cy={-0.12 * H} rx={0.19 * H} ry={expr === 'shout' ? 0.2 * H : 0.28 * H} fill={toon.white} stroke={toon.ink} strokeWidth={o * 0.9} />
              <circle cx={(x + 0.07) * H} cy={-0.12 * H} r={0.09 * H} fill={toon.ink} />
              <path d={P({x: (x - 0.28) * H, y: (i ? -0.5 : -0.58) * H}, {x: (x + 0.26) * H, y: (i ? -0.62 : -0.38) * H})} {...ink} strokeWidth={o * 1.5} />
            </g>
          ))
        : null}
      {expr === 'hurt'
        ? eyes.map((x, i) => (
            <path key={i} d={P({x: (x - 0.2) * H, y: -0.3 * H}, {x: (x + 0.12) * H, y: -0.12 * H}, {x: (x - 0.2) * H, y: 0.04 * H})} {...ink} strokeWidth={o * 1.4} />
          ))
        : null}
      {expr === 'ko'
        ? eyes.map((x, i) => (
            <g key={i}>
              <path d={P({x: (x - 0.15) * H, y: -0.27 * H}, {x: (x + 0.15) * H, y: 0.03 * H})} {...ink} strokeWidth={o * 1.4} />
              <path d={P({x: (x + 0.15) * H, y: -0.27 * H}, {x: (x - 0.15) * H, y: 0.03 * H})} {...ink} strokeWidth={o * 1.4} />
            </g>
          ))
        : null}
      {/* mũi */}
      <circle cx={0.98 * H} cy={0.12 * H} r={0.16 * H} fill="inherit" stroke={toon.ink} strokeWidth={o * 0.9} />
      {/* miệng */}
      {expr === 'neutral' ? <path d={P({x: 0.3 * H, y: 0.55 * H}, {x: 0.85 * H, y: 0.52 * H})} {...ink} strokeWidth={o * 1.4} /> : null}
      {expr === 'shout' ? (
        <g>
          <ellipse cx={0.58 * H} cy={0.55 * H} rx={0.3 * H} ry={0.24 * H} fill={toon.mouth} stroke={toon.ink} strokeWidth={o * 0.9} />
          <ellipse cx={0.58 * H} cy={0.64 * H} rx={0.16 * H} ry={0.09 * H} fill={toon.tongue} />
        </g>
      ) : null}
      {expr === 'hurt' ? <path d={P({x: 0.25 * H, y: 0.6 * H}, {x: 0.42 * H, y: 0.5 * H}, {x: 0.6 * H, y: 0.6 * H}, {x: 0.78 * H, y: 0.5 * H})} {...ink} strokeWidth={o * 1.4} /> : null}
      {expr === 'ko' ? (
        <g>
          <ellipse cx={0.55 * H} cy={0.55 * H} rx={0.26 * H} ry={0.3 * H} fill={toon.mouth} stroke={toon.ink} strokeWidth={o * 0.9} />
          <ellipse cx={0.6 * H} cy={0.7 * H} rx={0.17 * H} ry={0.12 * H} fill={toon.tongue} />
        </g>
      ) : null}
    </g>
  );
};

// Mũ trong hệ cục bộ của đầu (nhìn sang phải). Mép dưới mũ nằm trên mắt.
const Helmet: React.FC<{s: Soldier; H: number; o: number}> = ({s, H, o}) => {
  const sw = o * 1.6;
  if (s.helmet === 'stahlhelm')
    return (
      <g>
      <path
        d={`M${-H * 1.12},${-H * 0.55} A${H * 1.12},${H * 1.0} 0 0 1 ${H * 1.1},${-H * 0.55} L${H * 1.0},${-H * 0.4} L${-H * 0.9},${-H * 0.4} L${-H * 1.3},${H * 0.35} L${-H * 1.0},${H * 0.38} Z`}
        fill={s.helmetColor}
        stroke={toon.ink}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      {s.lug ? <rect x={H * 0.05} y={-H * 1.25} width={H * 0.34} height={H * 0.28} rx={H * 0.08} fill={s.helmetColor} stroke={toon.ink} strokeWidth={o} /> : null}
      </g>
    );
  return (
    <g>
      <path
        d={`M${-H * 1.05},${-H * 0.55} A${H * 1.05},${H * 0.9} 0 0 1 ${H * 1.05},${-H * 0.55} L${H * 1.45},${-H * 0.5} L${-H * 1.05},${-H * 0.5} Z`}
        fill={s.helmetColor}
        stroke={toon.ink}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path d={`M${-H * 0.2},${-H * 1.38} L0,${-H * 1.95} L${H * 0.2},${-H * 1.38} Z`} fill={s.brass} stroke={toon.ink} strokeWidth={o} strokeLinejoin="round" />
      <circle cx={H * 0.45} cy={-H * 0.95} r={H * 0.2} fill={s.brass} stroke={toon.ink} strokeWidth={o} />
    </g>
  );
};

const Head: React.FC<{c: Pt; H: number; o: number; angle: number; facing: 1 | -1; look: (typeof cast)['red']; expr: Expr}> = ({c, H, o, angle, facing, look, expr}) => (
  <g transform={`translate(${c.x},${c.y}) rotate(${angle * facing}) scale(${facing},1)`}>
    {/* tóc phía sau */}
    {!look.soldier && look.hairStyle === 'spiky' ? (
      <path d={P({x: -H * 0.95, y: -H * 0.1}, {x: -H * 1.35, y: -H * 0.75}, {x: -H * 0.7, y: -H * 0.7}, {x: -H * 0.75, y: -H * 1.35}, {x: -H * 0.2, y: -H * 0.95}, {x: H * 0.1, y: -H * 1.5}, {x: H * 0.4, y: -H * 0.95}, {x: H * 0.8, y: -H * 1.2}, {x: H * 0.85, y: -H * 0.5})} fill={look.hair} stroke={toon.ink} strokeWidth={o * 1.6} strokeLinejoin="round" />
    ) : null}
    <circle cx={0} cy={0} r={H} fill={look.skin} stroke={toon.ink} strokeWidth={o * 1.8} />
    {!look.soldier && look.hairStyle === 'buzz' ? <path d={`M${-H * 0.93},${-H * 0.35} A${H},${H} 0 0 1 ${H * 0.93},${-H * 0.4} Q${0},${-H * 0.62} ${-H * 0.93},${-H * 0.35} Z`} fill={look.hair} /> : null}
    {!look.soldier && look.band ? <path d={`M${-H * 0.97},${-H * 0.5} Q0,${-H * 0.72} ${H * 0.97},${-H * 0.5} L${H * 0.9},${-H * 0.72} Q0,${-H * 0.95} ${-H * 0.9},${-H * 0.72} Z`} fill={look.band} stroke={toon.ink} strokeWidth={o * 0.8} /> : null}
    {/* tai */}
    <circle cx={-H * 0.85} cy={H * 0.1} r={H * 0.22} fill={look.skin} stroke={toon.ink} strokeWidth={o * 0.9} />
    <g fill={look.skin}>
      <Face expr={expr} H={H} o={o} />
    </g>
    {look.soldier ? <Helmet s={look.soldier} H={H} o={o} /> : null}
  </g>
);

const Fighter: React.FC<{f: FighterDef; j: Joints; R: number; angle: number; expr: Expr; floorY: number}> = ({f, j, R, angle, expr, floorY}) => {
  const look = cast[f.color];
  const sol = look.soldier;
  const o = 0.12 * R;
  const arm = 0.72 * R;
  const leg = 0.95 * R;
  const u = unit(sub(j.neck, j.hip));
  const pp = {x: -u.y, y: u.x};
  const legDir = unit(sub(add(j.knee1, j.knee2), mul(j.hip, 2)));
  const waist = add(j.hip, mul(u, 0.35 * R));
  const hemC = add(j.hip, mul(legDir, 1.3 * R));
  const shortsPath = P(add(waist, mul(pp, 1.0 * R)), add(hemC, mul(pp, 1.15 * R)), add(hemC, mul(pp, -1.15 * R)), add(waist, mul(pp, -1.0 * R))) + ' Z';
  const torsoPath = P(add(j.neck, mul(pp, 1.55 * R)), add(j.hip, mul(pp, 0.8 * R)), add(j.hip, mul(pp, -0.8 * R)), add(j.neck, mul(pp, -1.55 * R))) + ' Z';
  const shadowW = Math.max(2.2 * R, Math.abs(j.ankle1.x - j.ankle2.x) + 2.4 * R);
  const lying = Math.abs(j.head.y - j.hip.y) < 2 * R;
  const shadowX = lying ? (j.head.x + j.ankle1.x) / 2 : (j.ankle1.x + j.ankle2.x) / 2;

  return (
    <g>
      <ellipse cx={shadowX} cy={floorY + 0.25 * R} rx={lying ? 5.5 * R : shadowW} ry={0.5 * R} fill={toon.shadow} />
      <Limb pts={[j.neck, j.elbow2, j.wrist2]} w={arm} o={o} color={sol ? sol.tunic : look.skin} />
      <Limb pts={[j.hip, j.knee2, j.ankle2]} w={leg} o={o} color={sol ? sol.trousers : look.skin} />
      {sol ? <Limb pts={[add(j.knee2, mul(sub(j.ankle2, j.knee2), 0.35)), j.ankle2]} w={leg * 1.05} o={o} color={sol.boots} /> : null}
      <Shoe knee={j.knee2} ankle={j.ankle2} facing={f.facing} R={R} o={o} color={sol ? sol.boots : undefined} big={!!sol} />
      <path d={torsoPath} fill={sol ? sol.tunic : look.skin} stroke={toon.ink} strokeWidth={o * 2} strokeLinejoin="round" />
      {sol ? (
        <>
          <path d={P(add(j.neck, mul(pp, 0.7 * R)), add(j.neck, mul(pp, -0.7 * R)), add(j.neck, mul(u, -0.9 * R))) + ' Z'} fill={sol.collar} stroke={toon.ink} strokeWidth={o} strokeLinejoin="round" />
          <Limb pts={[add(waist, mul(pp, 0.85 * R)), add(waist, mul(pp, -0.85 * R))]} w={0.4 * R} o={o} color={sol.belt} />
        </>
      ) : (
        <path d={shortsPath} fill={look.main} stroke={toon.ink} strokeWidth={o * 2} strokeLinejoin="round" />
      )}
      <Limb pts={[j.hip, j.knee1, j.ankle1]} w={leg} o={o} color={sol ? sol.trousers : look.skin} />
      {sol ? <Limb pts={[add(j.knee1, mul(sub(j.ankle1, j.knee1), 0.35)), j.ankle1]} w={leg * 1.05} o={o} color={sol.boots} /> : null}
      <Shoe knee={j.knee1} ankle={j.ankle1} facing={f.facing} R={R} o={o} color={sol ? sol.boots : undefined} big={!!sol} />
      {sol?.canister ? <Limb pts={[add(j.hip, add(mul(pp, -0.5 * R), mul(u, 0.1 * R))), add(j.hip, add(mul(pp, -0.5 * R), mul(legDir, 1.4 * R)))]} w={0.85 * R} o={o} color={sol.canister} /> : null}
      <Glove at={j.wrist2} r={(sol ? 0.55 : 0.85) * R} o={o} color={sol ? look.skin : look.main} />
      <Head c={j.head} H={1.5 * R} o={o} angle={angle} facing={f.facing} look={look} expr={expr} />
      <Limb pts={[j.neck, j.elbow1, j.wrist1]} w={arm} o={o} color={sol ? sol.tunic : look.skin} />
      <Glove at={j.wrist1} r={(sol ? 0.55 : 0.85) * R} o={o} color={sol ? look.skin : look.main} />
    </g>
  );
};

// Sao va chạm 8 cánh, phóng to rồi mờ trong 6 frame.
const ImpactStar: React.FC<{at: Pt; t: number; size: number; R: number}> = ({at, t, size, R}) => {
  const scale = interpolate(t, [0, 2, 6], [0.5, 1.1, 1.3], {extrapolateRight: 'clamp'}) * size * R * 1.3;
  const opacity = interpolate(t, [0, 4, 6], [1, 1, 0], {extrapolateRight: 'clamp'});
  const pts = Array.from({length: 16}, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const r = i % 2 === 0 ? 1 : 0.45;
    return `${Math.cos(a) * r * scale},${Math.sin(a) * r * scale}`;
  }).join(' ');
  return (
    <g transform={`translate(${at.x},${at.y})`} opacity={opacity}>
      <polygon points={pts} fill={toon.impact} stroke={toon.impactEdge} strokeWidth={0.2 * R} strokeLinejoin="round" />
    </g>
  );
};

const SpeedLines: React.FC<{at: Pt; facing: 1 | -1; t: number; dur: number; R: number}> = ({at, facing, t, dur, R}) => {
  const opacity = interpolate(t, [0, dur], [1, 0], {extrapolateRight: 'clamp'});
  return (
    <g opacity={opacity} stroke={toon.white} strokeWidth={0.12 * R} strokeLinecap="round">
      {Array.from({length: 7}, (_, i) => {
        const dy = (i - 3) * R * 0.7;
        const len = R * (3 + noise(i + 3) * 3);
        const x0 = at.x - facing * R * (1.5 + noise(i) * 1.5);
        return <line key={i} x1={x0} y1={at.y + dy} x2={x0 - facing * len} y2={at.y + dy} />;
      })}
    </g>
  );
};

export const FighterLayer: React.FC<{layer: FighterLayerT}> = ({layer}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const R = layer.scale;
  const eff = effectiveFrame(frame, layer.fx);
  const shake = shakeOffset(frame, layer.fx);

  const jointsOf = (f: FighterDef, at: number) => joints(fighterPose(f.timeline, at), R, f.facing, f.x, layer.floorY);
  const find = (id: string) => {
    const f = layer.fighters.find((x) => x.id === id);
    if (!f) throw new Error(`Unknown fighter "${id}"`);
    return f;
  };
  // Vị trí khớp tại frame `at` của cảnh (đã tính giữ hình), dùng để neo hiệu ứng.
  const jointPos = (id: string, joint: JointName, at: number) => jointsOf(find(id), effectiveFrame(at, layer.fx))[joint];

  return (
    <AbsoluteFill>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${shake.x},${shake.y})`}>
          {layer.fighters.map((f) => (
            <Fighter key={f.id} f={f} j={jointsOf(f, eff)} R={R} angle={headAngle(fighterPose(f.timeline, eff))} expr={fighterExpr(f.timeline, eff)} floorY={layer.floorY} />
          ))}
          {layer.fx.map((fx, i) => {
            if (fx.kind === 'impact' && frame >= fx.at && frame <= fx.at + 6)
              return <ImpactStar key={i} at={jointPos(fx.fighter, fx.joint, fx.at)} t={frame - fx.at} size={fx.size} R={R} />;
            if (fx.kind === 'speedLines' && frame >= fx.at && frame < fx.at + fx.dur)
              return <SpeedLines key={i} at={jointPos(fx.fighter, fx.joint, frame)} facing={find(fx.fighter).facing} t={frame - fx.at} dur={fx.dur} R={R} />;
            return null;
          })}
        </g>
      </svg>
      {layer.fx.map((fx, i) => {
        if (fx.kind === 'flash' && frame >= fx.at && frame < fx.at + fx.dur)
          return <AbsoluteFill key={i} style={{background: toon.flash, opacity: 1 - (frame - fx.at) / fx.dur}} />;
        if (fx.kind === 'fade' && frame >= fx.at)
          return <AbsoluteFill key={i} style={{background: toon.fade, opacity: Math.min(1, (frame - fx.at) / fx.dur)}} />;
        return null;
      })}
    </AbsoluteFill>
  );
};
