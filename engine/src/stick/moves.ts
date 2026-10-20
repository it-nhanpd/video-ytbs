import {Easing} from 'remotion';
import {Pose, STANCE, poseKeys} from './pose';

type Ease = 'inOut' | 'out' | 'in' | 'linear';
type Key = {t: number; p: Partial<Pose>; ease?: Ease};
export type Expr = 'neutral' | 'shout' | 'hurt' | 'ko';
export type Move = {
  expr?: [number, Expr][]; // [frame, biểu cảm] tăng dần; không ghi = neutral
  keys: Key[]; // t tính bằng frame (24fps), key đầu t=0; thiếu trường = lấy từ STANCE
  loop?: boolean;
  hit?: number; // frame trúng đòn (để đặt SFX/impact)
};

const easeFn: Record<Ease, (t: number) => number> = {
  inOut: Easing.inOut(Easing.sin),
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  linear: (t) => t,
};

// Danh mục đòn của pilot (xem script/move-library.md). Các đòn còn lại thêm ở các bước sau.
export const moves: Record<string, Move> = {
  stance: {
    loop: true,
    keys: [{t: 0, p: {}}, {t: 12, p: {hy: 0.18, torso: 7}}, {t: 24, p: {}}],
  },
  jab: {
    hit: 5,
    expr: [[0, 'neutral'], [3, 'shout'], [11, 'neutral']],
    keys: [
      {t: 0, p: {}},
      {t: 3, p: {a1s: 40, a1e: 150, torso: 2}, ease: 'in'},
      {t: 5, p: {hx: 2.5, torso: 15, a1s: 95, a1e: 90, l1t: 35, l2t: -30}, ease: 'out'},
      {t: 9, p: {}},
    ],
  },
  hook: {
    hit: 7,
    expr: [[0, 'neutral'], [5, 'shout'], [15, 'neutral']],
    keys: [
      {t: 0, p: {}},
      {t: 5, p: {hx: -0.5, torso: -12, a1s: 20, a1e: 200, a2s: 10, a2e: 150}, ease: 'in'},
      {t: 7, p: {hx: 3, torso: 30, a1s: 85, a1e: 110, l1t: 40, l2t: -35}, ease: 'out'},
      {t: 13, p: {}},
    ],
  },
  // Đá vòng cao bằng chân sau (chi 2), nghiêng người ra sau để chân lên tới đầu.
  roundhouse: {
    hit: 11,
    expr: [[0, 'neutral'], [8, 'shout'], [18, 'neutral']],
    keys: [
      {t: 0, p: {}},
      {t: 8, p: {hx: -0.5, torso: -10, l2t: -45, l2s: -70, l1t: 15}, ease: 'in'},
      {t: 11, p: {hx: 2, torso: -40, l2t: 135, l2s: 130, l1t: 10, l1s: 0, a1s: 60, a1e: 100, a2s: -30, a2e: 40}, ease: 'out'},
      {t: 15, p: {hx: 2, torso: -40, l2t: 135, l2s: 130, l1t: 10, l1s: 0, a1s: 60, a1e: 100, a2s: -30, a2e: 40}},
      {t: 21, p: {}},
    ],
  },
  hit_head: {
    expr: [[0, 'hurt'], [10, 'neutral']],
    keys: [
      {t: 0, p: {}},
      {t: 3, p: {hx: -1.5, torso: -25, head: -20, a1s: 60, a1e: 120, a2s: 50, a2e: 110}, ease: 'out'},
      {t: 9, p: {}},
    ],
  },
  // Ngã ngửa: giật đầu, nghiêng quanh hông, hông rơi xuống sàn, nảy nhẹ rồi nằm yên.
  fall_back: {
    expr: [[0, 'hurt'], [12, 'ko']],
    keys: [
      {t: 0, p: {}},
      {t: 3, p: {hx: -1.5, torso: -25, head: -25, a1s: 60, a1e: 120, a2s: 50, a2e: 110}, ease: 'out'},
      {t: 12, p: {hx: -4.5, hy: 3.6, rot: 70, head: -10, a1s: 80, a1e: 110, a2s: 70, a2e: 100, l1t: 15, l1s: 10, l2t: 5, l2s: 10}, ease: 'in'},
      {t: 15, p: {hx: -5.2, hy: 4.5, rot: 85, head: -8, a1s: 70, a1e: 100, a2s: 60, a2e: 90, l1t: 2, l1s: 0, l2t: -3, l2s: -3}, ease: 'out'},
      {t: 18, p: {hx: -5, hy: 4.5, rot: 88, head: -8, a1s: 75, a1e: 105, a2s: 65, a2e: 95, l1t: 2, l1s: 0, l2t: -3, l2s: -3}},
    ],
  },
};

export const moveDuration = (m: Move) => m.keys[m.keys.length - 1].t;

const lerpPose = (a: Partial<Pose>, b: Partial<Pose>, k: number, e: Ease): Pose => {
  const out = {...STANCE};
  const f = easeFn[e](Math.min(1, Math.max(0, k)));
  for (const key of poseKeys) {
    const va = a[key] ?? STANCE[key];
    const vb = b[key] ?? STANCE[key];
    out[key] = va + (vb - va) * f;
  }
  return out;
};

// Pose tại thời điểm t (frame, có thể lẻ) của một đòn. Đòn không lặp thì giữ pose cuối.
export function poseAt(m: Move, t: number): Pose {
  const dur = moveDuration(m);
  const tt = m.loop ? t % dur : Math.min(Math.max(t, 0), dur);
  for (let i = 0; i < m.keys.length - 1; i++) {
    const a = m.keys[i];
    const b = m.keys[i + 1];
    if (tt <= b.t) return lerpPose(a.p, b.p, (tt - a.t) / Math.max(1e-6, b.t - a.t), b.ease ?? 'inOut');
  }
  return lerpPose(m.keys[m.keys.length - 1].p, m.keys[m.keys.length - 1].p, 0, 'linear');
}

export type TimelineItem = {move: string; at: number; speed: number};

// Pose của một võ sĩ tại frame: lấy mục timeline gần nhất đã bắt đầu; chưa có thì đứng thủ.
export function fighterPose(timeline: TimelineItem[], frame: number): Pose {
  let cur: TimelineItem | undefined;
  for (const it of timeline) if (it.at <= frame && (!cur || it.at >= cur.at)) cur = it;
  if (!cur) return poseAt(moves.stance, frame);
  const m = moves[cur.move];
  if (!m) throw new Error(`Unknown move "${cur.move}"`);
  return poseAt(m, (frame - cur.at) * cur.speed);
}

// Biểu cảm của một võ sĩ tại frame (cùng quy tắc chọn mục timeline với fighterPose).
export function fighterExpr(timeline: TimelineItem[], frame: number): Expr {
  let cur: TimelineItem | undefined;
  for (const it of timeline) if (it.at <= frame && (!cur || it.at >= cur.at)) cur = it;
  const m = cur && moves[cur.move];
  if (!cur || !m?.expr) return 'neutral';
  const t = (frame - cur.at) * cur.speed;
  let out: Expr = 'neutral';
  for (const [from, e] of m.expr) if (t >= from) out = e;
  return out;
}
