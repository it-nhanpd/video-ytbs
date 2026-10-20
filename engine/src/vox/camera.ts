import type React from 'react';
import {Easing, interpolate, random} from 'remotion';

// Kiểu camera theo shot (`v.cam`). Trả về scale + dịch (tỉ lệ khung) + tâm phóng.
// Không có v.cam: đẩy chậm 1 → 1.045 + rung giấy 12 fps (hành vi cũ, các dự án trước giữ nguyên).
export type CamName = 'paper' | 'push' | 'pull' | 'panL' | 'panR' | 'tiltUp' | 'tiltDown' | 'handheld' | 'snap' | 'none';
export type Cam = {s: number; x: number; y: number; ox: number; oy: number};

const ease = Easing.bezier(0.45, 0, 0.55, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Rung tay mượt (tổng vài sóng sin lệch pha), không giật theo bậc như rung giấy.
const hand = (frame: number, seed: string, amp: number) => {
  const p = random(seed) * 100;
  return amp * (Math.sin(frame / 23 + p) * 0.6 + Math.sin(frame / 9.7 + p * 2) * 0.3 + Math.sin(frame / 4.3 + p * 3) * 0.1);
};

export const camAt = (
  cam: string | undefined,
  frame: number,
  D: number,
  fps: number,
  seed: string,
  fx = 0.5,
  fy = 0.5,
  amt = 1,
): Cam => {
  const p = ease(Math.min(1, Math.max(0, frame / Math.max(1, D))));
  const base = {ox: fx, oy: fy, x: 0, y: 0};
  switch (cam ?? 'paper') {
    case 'none':
      return {...base, s: 1};
    case 'push':
      return {...base, s: 1 + 0.12 * amt * p};
    case 'pull':
      return {...base, s: 1 + 0.12 * amt * (1 - p)};
    case 'panL':
      return {...base, s: 1.1, x: 0.035 * amt * (1 - 2 * p)};
    case 'panR':
      return {...base, s: 1.1, x: -0.035 * amt * (1 - 2 * p)};
    case 'tiltUp':
      return {...base, s: 1.1, y: -0.03 * amt * (1 - 2 * p)};
    case 'tiltDown':
      return {...base, s: 1.1, y: 0.03 * amt * (1 - 2 * p)};
    case 'handheld':
      return {...base, s: 1.07 + 0.03 * p * amt, x: hand(frame, seed + 'x', 0.006 * amt), y: hand(frame, seed + 'y', 0.005 * amt)};
    case 'snap': {
      // Giật vào nhanh trong 0,4 s rồi trôi chậm: dùng khi lộ chứng cứ.
      const k = interpolate(frame, [0, Math.round(fps * 0.4)], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
      return {...base, s: 1 + 0.16 * amt * k + 0.03 * p};
    }
    default: {
      const step = Math.floor(frame / (fps / 12));
      return {
        ...base,
        s: interpolate(frame, [0, D], [1, 1.045]),
        x: ((random(`bx${seed}${step}`) - 0.5) * 1.6) / 1920,
        y: ((random(`by${seed}${step}`) - 0.5) * 1.6) / 1080,
      };
    }
  }
};

// CSS transform cho một lớp có hệ số parallax f (0 = đứng yên, 1 = lớp tiêu điểm, >1 = tiền cảnh trôi nhiều hơn).
export const camStyle = (c: Cam, W: number, H: number, f = 1): React.CSSProperties => ({
  transform: `translate(${c.x * W * f}px, ${c.y * H * f}px) scale(${1 + (c.s - 1) * f})`,
  transformOrigin: `${c.ox * 100}% ${c.oy * 100}%`,
});
