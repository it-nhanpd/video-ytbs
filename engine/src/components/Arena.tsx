import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {arena} from '../theme';

// Nền đài: sàn phẳng, lưới rào, đám đông chấm mờ, nón đèn. Khối phẳng, không chữ (style bible).
const rand = (i: number, seed: number) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Arena: React.FC<{floorY: number; seed: number}> = ({floorY, seed}) => {
  const {width, height} = useVideoConfig();
  const fenceTop = floorY - 420;
  const posts = Array.from({length: 17}, (_, i) => (width * (i - 0.5)) / 15);
  const crowd = Array.from({length: 150}, (_, i) => ({
    x: rand(i, seed) * width,
    y: fenceTop - 20 - rand(i + 500, seed) * 230,
    r: 14 + rand(i + 900, seed) * 12,
  }));
  return (
    // Rộng hơn khung để camera pan không lộ mép.
    <AbsoluteFill style={{left: '-15%', right: '-15%', width: 'auto'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {crowd.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={arena.crowd} />
        ))}
        <polygon points={`${width * 0.38},0 ${width * 0.62},0 ${width * 0.86},${floorY} ${width * 0.14},${floorY}`} fill={arena.light} />
        <rect x={0} y={floorY} width={width} height={height - floorY} fill={arena.floor} />
        <rect x={0} y={floorY} width={width} height={6} fill={arena.floorEdge} />
        {posts.map((x, i) => (
          <line key={i} x1={x} y1={fenceTop} x2={x} y2={floorY} stroke={arena.fence} strokeWidth={3} />
        ))}
        <line x1={0} y1={fenceTop} x2={width} y2={fenceTop} stroke={arena.fence} strokeWidth={6} />
        <line x1={0} y1={(fenceTop + floorY) / 2} x2={width} y2={(fenceTop + floorY) / 2} stroke={arena.fence} strokeWidth={2} />
      </svg>
    </AbsoluteFill>
  );
};
