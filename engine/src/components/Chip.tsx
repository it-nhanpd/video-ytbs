import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/JosefinSans';
import {caption, fonts} from '../theme';

const {fontFamily} = loadFont('normal', {weights: ['400', '600'], subsets: ['vietnamese', 'latin', 'latin-ext']});

type Props = {title: string; sub?: string; from: number; to: number; topOffset: number};

// Thẻ chữ ngắn ở giữa phía trên: mốc ngày, số liệu, nguồn. Nằm ngoài lớp camera nên không bị phóng theo zoom.
export const Chip: React.FC<Props> = ({title, sub, from, to, topOffset}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f0 = from * fps;
  const f1 = to * fps;
  const fade = 8;
  const o = interpolate(frame, [f0, f0 + fade, f1 - fade, f1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (o <= 0) return null;
  const rise = interpolate(frame, [f0, f0 + fade * 2], [-14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: '7%'}}>
      <div
        style={{
          marginTop: topOffset + 52,
          opacity: o,
          transform: `translateY(${rise}px)`,
          fontFamily: fontFamily ?? fonts.label,
          color: caption.text,
          background: caption.plate,
          border: `2px solid ${caption.border}`,
          padding: '12px 30px',
          textShadow: `0 2px 10px ${caption.shadow}`,
          textAlign: 'left',
          maxWidth: '38%',
        }}
      >
        <div style={{fontSize: 38, fontWeight: 600, letterSpacing: '0.06em'}}>{title}</div>
        {sub ? <div style={{fontSize: 24, fontWeight: 400, marginTop: 4, letterSpacing: '0.05em'}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
