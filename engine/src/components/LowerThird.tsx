import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/JosefinSans';
import {loadFont as loadItalic} from '@remotion/google-fonts/OpenSans';
import {caption, fonts} from '../theme';

// Subset tiếng Việt bắt buộc, nếu không dấu sẽ rơi về font hệ thống.
const {fontFamily} = loadFont('normal', {weights: ['400', '600'], subsets: ['vietnamese', 'latin', 'latin-ext']});

const italic = loadItalic('italic', {weights: ['400'], subsets: ['vietnamese', 'latin', 'latin-ext']}).fontFamily;

// plain: chữ nghiêng nhỏ, hai dòng, không gạch (kiểu caption của video tham chiếu).
// plate: nền tối + chữ nhỏ cho dòng ghi công trên nền sáng (bản đồ).
type Props = {title: string; sub?: string; from: number; to: number; bottomOffset: number; plate?: boolean; plain?: boolean};

export const LowerThird: React.FC<Props> = ({title, sub, from, to, bottomOffset, plate, plain}) => {
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
  if (plain) {
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: width * 0.1, bottom: bottomOffset + 96, opacity: opacity * 0.82, fontFamily: italic, fontStyle: 'italic', color: '#e8e2ee', lineHeight: 1.1}}>
          <div style={{fontSize: 44}}>{title}</div>
          {sub ? <div style={{fontSize: 34, opacity: 0.85}}>{sub}</div> : null}
        </div>
      </AbsoluteFill>
    );
  }
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
          color: caption.text,
          textShadow: `0 2px 12px ${caption.shadow}`,
          ...(plate ? {background: caption.plateCredit, padding: '10px 22px', maxWidth: '60%'} : {}),
        }}
      >
        <div style={plate ? {fontSize: 26, fontWeight: 600, letterSpacing: '0.06em'} : {fontSize: 44, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase'}}>{title}</div>
        {sub ? <div style={{fontSize: plate ? 20 : 26, fontWeight: 400, letterSpacing: plate ? '0.04em' : '0.1em', marginTop: 6}}>{sub}</div> : null}
        {plate ? null : <div style={{width: 120, height: 3, background: caption.accent, marginTop: 12}} />}
      </div>
    </AbsoluteFill>
  );
};
