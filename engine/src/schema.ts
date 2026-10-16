import {z} from 'zod';

// Một cặp [from, to] được nội suy theo thời gian của cảnh.
const Range = z.tuple([z.number(), z.number()]);

export const EaseName = z.enum(['linear', 'inOutSine', 'outCubic', 'inOutCubic']);

const LayerBase = z.object({
  id: z.string(),
  z: z.number(),
  // Ghi đè độ mờ tự tính từ |z - focusZ|.
  blur: z.number().optional(),
  // 0..1, làm tối lớp (dùng cho tiền cảnh đóng khung).
  darken: z.number().min(0).max(1).optional(),
  opacity: z.number().min(0).max(1).optional(),
});

const SkyLayer = LayerBase.extend({
  type: z.literal('sky'),
  preset: z.string(),
  sun: z.object({x: z.number(), y: z.number(), radius: z.number()}).optional(),
});

const SilhouetteLayer = LayerBase.extend({
  type: z.literal('silhouette'),
  seed: z.number(),
  baseY: z.number(), // 0..1 theo chiều cao khung
  amp: z.number(), // biên độ nhấp nhô tán cây, 0..1
  color: z.string(),
  palms: z.number().int().default(0),
  palmScale: z.number().default(1),
});

const FogLayer = LayerBase.extend({
  type: z.literal('fog'),
  y: z.number(),
  height: z.number(),
  color: z.string(),
});

const HazeLayer = LayerBase.extend({
  type: z.literal('haze'),
  count: z.number().int(),
  color: z.string(),
  seed: z.number().default(1),
});

const Rotor = z.object({
  x: z.number(), // vị trí trục, tỉ lệ theo khung ảnh (0..1)
  y: z.number(),
  radius: z.number(), // tỉ lệ theo chiều rộng ảnh
});

const ImageLayer = LayerBase.extend({
  type: z.literal('image'),
  // Asset id khớp với prompts/manifest.json — ingest dùng id này để thay src.
  assetId: z.string().optional(),
  src: z.string(), // đường dẫn tương đối trong content/
  status: z.enum(['placeholder', 'final']).default('placeholder'),
  width: z.number(), // tỉ lệ theo chiều rộng khung
  // Vị trí tâm ảnh theo thời gian (tỉ lệ khung).
  x: Range,
  y: Range,
  ease: EaseName.default('linear'),
  rotateDeg: z.number().default(0),
  flipX: z.boolean().default(false),
  bobPx: z.number().default(0),
  rotors: z
    .object({main: Rotor.optional(), tail: Rotor.optional(), rps: z.number().default(5.5)})
    .optional(),
});

export const Layer = z.discriminatedUnion('type', [
  SkyLayer,
  SilhouetteLayer,
  FogLayer,
  HazeLayer,
  ImageLayer,
]);

export const TextItem = z.object({
  type: z.literal('lowerThird'),
  key: z.string(), // key trong locales/<locale>.json
  subKey: z.string().optional(),
  from: z.number(),
  to: z.number(),
});

export const Scene = z.object({
  id: z.string(),
  durationSec: z.number().positive(),
  template: z.literal('MultiplaneScene'),
  grade: z.string(),
  letterbox: z.number().optional(),
  focusZ: z.number(),
  camera: z.object({x: Range, zoom: Range, ease: EaseName.default('inOutSine')}),
  layers: z.array(Layer),
  text: z.array(TextItem).default([]),
  audio: z.object({sfx: z.array(z.string()), note: z.string().optional()}).optional(),
});

export const Project = z.object({
  project: z.string(),
  locale: z.string(),
  fps: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
  scenes: z.array(Scene),
});

export const Locale = z.record(z.string(), z.string());

export type ProjectT = z.infer<typeof Project>;
export type SceneT = z.infer<typeof Scene>;
export type LayerT = z.infer<typeof Layer>;
export type ImageLayerT = z.infer<typeof ImageLayer>;
export type LocaleT = z.infer<typeof Locale>;
