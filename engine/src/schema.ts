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
  // Nét 'sôi' kiểu vẽ tay: méo nhẹ (px) đổi hạt ~8 lần/giây. 0 = tắt. Tốn thời gian render, chỉ bật cho vài lớp có viền.
  boil: z.number().default(0),
  // Độ mờ thêm theo mức zoom camera: blur += blurZoom × (zoom − 1) (nền mờ dần khi kéo cận, như DOF của gốc).
  blurZoom: z.number().default(0),
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
  // Tỉ lệ cao/rộng của ảnh (mặc định 0.4 = 5:2 cho phương tiện). Nhân vật người: ingest tự ghi theo `fit`/`frameFit`.
  aspect: z.number().positive().optional(),
  // Chuỗi frame bước đi (ingest splitFrames ghi vào). Có frames thì phát vòng lặp thay cho src.
  frames: z.array(z.string()).optional(),
  frameFps: z.number().positive().default(12),
  // Lệch ngang (px màn hình) theo từng frame của chuỗi `frames`, tính bởi tools/foot-lock.mjs để chân chống đứng yên so với mặt đất.
  frameDx: z.array(z.number()).optional(),
  // Nền cuộn theo bước: thời gian cuộn làm tròn xuống bội của scrollSnap khung hình (2 = cùng nhịp hình vẽ on twos).
  scrollSnap: z.number().int().min(0).default(0),
  // Lặp ngang (lát gương) và trôi sang trái theo scene.walkSpeed × hệ số parallax của lớp: dùng cho nền khi nhân vật "đi".
  tile: z.boolean().default(false),
  // 'mirror' = lát xen kẽ gương (cũ, chu kỳ 2 ô); 'wrap' = lặp liền mạch không lật gương (ảnh phải liền mép trái–phải).
  tileMode: z.enum(['mirror', 'wrap']).default('mirror'),
  // Chuyển động x/y chỉ diễn ra trong khoảng [từ, đến] giây (trước đó đứng ở giá trị đầu, sau đó ở giá trị cuối); không có = trải đều cả cảnh. Dùng cho lớp 'quét' tiền cảnh.
  moveSec: Range.optional(),
  // Nhân thêm vào tốc độ trôi (ngoài parallax theo z), vd. cỏ tiền cảnh trôi nhanh hơn nhân vật.
  scrollMul: z.number().default(1),
  // Chỉ hiện trong khoảng [từ, đến] giây của cảnh (không có = hiện cả cảnh).
  showSec: Range.optional(),
  rotors: z
    .object({main: Rotor.optional(), tail: Rotor.optional(), rps: z.number().default(5.5)})
    .optional(),
});


// Bộ phận của nhân vật rig (ingest splitParts ghi vào). Tọa độ pivot/attach là tỉ lệ trong ảnh; w/h là px ảnh bộ phận ở thang chung.
const RigPart = z.object({
  id: z.string(),
  src: z.string(),
  parent: z.string().optional(), // không có parent = thân (gốc, pivot = khớp hông)
  w: z.number().positive(),
  h: z.number().positive(),
  pivot: z.tuple([z.number(), z.number()]),
  attach: z.tuple([z.number(), z.number()]).optional(),
  z: z.number(), // thứ tự vẽ: nhỏ = sau (chân/tay xa), lớn = trước
  shade: z.number().min(0).max(1).default(1), // độ sáng; chi xa dùng cùng ảnh với chi gần nhưng tối hơn (0.78)
  joint: z.string(), // khóa góc trong walkCycle (torso, head, thighN, shinN, footN, ..., weapon)
});

