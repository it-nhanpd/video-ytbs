import React from 'react';
import {AbsoluteFill} from 'remotion';
import {blurPerZ} from '../theme';
import {parallaxFactor} from '../utils';

type Props = {
  z: number;
  focusZ: number;
  camX: number;
  camZoom: number;
  blur?: number;
  darken?: number;
  opacity?: number;
  children: React.ReactNode;
};

// Áp parallax + DOF + làm tối cho một lớp theo z.
export const Layer: React.FC<Props> = ({z, focusZ, camX, camZoom, blur, darken, opacity, children}) => {
  const f = parallaxFactor(z, focusZ);
  const blurPx = blur ?? Math.abs(z - focusZ) * blurPerZ;
  const filters = [
    blurPx > 0.05 ? `blur(${blurPx}px)` : '',
    darken ? `brightness(${1 - darken})` : '',
  ].join(' ');
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${camX * f}px) scale(${1 + (camZoom - 1) * f})`,
        filter: filters.trim() || undefined,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
