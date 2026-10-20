import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import type {ImageLayerT} from '../schema';
import {easings, overScene} from '../utils';

type RotorCfg = NonNullable<ImageLayerT['rotors']>;

// Cánh quạt vẽ bằng code: đĩa mờ (motion blur) + 2 nét cánh quay thấy từ bên hông.
// Tọa độ rotor theo tỉ lệ của ảnh nên khớp cả placeholder lẫn ảnh Nano Banana.
const Rotors: React.FC<{cfg: RotorCfg; w: number; h: number; frame: number; fps: number}> = ({cfg, w, h, frame, fps}) => {
  const angle = (frame / fps) * cfg.rps * Math.PI * 2;
  const main = cfg.main;
  const tail = cfg.tail;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {main ? (
        <g transform={`translate(${main.x * w} ${main.y * h})`}>
          <ellipse rx={main.radius * w} ry={main.radius * w * 0.035} fill="#2a2a22" opacity={0.16} />
          {[0, Math.PI].map((phase, i) => {
            const len = main.radius * w * Math.cos(angle + phase);
            return (
              <path
                key={i}
                d={`M 0 0 L ${len} ${-2 * Math.sin(angle + phase)} L ${len} ${3 - 2 * Math.sin(angle + phase)} L 0 3 Z`}
                fill="#22221b"
                opacity={0.55}
              />
            );
          })}
          <rect x={-5} y={-4} width={10} height={9} fill="#2b2b22" />
        </g>
      ) : null}
      {tail ? (
        <g transform={`translate(${tail.x * w} ${tail.y * h})`}>
          <ellipse rx={tail.radius * w * 0.35} ry={tail.radius * w} fill="#2a2a22" opacity={0.2} />
          {[0, Math.PI / 2].map((phase, i) => (
            <rect
              key={i}
              x={-2}
              y={-tail.radius * w}
              width={4}
              height={tail.radius * w * 2}
              fill="#22221b"
              opacity={0.45}
              transform={`rotate(${((angle * 1.6 + phase) * 180) / Math.PI})`}
            />
          ))}
        </g>
      ) : null}
    </svg>
  );
};

type Props = {layer: ImageLayerT; durationInFrames: number; scrollPx?: number};

export const ImageAsset: React.FC<Props> = ({layer, durationInFrames, scrollPx = 0}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  // showSec: chỉ hiện trong khoảng [từ, đến] giây (mascot đổi biểu cảm theo nhịp lời dẫn).
  if (layer.showSec && (frame / fps < layer.showSec[0] || frame / fps > layer.showSec[1])) return null;

  const move = (r: [number, number]) =>
    layer.moveSec
      ? interpolate(frame / fps, layer.moveSec, r, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easings[layer.ease]})
      : overScene(frame, durationInFrames, r, layer.ease);
  // Chỉ số frame của chuỗi lật (dùng chung cho ảnh và độ lệch ngang khóa chân).
  const fi = layer.frames?.length ? Math.floor((frame / fps) * layer.frameFps) % layer.frames.length : 0;
  const cx = move(layer.x) * width + (layer.frameDx?.[fi] ?? 0);
  const cy = move(layer.y) * height;
  const bob = layer.bobPx ? noise2D(`${layer.id}-bob`, frame / fps / 1.6, 0) * layer.bobPx : 0;

  const w = layer.width * width;
  // Tỉ lệ ảnh: layer.aspect nếu có (nhân vật người), mặc định 5:2 (phương tiện/placeholder).
  const aspect = layer.aspect ?? 0.4;
  const h = w * aspect;
  // Chuỗi frame bước đi: phát vòng lặp theo frameFps (độc lập với tốc độ camera).
  const src = layer.frames?.length ? layer.frames[fi] : layer.src;

  if (layer.tile) {
    // mirror: lát xen kẽ gương, chu kỳ 2 ô. wrap: lặp liền mạch không lật, chu kỳ 1 ô. Trôi trái theo scrollPx × scrollMul.
    const wrap = layer.tileMode === 'wrap';
    const period = wrap ? w : 2 * w;
    const tq = layer.scrollSnap ? (Math.floor(frame / layer.scrollSnap) * layer.scrollSnap) / fps : frame / fps;
    const off = (scrollPx * layer.scrollMul * tq) % period;
    return (
      <AbsoluteFill>
        {[-2, -1, 0, 1, 2, 3, 4].map((k) => (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: cx - w / 2 + k * w - off,
              top: cy - h / 2,
              width: w + 2, // chồng 2px che khe nối
              height: h,
              transform: `scaleX(${(wrap || k % 2 === 0 ? 1 : -1) * (layer.flipX ? -1 : 1)})`,
            }}
          >
            <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        ))}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: cx - w / 2,
          top: cy - h / 2 + bob,
          width: w,
          height: h,
          transform: `rotate(${layer.rotateDeg}deg) scaleX(${layer.flipX ? -1 : 1})`,
          transformOrigin: '50% 50%',
        }}
      >
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        {layer.rotors ? <Rotors cfg={layer.rotors} w={w} h={h} frame={frame} fps={fps} /> : null}
      </div>
    </AbsoluteFill>
  );
};