// Nhân vật rig: nhiều bộ phận có trục, chu kỳ đi sinh bằng code (walkCycle.ts). Luôn nhìn PHẢI, không flipX.
const RigLayer = LayerBase.extend({
  type: z.literal('rig'),
  assetId: z.string().optional(),
  status: z.enum(['placeholder', 'final']).default('placeholder'),
  x: Range, // tâm ngang (tỉ lệ khung)
  groundY: z.number(), // y mặt đất nơi chân chạm (tỉ lệ khung)
  height: z.number(), // chiều cao nhân vật (tỉ lệ chiều cao khung), cùng giá trị cho mọi nhân vật = cùng chiều cao
  ease: EaseName.default('linear'),
  cycleSec: z.number().positive().default(1), // một chu kỳ đi (2 bước) = 1 giây
  phase: z.number().default(0), // lệch pha 0..1 (để hai nhân vật không bước đồng bộ)
  moving: z.boolean().default(true), // false = dáng đứng
  parts: z.array(RigPart).min(1),
  appearSec: z.number().min(0).default(0), // hiện dần từ giây này (mờ vào 0,6 s)
  // Đổi một bộ phận sang bộ phận cùng id của layer rig khác (vd. lính 1936 "thành" 1944 từng món), kèm tia sáng.
  swaps: z.array(z.object({atSec: z.number().min(0), part: z.string(), fromLayer: z.string()})).default([]),
  // Vòng tròn chú thích quanh một bộ phận (nhãn chữ dùng chip ở cấp cảnh, vì chữ trong layer bị phóng theo camera).
  callouts: z.array(z.object({part: z.string(), atSec: z.number().min(0), durSec: z.number().positive()})).default([]),
  // Tư thế theo thời gian: walk (đi), carry (mang súng), aim (ngắm). Chuyển mượt 0,5 s.
  // 0..1: dáng hạ thấp (gối gập, thân chúi) cho bước đi chiến thuật; 0 = đi thẳng.
  crouch: z.number().min(0).max(1.5).default(0),
  // Nhân biên độ vung tay (1 = đi bộ; chạy ~1.8).
  // Tắt bóng elip và bụi gót (video tham chiếu không có).
  shadow: z.boolean().default(true),
  dust: z.boolean().default(true),
  armSwing: z.number().min(0).max(3).default(1),
  // Lệch trung tâm vung tay (độ; âm = ra trước), để tay tự do luôn ở phía trước thân.
  armBias: z.number().min(-60).max(60).default(0),
  poses: z.array(z.object({atSec: z.number().min(0), pose: z.enum(['walk', 'carry', 'aim'])})).default([]),
  // Vũ khí chung chung gắn vào bàn tay (ảnh riêng, không nằm trong bảng bộ phận); hiện từ fromSec.
  weapon: z
    .object({
      src: z.string(),
      w: z.number().positive(),
      h: z.number().positive(),
      pivot: z.tuple([z.number(), z.number()]),
      attach: z.tuple([z.number(), z.number()]),
      parent: z.string().default('upperArmN'),
      fromSec: z.number().min(0).default(0),
      // Điểm bàn tay xa nắm trên súng (tỉ lệ trong ảnh súng). Có thì tay xa tự đưa tới đó (IK hai đoạn), súng cầm hai tay.
      support: z.tuple([z.number(), z.number()]).optional(),
    })
    .optional(),
});

// Nhân vật "runner": dựng lại chuyển động đo được từ video tham chiếu (tools/*run20*). Mọi toạ độ ở hệ khung gốc (refW×refH),
// ánh xạ vào khung cảnh theo chiều rộng. Thân trên/đầu/súng/tay cầm súng là MỘT ảnh cứng; chân là ống vẽ bằng vector; tay tự do gồm
// tay áo trên (quay quanh khuỷu, đỉnh hướng về vai) + cẳng tay từ khuỷu tới bàn tay; khuỷu/vai từng hình lấy từ track nếu có.
const Pt = z.tuple([z.number(), z.number()]);
const RunnerArt = z.object({src: z.string(), w: z.number().positive(), h: z.number().positive()});
const RunnerLayer = LayerBase.extend({
  type: z.literal('runner'),
  track: z.string(), // JSON số đo theo hình (content/...)
  nearLeg: z.union([z.literal(0), z.literal(1)]).default(0), // chân vẽ sau cùng (gần camera)
  // Thân trên: điểm `anchor` trong ảnh khớp với điểm `at` ở khung gốc tại tư thế nghỉ (hình 0), ảnh phóng `scale`, xoay `rotDeg` quanh anchor.
  upper: RunnerArt.extend({anchor: Pt, at: Pt, scale: z.number().positive(), rotDeg: z.number().default(0)}),
  // Khuỷu tay tự do: lệch so với tâm ngực lúc nghỉ (hệ khung gốc, quay theo thân).
  elbow: Pt,
  // pivot = khuỷu, top = đỉnh vai trong ảnh; shoulderShift = dời gốc vẽ so với vai track (hệ khung gốc lúc nghỉ) để vòm vai khuất sau thân
  armUp: RunnerArt.extend({pivot: Pt, top: Pt.optional(), shoulderShift: Pt.optional(), rotDeg: z.number().default(0)}),
  armFore: RunnerArt.extend({pivot: Pt, hand: Pt}), // pivot = khuỷu trong ảnh; hand = tâm bàn tay trong ảnh
  armScale: z.number().positive(),
  foot: RunnerArt.extend({centroid: Pt, axisDeg: z.number(), tube: Pt, scale: z.number().positive()}),
  leg: z
    .object({
      widths: z.tuple([z.number(), z.number(), z.number()]), // hông, gối, cổ chân (px khung gốc, chưa tính viền)
      outline: z.number().default(5),
      fill: z.string().default('#717670'),
      shade: z.string().default('#5b5e57'),
      ink: z.string().default('#141414'),
    })
    .default({widths: [130, 112, 62], outline: 4.5, fill: '#717670', shade: '#5b5e57', ink: '#141414'}),
});

