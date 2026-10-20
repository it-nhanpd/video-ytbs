import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fx} from '../theme';

type Ev = {atSec: number; x: number; y: number; size: number};

// Nổ ở xa: chớp lửa ngắn rồi khói xám nở và tan dần. Vẽ bằng gradient, không hình người, không giao tranh.
export const Burst: React.FC<{events: Ev[]}> = ({events}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const sec = frame / fps;
  return (
    <AbsoluteFill>
      {events.map((e, i) => {
        const k = sec - e.atSec;
        if (k < 0 || k > 5) return null;
        const px = e.x * width;
        const py = e.y * height;
        const base = 60 * e.size;
        const flash = interpolate(k, [0, 0.08, 0.5], [0, 1, 0], {extrapolateRight: 'clamp'});
        const smokeR = base * (1.2 + k * 1.4);
        const smokeA = interpolate(k, [0.1, 0.6, 5], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: px - smokeR,
                top: py - smokeR - k * 18,
                width: smokeR * 2,
                height: smokeR * 2,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${fx.smoke} 0%, ${fx.smokeMid} 45%, ${fx.smokeEdge} 72%)`,
                opacity: smokeA,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: px - base * 1.6,
                top: py - base * 1.6,
                width: base * 3.2,
                height: base * 3.2,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${fx.fireCore} 0%, ${fx.fireMid} 35%, ${fx.fireEdge} 70%)`,
                opacity: flash,
                mixBlendMode: 'screen',
              }}
            />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
