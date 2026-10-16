import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Grade} from '../theme';

type Props = {grade: Grade; sun?: {x: number; y: number; radius: number}};

export const Sky: React.FC<Props> = ({grade, sun}) => (
  // Rộng hơn khung để camera pan không lộ mép.
  <AbsoluteFill style={{left: '-15%', right: '-15%', width: 'auto'}}>
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${grade.sky.top} 0%, ${grade.sky.mid} 55%, ${grade.sky.horizon} 85%)`,
      }}
    />
    {sun ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${sun.x * 100}% ${sun.y * 100}%, ${grade.sunGlow} 0%, transparent ${sun.radius * 100}%)`,
          mixBlendMode: 'screen',
        }}
      />
    ) : null}
  </AbsoluteFill>
);
