import {z} from 'zod';

// Định dạng content/projects/<p>/vox.json (template vox: mỗi shot = một câu lời dẫn + một hình).
// Phần `v` (hình) để mở: mỗi kind đọc các trường của nó trong shots.tsx.
export const VoxShot = z.object({
  id: z.string(),
  say: z.string().optional(), // key lời dẫn trong locale; file âm thanh assets/audio/<id>.mp3
  pad: z.number().optional(), // giây nghỉ sau câu
  dur: z.number().optional(), // shot không lời: thời lượng cố định (giây)
  v: z.object({kind: z.string()}).passthrough(),
});

export const Vox = z.object({
  project: z.string(),
  fps: z.number(),
  width: z.number(),
  height: z.number(),
  voice: z.string().optional(),
  rate: z.string().optional(),
  music: z.string().optional(),
  // Bản thứ hai của cùng dự án (vd. "v2"): composition <project>-<variant>-full, dùng chung assets/.
  variant: z.string().optional(),
  // Nhạc đổi theo đoạn: mỗi cue chạy từ shot `at` tới cue sau (đan chéo 1,5 s). src rỗng = lặng. Có cues thì bỏ qua `music`.
  cues: z.array(z.object({at: z.string(), src: z.string().optional(), vol: z.number().optional()})).optional(),
  // Nhạc tự hạ khi có lời: hệ số nhân (1 = không hạ).
  duck: z.number().optional(),
  tts: z.record(z.string()).optional(),
  shots: z.array(VoxShot),
});

export type VoxT = z.infer<typeof Vox>;
export type VoxShotT = z.infer<typeof VoxShot>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type V = Record<string, any>;

export const LEAD_SEC = 0.15; // lời bắt đầu sau khi hình vào
export const PAD_SEC = 0.35;

export const shotSeconds = (s: VoxShotT, timing: Record<string, number>) =>
  s.dur ?? Math.max(1.6, LEAD_SEC + (timing[s.id] ?? 2) + (s.pad ?? PAD_SEC));

export const shotFrames = (s: VoxShotT, timing: Record<string, number>, fps: number) => Math.round(shotSeconds(s, timing) * fps);

export const voxDuration = (vox: VoxT, timing: Record<string, number>) =>
  vox.shots.reduce((a, s) => a + shotFrames(s, timing, vox.fps), 0);
