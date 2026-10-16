import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Grade} from '../theme';

// Lớp hoàn thiện: wash màu, vignette, grain, letterbox. Luôn nằm trên cùng.
export const Look: React.FC<{grade: Grade; letterbox?: number}> = ({grade, letterbox}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const bar = letterbox ? Math.max(0, (height - width / letterbox) / 2) : 0;
  const seed = frame % 6; // grain đổi mỗi vài frame, giống phim

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: grade.wash, opacity: grade.washOpacity, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(10,8,4,${grade.vignette}) 100%)`,
        }}
      />
      <AbsoluteFill style={{opacity: grade.grain, mixBlendMode: 'overlay'}}>
        <svg width={width} height={height}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width={width} height={height} filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      {bar > 0 ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bar, background: '#000'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: '#000'}} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
