// Người que: tư thế = góc khớp tuyệt đối (độ). Đơn vị chiều dài: R = bán kính đầu.
// Chi: góc tính từ hướng "xuống", dương = về phía mặt hướng tới. Thân: từ hướng "lên", dương = ngả về trước.
// Chi "1" = phía trước (gần đối thủ), chi "2" = phía sau.
export type Pose = {
  hx: number; // dịch hông theo hướng nhìn (đơn vị R), dương = tiến
  hy: number; // dịch hông xuống (đơn vị R)
  rot: number; // nghiêng cả người ra sau quanh hông (độ), dùng khi ngã
  torso: number;
  head: number;
  a1s: number; // tay trước: vai→khuỷu
  a1e: number; // khuỷu→cổ tay
  a2s: number;
  a2e: number;
  l1t: number; // chân trước: hông→gối
  l1s: number; // gối→cổ chân
  l2t: number;
  l2s: number;
};

export const poseKeys = [
  'hx', 'hy', 'rot', 'torso', 'head', 'a1s', 'a1e', 'a2s', 'a2e', 'l1t', 'l1s', 'l2t', 'l2s',
] as const satisfies readonly (keyof Pose)[];

export const STANCE: Pose = {
  hx: 0, hy: 0, rot: 0, torso: 5, head: 0,
  a1s: 30, a1e: 150, a2s: 20, a2e: 140,
  l1t: 20, l1s: 0, l2t: -20, l2s: -10,
};

export type Pt = {x: number; y: number};
export type Joints = {
  hip: Pt; neck: Pt; head: Pt;
  elbow1: Pt; wrist1: Pt; elbow2: Pt; wrist2: Pt;
  knee1: Pt; ankle1: Pt; knee2: Pt; ankle2: Pt;
};
export type JointName = keyof Joints;

const rad = (d: number) => (d * Math.PI) / 180;

// Độ dài đoạn theo R.
export const LEN = {torso: 3, upperArm: 2, foreArm: 2, thigh: 2.6, shin: 2.6, headCenter: 1.35};
// Hông cao hơn sàn khoảng 5R khi đứng.
export const HIP_HEIGHT = 5;

// Góc đầu (độ, từ hướng lên, dương = ngả về trước) để xoay khuôn mặt.
export const headAngle = (p: Pose) => p.torso - p.rot + p.head;

export function joints(p: Pose, R: number, facing: 1 | -1, ox: number, floorY: number): Joints {
  const down = (deg: number, len: number): Pt => ({x: Math.sin(rad(deg)) * facing * len * R, y: Math.cos(rad(deg)) * len * R});
  const up = (deg: number, len: number): Pt => ({x: Math.sin(rad(deg)) * facing * len * R, y: -Math.cos(rad(deg)) * len * R});
  const add = (a: Pt, b: Pt): Pt => ({x: a.x + b.x, y: a.y + b.y});

  const torso = p.torso - p.rot;
  const head = torso + p.head;
  const limb = (a: number) => a + p.rot;

  const hip: Pt = {x: ox + p.hx * R * facing, y: floorY - HIP_HEIGHT * R + p.hy * R};
  const neck = add(hip, up(torso, LEN.torso));
  const elbow1 = add(neck, down(limb(p.a1s), LEN.upperArm));
  const elbow2 = add(neck, down(limb(p.a2s), LEN.upperArm));
  const knee1 = add(hip, down(limb(p.l1t), LEN.thigh));
  const knee2 = add(hip, down(limb(p.l2t), LEN.thigh));
  return {
    hip,
    neck,
    head: add(neck, up(head, LEN.headCenter)),
    elbow1,
    wrist1: add(elbow1, down(limb(p.a1e), LEN.foreArm)),
    elbow2,
    wrist2: add(elbow2, down(limb(p.a2e), LEN.foreArm)),
    knee1,
    ankle1: add(knee1, down(limb(p.l1s), LEN.shin)),
    knee2,
    ankle2: add(knee2, down(limb(p.l2s), LEN.shin)),
  };
}
