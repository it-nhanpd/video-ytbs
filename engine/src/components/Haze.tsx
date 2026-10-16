import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise3D} from '@remotion/noise';

type Props = {count: number; color: string; seed: number};

// Bụi lơ lửng bắt sáng, trôi chậm theo noise.
export const Haze: React.FC<Props> = ({count, color, seed}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen'}}>
      {new Array(count).fill(0).map((_, i) => {
        const bx = random(`${seed}-x-${i}`) * width * 1.3 - width * 0.15;
        const by = random(`${seed}-y-${i}`) * height;
        const size = 1.5 + random(`${seed}-s-${i}`) * 3.5;
        const dx = noise3D(`${seed}-dx`, i, t * 0.15, 0) * 40 - t * 6;
        const dy = noise3D(`${seed}-dy`, i, t * 0.15, 0) * 25;
        const flicker = 0.5 + 0.5 * noise3D(`${seed}-f`, i, t * 0.6, 0);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: bx + dx,
              top: by + dy,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              opacity: 0.15 + 0.4 * flicker * random(`${seed}-o-${i}`),
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
