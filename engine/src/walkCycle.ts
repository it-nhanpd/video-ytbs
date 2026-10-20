// Chu kỳ đi bộ dùng chung cho mọi nhân vật rig (nhìn ngang, hướng PHẢI).
// Góc trả về là độ theo CSS/SVG: dương = xoay theo chiều kim đồng hồ trên màn hình (y hướng xuống).
// Với chi treo xuống từ khớp (đùi, tay trên): dương = chân/tay vung ra SAU; âm = ra TRƯỚC.

export type Angles = Record<string, number>;

// Phím theo pha t (0..1 = một chu kỳ), cho chân gần. Chân xa lệch nửa chu kỳ.
// hip: độ vung ra trước (+ = trước), knee: độ gập gối (luôn ≥ 0), ankle: + = mũi chân chúc xuống.
const LEG_KEYS: {t: number; hip: number; knee: number; ankle: number}[] = [
  {t: 0.0, hip: 28, knee: 4, ankle: -10}, // chạm gót
  {t: 0.125, hip: 20, knee: 24, ankle: 0}, // nảy (nhún), gối gập sâu hơn để thân hạ rõ
  {t: 0.25, hip: 5, knee: 4, ankle: 0}, // chống thẳng, chân kia vượt qua
  {t: 0.375, hip: -8, knee: 6, ankle: 6}, // nâng gót
  {t: 0.5, hip: -18, knee: 30, ankle: 20}, // rời mũi chân
  {t: 0.625, hip: -5, knee: 52, ankle: 8}, // đầu pha vung: gối gập sâu
  {t: 0.75, hip: 12, knee: 38, ankle: -2}, // giữa pha vung
  {t: 0.875, hip: 24, knee: 15, ankle: -8}, // cuối pha vung: duỗi ra trước
];

const wrap = (t: number) => ((t % 1) + 1) % 1;

// Nội suy tuần hoàn Catmull-Rom (mượt, liên tục đạo hàm, nối vòng kín).
const periodic = (key: 'hip' | 'knee' | 'ankle', t: number) => {
  const n = LEG_KEYS.length;
  const x = wrap(t) * n;
  const i = Math.floor(x);
  const f = x - i;
  const p = (k: number) => LEG_KEYS[((k % n) + n) % n][key];
  const p0 = p(i - 1);
  const p1 = p(i);
  const p2 = p(i + 1);
  const p3 = p(i + 2);
  return 0.5 * (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f);
};

const leg = (t: number) => ({hip: periodic('hip', t), knee: periodic('knee', t), ankle: periodic('ankle', t)});

// Tay vung ngược chân cùng bên: tay gần theo nhịp chân xa.
const arm = (t: number) => {
  const swing = 1.1 * (periodic('hip', t + 0.5) - 5); // + = ra trước
  const elbow = 16 + 0.6 * Math.max(0, swing); // khuỷu gập thêm khi tay ra trước
  return {swing, elbow};
};

/** Góc từng khớp (độ, CSS) tại pha t ∈ [0,1). `moving=false` trả về dáng đứng. */
export function walkAngles(t: number, moving = true, crouch = 0): Angles {
  if (!moving) {
    return {torso: 2, head: -2, thighN: 0, shinN: 2, footN: 0, thighF: 0, shinF: 2, footF: 0, upperArmN: 0, foreArmN: -12, upperArmF: 0, foreArmF: -12};
  }
  const near = leg(t);
  const far = leg(t + 0.5);
  const armN = arm(t);
  const armF = arm(t + 0.5);
  const phi = wrap(t) * Math.PI * 2;
  // Hạ thấp: đùi chúi trước, gối gập, cổ chân bù để đế giày không chúc mũi; thân ngả trước. Độ cao thân tự hạ nhờ chân luôn chạm đất.
  const c = crouch;
  return {
    torso: 4 + 8 * c + 2.4 * Math.sin(2 * phi + 0.6), // hơi cúi về trước, lắc nhẹ theo nhịp bước
    head: -3 - 4 * c - 0.8 * Math.sin(2 * phi + 0.6), // đầu giữ thăng bằng, ngược chiều thân
    thighN: -(near.hip + 9 * c),
    shinN: near.knee + 18 * c,
    footN: near.ankle - 9 * c,
    thighF: -(far.hip + 9 * c),
    shinF: far.knee + 18 * c,
    footF: far.ankle - 9 * c,
    upperArmN: -armN.swing,
    foreArmN: -armN.elbow,
    upperArmF: -armF.swing,
    foreArmF: -armF.elbow,
  };
}

// ---- Động học thuận (FK) 2D bằng ma trận affine [a, b, c, d, e, f] (kiểu CSS matrix) ----