const Joint = z.enum(['hip', 'neck', 'head', 'wrist1', 'wrist2', 'ankle1', 'ankle2']);

const FighterDef = z.object({
  id: z.string(),
  color: z.enum(['red', 'blue', 'ref', 'wehrmacht1936', 'prussia1871', 'heer1916']),
  x: z.number(), // vị trí hông (px) tại khung
  facing: z.union([z.literal(1), z.literal(-1)]),
  // Đòn theo frame của cảnh; speed < 1 = chậm. Trước mục đầu là đứng thủ.
  timeline: z.array(z.object({move: z.string(), at: z.number().int().min(0), speed: z.number().positive().default(1)})).default([]),
});

// Hiệu ứng (frame tính theo cảnh): impact star, rung, chớp trắng, tối dần, giữ hình, vạch tốc độ.
const Fx = z.discriminatedUnion('kind', [
  z.object({kind: z.literal('impact'), at: z.number().int(), fighter: z.string(), joint: Joint, size: z.number().default(1)}),
  z.object({kind: z.literal('shake'), at: z.number().int(), amp: z.number(), dur: z.number().int()}),
  z.object({kind: z.literal('flash'), at: z.number().int(), dur: z.number().int()}),
  z.object({kind: z.literal('fade'), at: z.number().int(), dur: z.number().int()}),
  z.object({kind: z.literal('freeze'), at: z.number().int(), frames: z.number().int()}),
  z.object({kind: z.literal('speedLines'), at: z.number().int(), dur: z.number().int(), fighter: z.string(), joint: Joint}),
]);

// Nổ/khói ở xa vẽ bằng code (không giao tranh trúng người): mỗi sự kiện một quầng lửa rồi khói.
const BurstLayer = LayerBase.extend({
  type: z.literal('burst'),
  events: z.array(z.object({atSec: z.number().min(0), x: z.number(), y: z.number(), size: z.number().default(1)})),
});

// Ảnh/mascot đặt lên bản đồ: ghim vào tọa độ địa lý (`geo`) hoặc cố định theo khung (`fixed`).
const MapOverlay = z
  .object({
    src: z.string(), // đường dẫn tương đối trong content/
    aspect: z.number().positive().default(1), // cao/rộng
    widthFrac: z.number().positive(), // tỉ lệ theo chiều rộng khung
    atSec: z.number().min(0),
    toSec: z.number().min(0),
    geo: z.object({lon: z.number(), lat: z.number()}).optional(),
    fixed: z.object({x: z.number(), y: z.number()}).optional(), // tâm ảnh theo tỉ lệ khung
    dx: z.number().default(0), // lệch so với điểm ghim, theo tỉ lệ chiều rộng khung
    dy: z.number().default(0),
    frame: z.boolean().default(false), // khung ảnh tư liệu: viền trắng + bóng
    rotateDeg: z.number().default(0),
    flipX: z.boolean().default(false),
  })
  .refine((o) => !!o.geo !== !!o.fixed, {message: 'cần đúng một trong geo hoặc fixed'});

