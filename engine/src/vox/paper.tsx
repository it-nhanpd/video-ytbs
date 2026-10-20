import React, {useMemo} from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {voxTheme as T} from '../theme';
import {voxFonts as F} from './fonts';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Ảnh của dự án: src tương đối với content/projects/<p>/assets/.
export const asset = (project: string, src: string) => staticFile(`projects/${project}/assets/${src}`);

// Vật "rơi" vào khung: spring hơi nảy. Trả về 0→1.
export const useEnter = (at: number, stiffness = 140, damping = 13) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: {stiffness, damping}});
};

// SVG defs dùng chung: viền chữ "đóng dấu" nhòe mực.
export const VoxDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="vox-rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
      </filter>
      <filter id="vox-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
  </svg>
);

// Nền giấy ngà + hạt + vignette. dark: giấy tối cho cảnh nặng.
export const PaperBG: React.FC<{dark?: boolean}> = ({dark}) => (
  <AbsoluteFill style={{background: dark ? T.paperDark : T.paper}}>
    <AbsoluteFill style={{filter: 'url(#vox-grain)', opacity: dark ? 0.16 : 0.22, mixBlendMode: dark ? 'screen' : 'multiply', background: '#fff'}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 55%, ${T.vignette} 100%)`}} />
  </AbsoluteFill>
);

// Hạt phủ trên cùng, đổi mẫu theo 12 fps (cảm giác in/stop-motion).
export const GrainTop: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const step = Math.floor(frame / (fps / 12));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.07, mixBlendMode: 'overlay'}}>
      <svg width="100%" height="100%">
        <filter id={`g${step % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={step % 6} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${step % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

// Ảnh nền toàn khung (minh họa AI), phóng chậm.
export const BgImage: React.FC<{src: string; opacity?: number; dim?: number}> = ({src, opacity = 1, dim = 0}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const s = interpolate(frame, [0, durationInFrames], [1.07, 1.0]);
  return (
    <AbsoluteFill style={{opacity}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`}} />
      {dim > 0 && <AbsoluteFill style={{background: `rgba(16,14,12,${dim})`}} />}
    </AbsoluteFill>
  );
};

// Viền giấy xé: đa giác lởm chởm, ổn định theo seed.
const tornPolygon = (seed: string, amp = 1.1, steps = 26) => {
  const pts: string[] = [];
  const j = (i: number) => random(`${seed}-${i}`) * amp;
  for (let i = 0; i <= steps; i++) pts.push(`${(i / steps) * 100}% ${j(i)}%`);
  for (let i = 0; i <= steps; i++) pts.push(`${100 - j(100 + i)}% ${(i / steps) * 100}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${(i / steps) * 100}% ${100 - j(200 + i)}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${j(300 + i)}% ${(i / steps) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

// Băng keo giấy kèm chữ nhỏ (chú thích nguồn ảnh).
export const Tape: React.FC<{text: string; rot?: number; size?: number}> = ({text, rot = -2, size = 20}) => (
  <div
    style={{
      display: 'inline-block',
      background: T.tape,
      color: T.ink,
      fontFamily: F.mono,
      fontSize: size,
      padding: '6px 14px',
      transform: `rotate(${rot}deg)`,
      boxShadow: `0 2px 4px ${T.shadow}`,
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </div>
);

export type CutoutProps = {
  src: string;
  x: number; // tâm, px
  y: number;
  w: number; // bề rộng, px
  rot?: number;
  at?: number; // frame bắt đầu vào
  caption?: string;
  halftone?: boolean;
  seed?: string;
  children?: React.ReactNode; // nhãn/tag gắn theo ảnh
};

// Ảnh tư liệu cắt kiểu giấy: viền trắng xé, bóng đổ, rơi vào khung.
export const Cutout: React.FC<CutoutProps> = ({src, x, y, w, rot = 0, at = 0, caption, halftone, seed = src, children}) => {
  const e = useEnter(at);
  const clip = useMemo(() => tornPolygon(seed), [seed]);
  if (e <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        transform: `translate(-50%, -50%) translateY(${(1 - e) * -70}px) rotate(${rot + (1 - e) * 7}deg) scale(${1.14 - 0.14 * e})`,
        opacity: Math.min(1, e * 2.2),
        filter: `drop-shadow(0 10px 14px ${T.shadow})`,
      }}
    >
      <div style={{background: T.paperEdge, padding: Math.round(w * 0.025), clipPath: clip}}>
        <div style={{position: 'relative'}}>
          <Img src={src} style={{width: '100%', display: 'block', filter: halftone ? 'grayscale(1) contrast(1.35) brightness(1.05)' : 'saturate(0.8) contrast(1.05) sepia(0.12)'}} />
          {halftone && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle, rgba(20,20,20,0.55) 1.1px, transparent 1.9px)',
                backgroundSize: '6px 6px',
                mixBlendMode: 'multiply',
              }}
            />
          )}
        </div>
      </div>
      {caption && (
        <div style={{position: 'absolute', right: -10, bottom: -18}}>
          <Tape text={caption} rot={-3} size={17} />
        </div>
      )}
      {children}
    </div>
  );
};

// Chữ lớn đóng dấu (Anton), rơi mạnh + rung nhẹ.
export const StampText: React.FC<{
  text: string;
  at?: number;
  size?: number;
  color?: string;
  rot?: number;
  boxed?: boolean;
  style?: React.CSSProperties;
}> = ({text, at = 0, size = 220, color = T.ink, rot = -3, boxed, style}) => {
  const frame = useCurrentFrame();
  const e = useEnter(at, 260, 16);
  if (e <= 0.001) return null;
  const shake = frame - at < 8 && frame >= at ? (random(`sh${frame}`) - 0.5) * 8 : 0;
  return (
    <div
      style={{
        fontFamily: F.display,
        fontSize: size,
        lineHeight: 1,
        color,
        transform: `translate(${shake}px, ${shake / 2}px) rotate(${rot}deg) scale(${2 - e})`,
        opacity: Math.min(1, e * 1.6),
        filter: 'url(#vox-rough)',
        letterSpacing: size * 0.01,
        whiteSpace: 'pre',
        ...(boxed
          ? {border: `${Math.max(6, size * 0.05)}px solid ${color}`, padding: `${size * 0.06}px ${size * 0.16}px`, background: T.stampPlate}
          : {}),
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Vòng tròn bút dạ đỏ vẽ dần quanh một vùng.
export const MarkerCircle: React.FC<{x: number; y: number; w: number; h: number; at: number; dur?: number; color?: string}> = ({
  x,
  y,
  w,
  h,
  at,
  dur = 14,
  color = T.red,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], clamp);
  if (p <= 0) return null;
  const rx = w / 2;
  const ry = h / 2;
  // Elip hở một chút ở đầu nét như vẽ tay.
  const d = `M ${x + rx * 0.9} ${y - ry * 0.55} A ${rx} ${ry} 0 1 0 ${x + rx * 1.02} ${y - ry * 0.1} A ${rx} ${ry} 0 0 0 ${x + rx * 0.7} ${y - ry * 0.8}`;
  const len = Math.PI * (rx + ry) * 1.4;
  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%">
      <path d={d} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={0.92} />
    </svg>
  );
};

// Gạch chéo đỏ (X) vẽ dần.
export const RedX: React.FC<{size: number; at: number}> = ({size, at}) => {
  const frame = useCurrentFrame();
  const p1 = interpolate(frame, [at, at + 6], [0, 1], clamp);
  const p2 = interpolate(frame, [at + 5, at + 11], [0, 1], clamp);
  const L = size * 1.42;
  return (
    <svg width={size} height={size} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <line x1={size * 0.08} y1={size * 0.08} x2={size * 0.92} y2={size * 0.92} stroke={T.red} strokeWidth={size * 0.07} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p1)} />
      <line x1={size * 0.92} y1={size * 0.08} x2={size * 0.08} y2={size * 0.92} stroke={T.red} strokeWidth={size * 0.07} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p2)} />
    </svg>
  );
};