export type Mat = [number, number, number, number, number, number];
export const IDENT: Mat = [1, 0, 0, 1, 0, 0];
export const mul = (m: Mat, n: Mat): Mat => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];
export const translate = (x: number, y: number): Mat => [1, 0, 0, 1, x, y];
export const rotateDeg = (deg: number): Mat => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0];
};
export const apply = (m: Mat, x: number, y: number): [number, number] => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

export type RigPartLike = {
  id: string;
  parent?: string;
  w: number;
  h: number;
  pivot: [number, number]; // tỉ lệ trong ảnh bộ phận: khớp của chính bộ phận
  attach?: [number, number]; // tỉ lệ trong ảnh cha: nơi khớp gắn vào cha
  z: number;
  joint: string;
};

/** Ma trận thế giới (px ảnh → hệ rig, gốc = khớp hông của thân) của từng bộ phận. Cha phải đứng trước con. */
export function solveRig(parts: RigPartLike[], angles: Angles): Map<string, Mat> {
  const world = new Map<string, Mat>();
  const byId = new Map(parts.map((p) => [p.id, p]));
  const visit = (p: RigPartLike): Mat => {
    const got = world.get(p.id);
    if (got) return got;
    const local = mul(rotateDeg(angles[p.joint] ?? 0), translate(-p.pivot[0] * p.w, -p.pivot[1] * p.h));
    let m: Mat;
    if (p.parent) {
      const par = byId.get(p.parent);
      if (!par) throw new Error(`rig: bộ phận "${p.id}" có parent "${p.parent}" không tồn tại`);
      const pm = visit(par);
      const at = p.attach ?? [0.5, 0.5];
      m = mul(mul(pm, translate(at[0] * par.w, at[1] * par.h)), local);
    } else {
      m = local;
    }
    world.set(p.id, m);
    return m;
  };
  parts.forEach(visit);
  return world;
}

/** Hộp bao (hệ rig) của tập bộ phận cho trước, theo bốn góc ảnh sau biến đổi. */
export function rigBounds(parts: RigPartLike[], world: Map<string, Mat>, only?: (p: RigPartLike) => boolean) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of parts) {
    if (only && !only(p)) continue;
    const m = world.get(p.id)!;
    for (const [x, y] of [[0, 0], [p.w, 0], [0, p.h], [p.w, p.h]] as const) {
      const [wx, wy] = apply(m, x, y);
      minX = Math.min(minX, wx);
      minY = Math.min(minY, wy);
      maxX = Math.max(maxX, wx);
      maxY = Math.max(maxY, wy);
    }
  }
  return {minX, minY, maxX, maxY};
}

// ---- Tư thế có vũ khí (ảnh tay là cả cánh tay một mảnh nên chỉ xoay ở vai) ----
export type Pose = 'walk' | 'carry' | 'aim';

const poseAngles = (t: number, moving: boolean, pose: Pose, crouch = 0): Angles => {
  const base = walkAngles(t, moving, crouch);
  if (pose === 'walk') return {...base, weapon: 0};
  if (pose === 'carry') {
    // Súng giữ ngang hông, nòng hơi chếch lên; tay xa đỡ nhẹ, đung đưa ít.
    const upperArmN = -30;
    return {...base, upperArmN, foreArmN: -50, upperArmF: base.upperArmF * 0.3 - 12, foreArmF: -35, weapon: -upperArmN - 14, torso: base.torso + 1};
  }
  // aim: tay duỗi ra trước ngang vai, súng ngang; thân hơi ngả về trước, chân vẫn bước.
  const upperArmN = -80;
  return {...base, upperArmN, foreArmN: -5, upperArmF: -64, foreArmF: -10, weapon: -upperArmN - 4, torso: base.torso + 5, head: base.head - 3};
};

/** Góc khớp tại pha t, trộn mượt giữa các tư thế theo mốc giây. Tư thế ở mốc ≤ 0 là tư thế ban đầu (không trộn từ walk). */
export function angleSet(t: number, moving: boolean, timeSec: number, poses: {atSec: number; pose: Pose}[], crouch = 0): Angles {
  let cur: Pose = 'walk';
  let prev: Pose = 'walk';
  let at = -Infinity;
  for (const p of [...poses].sort((a, b) => a.atSec - b.atSec)) {
    if (p.atSec <= timeSec) {
      prev = p.atSec <= 0 ? p.pose : cur;
      cur = p.pose;
      at = p.atSec;
    }
  }
  const to = poseAngles(t, moving, cur, crouch);
  const w = Math.max(0, Math.min(1, (timeSec - at) / 0.5));
  if (w >= 1 || prev === cur) return to;
  const from = poseAngles(t, moving, prev, crouch);
  const out: Angles = {};
  for (const k of Object.keys(to)) out[k] = (from[k] ?? 0) * (1 - w) + to[k] * w;
  return out;
}
