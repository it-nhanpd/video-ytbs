import React, {useId} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {blurPerZ} from '../theme';
import {parallaxFactor} from '../utils';

type Props = {
  z: number;
  focusZ: number;
  camX: number;
  camZoom: number;
  origin?: string; // điểm zoom, vd. "50% 40%"
  blur?: number;
  darken?: number;
  opacity?: number;
  boil?: number;
  children: React.ReactNode;
};

// Áp parallax + DOF + làm tối cho một lớp theo z.
export const Layer: React.FC<Props> = ({z, focusZ, camX, camZoom, origin, blur, darken, opacity, boil, children}) => {
  const frame = useCurrentFrame();
  // id riêng cho từng lớp: hai lớp cùng z hoặc hai cảnh chồng nhau lúc chuyển cảnh không dùng nhầm filter của nhau.
  const boilId = `boil-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const f = parallaxFactor(z, focusZ);
  const blurPx = blur ?? Math.abs(z - focusZ) * blurPerZ;
  const filters = [
    blurPx > 0.05 ? `blur(${blurPx}px)` : '',
    darken ? `brightness(${1 - darken})` : '',
    boil ? `url(#${boilId})` : '',
  ].join(' ');
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${camX * f}px) scale(${1 + (camZoom - 1) * f})`,
        transformOrigin: origin,
        filter: filters.trim() || undefined,
        opacity,
      }}
    >
      {boil ? (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={boilId} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={Math.floor(frame / 3) % 5} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={boil} />
          </filter>
        </svg>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};
