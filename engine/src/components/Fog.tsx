import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';

type Props = {y: number; height: number; color: string};

// Dải sương ngang, thở nhẹ theo noise.
export const Fog: React.FC<Props> = ({y, height, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const breathe = 0.85 + 0.15 * noise2D('fog', frame / fps / 4, 0);
  return (
    <AbsoluteFill
      style={{
        left: '-20%',
        width: '140%',
        top: `${(y - height / 2) * 100}%`,
        height: `${height * 100}%`,
        background: `linear-gradient(180deg, transparent 0%, ${color} 50%, transparent 100%)`,
        opacity: breathe,
      }}
    />
  );
};