// Bản đồ phẳng vẽ bằng code (Equal Earth, tâm kinh tuyến 160°E). Dữ liệu từ tools/map-extract.mjs.
const MapEmpire = z.object({
  id: z.string(),
  src: z.string(), // JSON polygon đế chế (frames[].key)
  color: z.string(), // key trong theme.mapTheme.empires
  // Mỗi stage bắt đầu tại atSec; chuyển sang stage sau bằng crossfade fadeSec kết thúc đúng tại atSec của stage sau.
  stages: z.array(z.object({atSec: z.number().min(0), key: z.string()})).min(1),
  fadeSec: z.number().positive().default(1),
  opacity: z.number().min(0).max(1).default(0.82),
});

const MapLayer = LayerBase.extend({
  type: z.literal('map'),
  baseSrc: z.string(), // JSON nền đất liền
  empires: z.array(MapEmpire).default([]),
  // Camera bản đồ: nội suy giữa các mốc (lon/lat là tâm khung; zoom 1 ≈ toàn khung ngang ~3,2 đơn vị Equal Earth).
  views: z.array(z.object({atSec: z.number().min(0), lon: z.number(), lat: z.number(), zoom: z.number().positive(), ease: EaseName.default('inOutCubic')})).min(1),
  overlays: z.array(MapOverlay).default([]),
  // Vòng tròn nhấp nháy chỉ vị trí (thay cho zoom để vẫn thấy toàn bộ đế chế).
  marks: z.array(z.object({lon: z.number(), lat: z.number(), atSec: z.number().min(0), toSec: z.number().min(0), radiusFrac: z.number().positive().default(0.03)})).default([]),
  // Nhãn địa danh (key i18n) để người xem biết đế chế nằm ở đâu: lục địa/đại dương (kind 'region') và nước/thành phố (kind 'place').
  labels: z.array(z.object({key: z.string(), lon: z.number(), lat: z.number(), atSec: z.number().min(0).default(0), toSec: z.number().min(0).default(9999), kind: z.enum(['region', 'place']).default('place')})).default([]),
  graticule: z.boolean().default(false),
});

const ArenaLayer = LayerBase.extend({
  type: z.literal('arena'),
  floorY: z.number(),
  seed: z.number().default(1),
});

const FighterLayer = LayerBase.extend({
  type: z.literal('fighters'),
  floorY: z.number(),
  scale: z.number().default(44), // R: bán kính đầu (px)
  fighters: z.array(FighterDef),
  fx: z.array(Fx).default([]),
});

export const Layer = z.discriminatedUnion('type', [
  SkyLayer,
  SilhouetteLayer,
  FogLayer,
  HazeLayer,
  ImageLayer,
  RigLayer,
  RunnerLayer,
  BurstLayer,
  MapLayer,
  ArenaLayer,
  FighterLayer,
]);

export const TextItem = z.object({
  // lowerThird: tiêu đề góc dưới trái; chip: thẻ chữ ngắn ở giữa phía trên (mốc ngày, số liệu, nguồn).
  type: z.enum(['lowerThird', 'chip', 'credit', 'caption']), // caption: chữ nghiêng nhỏ hai dòng không gạch (kiểu video tham chiếu)
  // credit: dòng ghi công nền tối, chữ nhỏ ở góc dưới trái
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
  // Tốc độ mặt đất (px/giây) tại lớp focusZ; nền lặp (tile) trôi trái theo tốc độ này × parallax. 0 = đứng yên.
  walkSpeed: z.number().default(0),
  // Máy quay cầm tay: hệ số độ trôi/thở của camera. 0 = đứng yên (bản đồ, sàn đấu, cảnh thử rig), 1 = mức chuẩn.
  handheld: z.number().min(0).default(0),
  focusZ: z.number(),
  camera: z.object({
    x: Range,
    zoom: Range,
    ease: EaseName.default('inOutSine'),
    // Nhiều đoạn: nội suy mượt giữa các mốc (zoom quanh điểm (fx, fy) theo tỉ lệ khung). Có shots thì bỏ qua zoom ở trên.
    shots: z.array(z.object({atSec: z.number().min(0), zoom: z.number().positive(), fx: z.number().default(0.5), fy: z.number().default(0.5)})).optional(),
  }),
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
export type MapLayerT = z.infer<typeof MapLayer>;
export type FighterLayerT = z.infer<typeof FighterLayer>;
export type RigLayerT = z.infer<typeof RigLayer>;
export type RunnerLayerT = z.infer<typeof RunnerLayer>;
export type ImageLayerT = z.infer<typeof ImageLayer>;
export type LocaleT = z.infer<typeof Locale>;
