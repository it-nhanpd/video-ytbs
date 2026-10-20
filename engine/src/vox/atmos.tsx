import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';

// Lớp không khí bằng code (tất định theo frame, nhẹ khi render). Shot khai báo `v.atmos: ["fog", "film"]`.
// Hiệu ứng phải khớp bối cảnh (reenactment-first.md): sương cho rừng/hồ, bụi trong luồng đèn cho phòng hồ sơ,
// đèn pin cho cảnh tìm kiếm đêm, phim cũ cho cảnh năm 1981. Không rải mọi shot.
export type AtmosName = 'fog' | 'dust' | 'rain' | 'flicker' | 'film' | 'embers' | 'beams' | 'lamp';

const Fog: React.FC<{seed: string}> = ({seed}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 5}, (_, i) => {
        const r = (k: string) => random(`${seed}fog${i}${k}`);
        const w = W * (0.7 + r('w') * 0.6);
        const speed = (0.25 + r('s') * 0.35) * (r('d') > 0.5 ? 1 : -1);
        const x = ((r('x') * W * 1.6 + frame * speed) % (W * 1.6)) - W * 0.3 - w / 2;
        const y = H * (0.45 + r('y') * 0.5) - w * 0.2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: w * 0.4,
              background: 'radial-gradient(ellipse at center, rgba(225,225,220,0.42) 0%, rgba(225,225,220,0) 70%)',
              opacity: 0.55 + 0.25 * Math.sin(frame / 50 + i),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Bụi lơ lửng; `beam` vẽ thêm một luồng sáng chéo (đèn bàn, cửa sổ).
const Dust: React.FC<{seed: string; beam?: boolean}> = ({seed, beam}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {beam && (
        <AbsoluteFill
          style={{
            background: 'linear-gradient(115deg, rgba(255,226,170,0) 18%, rgba(255,226,170,0.16) 32%, rgba(255,226,170,0.05) 46%, rgba(255,226,170,0) 55%)',
            mixBlendMode: 'screen',
          }}
        />
      )}
      {Array.from({length: 46}, (_, i) => {
        const r = (k: string) => random(`${seed}du${i}${k}`);
        const x = (r('x') * W + Math.sin(frame / (40 + r('a') * 40) + i) * 30 + frame * 0.15) % W;
        const y = (r('y') * H - frame * (0.1 + r('v') * 0.25) + H * 10) % H;
        const s = 1.5 + r('s') * 3;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (12 + r('t') * 20) + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: 'rgba(255,240,210,0.9)',
              opacity: tw * (beam ? 0.55 : 0.4),
              filter: s > 3.5 ? 'blur(1.5px)' : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Rain: React.FC<{seed: string}> = ({seed}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={W} height={H}>
        {Array.from({length: 110}, (_, i) => {
          const r = (k: string) => random(`${seed}ra${i}${k}`);
          const len = 30 + r('l') * 40;
          const v = 38 + r('v') * 20;
          const x = (r('x') * W * 1.2 + frame * 6) % (W * 1.2) - W * 0.1;
          const y = ((r('y') * H + frame * v) % (H + len)) - len;
          return <line key={i} x1={x} y1={y} x2={x - len * 0.18} y2={y + len} stroke="rgba(210,220,230,0.32)" strokeWidth={1.4} />;
        })}
      </svg>
      <AbsoluteFill style={{background: 'rgba(30,40,55,0.18)', mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};

// Ánh sáng chập chờn (bóng đèn cũ, đèn pin): sụt sáng ngẫu nhiên, thỉnh thoảng tắt hẳn 1–2 frame.
const Flicker: React.FC<{seed: string}> = ({seed}) => {
  const frame = useCurrentFrame();
  const r = random(`${seed}fl${frame}`);
  const drop = r > 0.97 ? 0.55 : r > 0.88 ? 0.18 : 0.04 * random(`${seed}fm${frame}`);
  return <AbsoluteFill style={{pointerEvents: 'none', background: `rgba(8,6,4,${drop})`}} />;
};

// Phim cũ (cảnh năm 1981): vết xước dọc, đốm bụi, ám nâu, cháy mép, nháy sáng nhẹ. Đổi mẫu theo 12 fps.
const Film: React.FC<{seed: string}> = ({seed}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const step = Math.floor(frame / (fps / 12));
  const r = (k: string) => random(`${seed}fi${step}${k}`);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'rgba(120,85,40,0.16)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 58%, rgba(30,18,6,0.55) 100%)'}} />
      <svg width={W} height={H} style={{position: 'absolute'}}>
        {Array.from({length: 3}, (_, i) =>
          r(`s${i}`) > 0.45 ? (
            <line key={i} x1={r(`x${i}`) * W} y1={0} x2={r(`x${i}`) * W + (r(`d${i}`) - 0.5) * 20} y2={H} stroke="rgba(245,235,215,0.35)" strokeWidth={1 + r(`w${i}`)} />
          ) : null,
        )}
        {Array.from({length: 6}, (_, i) =>
          r(`p${i}`) > 0.6 ? <circle key={`p${i}`} cx={r(`px${i}`) * W} cy={r(`py${i}`) * H} r={1 + r(`pr${i}`) * 3} fill="rgba(20,14,8,0.6)" /> : null,
        )}
      </svg>
      <AbsoluteFill style={{background: `rgba(255,245,225,${0.025 * r('fl')})`}} />
    </AbsoluteFill>
  );
};

const Embers: React.FC<{seed: string}> = ({seed}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 30}, (_, i) => {
        const r = (k: string) => random(`${seed}em${i}${k}`);
        const x = r('x') * W + Math.sin(frame / 20 + i) * 25;
        const y = H - ((r('y') * H + frame * (0.8 + r('v') * 1.4)) % (H * 1.1));
        return (
          <div
            key={i}
            style={{position: 'absolute', left: x, top: y, width: 3, height: 3, borderRadius: '50%', background: '#ffb35c', boxShadow: '0 0 6px #ff8a2a', opacity: 0.4 + 0.5 * r('o')}}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Đèn pin quét trong đêm (cảnh tìm kiếm): 3 chùm sáng hình nón đung đưa.
const Beams: React.FC<{seed: string}> = ({seed}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      {Array.from({length: 3}, (_, i) => {
        const r = (k: string) => random(`${seed}be${i}${k}`);
        const x0 = W * (0.2 + i * 0.3 + (r('x') - 0.5) * 0.1);
        const ang = -90 + (r('a') - 0.5) * 50 + Math.sin(frame / (28 + r('p') * 20) + i * 2) * 14;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0,
              top: H * (0.62 + r('y') * 0.12),
              width: H * 0.9,
              height: H * 0.22,
              transformOrigin: '0% 50%',
              transform: `translateY(-50%) rotate(${ang + 90 + (i - 1) * 20}deg)`,
              background: 'linear-gradient(90deg, rgba(255,240,200,0.5) 0%, rgba(255,240,200,0.12) 55%, rgba(255,240,200,0) 100%)',
              clipPath: 'polygon(0% 46%, 100% 0%, 100% 100%, 0% 54%)',
              filter: 'blur(6px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Quầng đèn bàn: tối mép, sáng ấm quanh (x, y), thở nhẹ.
const Lamp: React.FC<{x?: number; y?: number}> = ({x = 0.42, y = 0.4}) => {
  const frame = useCurrentFrame();
  const k = 1 + 0.015 * Math.sin(frame / 17);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `radial-gradient(ellipse ${62 * k}% ${70 * k}% at ${x * 100}% ${y * 100}%, rgba(255,214,150,0.10) 0%, rgba(0,0,0,0) 45%, rgba(6,4,2,0.62) 100%)`,
      }}
    />
  );
};

export const Atmos: React.FC<{list?: string[] | string; seed: string; lampX?: number; lampY?: number}> = ({list, seed, lampX, lampY}) => {
  const names = (Array.isArray(list) ? list : list ? [list] : []) as AtmosName[];
  return (
    <>
      {names.map((n) => {
        switch (n) {
          case 'fog':
            return <Fog key={n} seed={seed} />;
          case 'dust':
            return <Dust key={n} seed={seed} beam />;
          case 'rain':
            return <Rain key={n} seed={seed} />;
          case 'flicker':
            return <Flicker key={n} seed={seed} />;
          case 'film':
            return <Film key={n} seed={seed} />;
          case 'embers':
            return <Embers key={n} seed={seed} />;
          case 'beams':
            return <Beams key={n} seed={seed} />;
          case 'lamp':
            return <Lamp key={n} x={lampX} y={lampY} />;
          default:
            return null;
        }
      })}
    </>
  );
};
