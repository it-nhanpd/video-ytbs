import {Easing, interpolate} from 'remotion';
import type {z} from 'zod';
import type {EaseName} from './schema';

export const easings: Record<z.infer<typeof EaseName>, (t: number) => number> = {
  linear: Easing.linear,
  inOutSine: Easing.inOut(Easing.sin),
  outCubic: Easing.out(Easing.cubic),
  inOutCubic: Easing.inOut(Easing.cubic),
};

// Nội suy [from, to] trên toàn bộ thời lượng cảnh.
export const overScene = (
  frame: number,
  durationInFrames: number,
  [from, to]: [number, number],
  ease: z.infer<typeof EaseName> = 'linear',
) =>
  interpolate(frame, [0, durationInFrames - 1], [from, to], {
    easing: easings[ease],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Lớp ở focusZ trượt đúng bằng camera; lớp xa trượt ít hơn, tiền cảnh trượt nhiều hơn.
export const parallaxFactor = (z: number, focusZ: number) => (z + 0.5) / (focusZ + 0.5);
