import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/JosefinSans';
import {fonts} from '../theme';

// Subset tiếng Việt bắt buộc, nếu không dấu sẽ rơi về font hệ thống.
const {fontFamily} = loadFont('normal', {weights: ['400', '600'], subsets: ['vietnamese', 'latin', 'latin-ext']});

type Props = {title: string; sub?: string; from: number; to: number; bottomOffset: number};

export const LowerThird: React.FC<Props> = ({title, sub, from, to, bottomOffset}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const f0 = from * fps;
  const f1 = to * fps;
  const fade = 14;
  const opacity = interpolate(frame, [f0, f0 + fade, f1 - fade, f1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(frame, [f0, f0 + fade * 2], [18, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: width * 0.07,
          bottom: bottomOffset + 40,
          opacity,
          transform: `translateY(${slide}px)`,
          fontFamily: fontFamily ?? fonts.label,
          color: '#f4ead2',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{fontSize: 44, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase'}}>{title}</div>
        {sub ? <div style={{fontSize: 26, fontWeight: 400, letterSpacing: '0.1em', marginTop: 6}}>{sub}</div> : null}
        <div style={{width: 120, height: 3, background: '#e5524e', marginTop: 12}} />
      </div>
    </AbsoluteFill>
  );
};
