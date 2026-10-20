// Sinh một cảnh MultiplaneScene (style empire-map) từ file dữ liệu đế chế, ghi vào scenes.json + locales/vi.json của dự án.
// Dùng: node tools/gen-empire-scene.mjs <project> <empire-id>      vd: node tools/gen-empire-scene.mjs 2026-largest-empires russia
// Dữ liệu: content/projects/<project>/empires/<id>.json (xem russia.json làm mẫu). Không sinh lời dẫn: narration chỉ để TTS/thẻ cảnh.
// Layer mascot liên tiếp cùng biểu cảm + cùng bên được gộp một layer (showSec); layer đầu tiên mỗi biểu cảm có id mascot_<expr>,
// các layer sau mascot_<expr>_<id beat>. assetId lấy từ prompts/manifest.json nếu khớp scene/layer.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [project, id] = process.argv.slice(2);
if (!project || !id) {
  console.error('Dùng: node tools/gen-empire-scene.mjs <project> <empire-id>');
  process.exit(1);
}
const pdir = path.join(root, 'content', 'projects', project);
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const e = readJson(path.join(pdir, 'empires', `${id}.json`));
const P = `projects/${project}`;
const r2 = (n) => Math.round(n * 100) / 100;

const manifestPath = path.join(pdir, 'prompts', 'manifest.json');
const assetOf = new Map();
if (fs.existsSync(manifestPath)) for (const a of readJson(manifestPath).assets) assetOf.set(`${a.scene}/${a.layer}`, a.assetId);

const sid = e.sceneId;
const locale = {};
const text = [];
const marks = [];
const labels = [];
let ln = 0;
const addLabel = (q, kind, defFrom, defTo) => {
  ln += 1;
  locale[`${sid}.l${ln}`] = q.text;
  labels.push({key: `${sid}.l${ln}`, lon: q.lon, lat: q.lat, atSec: q.from ?? defFrom, toSec: q.to ?? defTo, kind});
};
// Nhãn lục địa/đại dương dùng chung (file _labels.json), có sẵn suốt cảnh để người xem định vị đế chế.
const baseLabelsPath = path.join(pdir, 'empires', '_labels.json');
if (fs.existsSync(baseLabelsPath) && e.baseLabels !== false) for (const q of readJson(baseLabelsPath)) addLabel(q, 'region', 0, 9999);
for (const q of e.labels ?? []) addLabel(q, 'place', 0.5, 9999);
const overlays = [];

// Mascot: gộp các beat liền nhau cùng biểu cảm + cùng bên.
const mascotRuns = [];
for (const b of e.beats) {
  if (!b.mascot) continue;
  const last = mascotRuns[mascotRuns.length - 1];
  if (last && last.expr === b.mascot.expr && last.side === b.mascot.side && last.to === b.from) last.to = b.to;
  else mascotRuns.push({id: b.id, expr: b.mascot.expr, side: b.mascot.side, from: b.from, to: b.to});
}
const seenExpr = new Set();
const mascotLayers = mascotRuns.map((m) => {
  const layerId = seenExpr.has(m.expr) ? `mascot_${m.expr}_${m.id}` : `mascot_${m.expr}`;
  seenExpr.add(m.expr);
  const x = m.side === 'left' ? e.mascotX?.left ?? 0.09 : e.mascotX?.right ?? 0.91;
  const layer = {
    id: layerId,
    type: 'image',
    z: 4,
    src: `${P}/assets/mascot_${m.expr}.png`,
    status: 'final',
    width: e.mascotWidth ?? 0.1,
    x: [x, x],
    y: [e.mascotY ?? 0.8, e.mascotY ?? 0.8],
    ease: 'linear',
    aspect: 1,
    showSec: [m.from, m.to],
  };
  const asset = assetOf.get(`${sid}/${layerId}`);
  if (asset) layer.assetId = asset;
  return layer;
});

let n = 0;
for (const b of e.beats) {
  if (b.chip) {
    n += 1;
    locale[`${sid}.c${n}`] = b.chip.title;
    if (b.chip.sub) locale[`${sid}.c${n}.sub`] = b.chip.sub;
    text.push({type: 'chip', key: `${sid}.c${n}`, ...(b.chip.sub ? {subKey: `${sid}.c${n}.sub`} : {}), from: r2(b.from + 0.4), to: r2(b.to - 0.4)});
  }
  for (const q of b.labels ?? []) addLabel(q, 'place', r2(b.from + 0.5), b.to);
  for (const m of b.marks ?? []) marks.push({lon: m.lon, lat: m.lat, atSec: m.from ?? r2(b.from + 0.8), toSec: m.to ?? b.to, radiusFrac: m.radius ?? 0.03});
  for (const o of b.overlays ?? []) {
    const {from, to, src, ...rest} = o;
    const full = /^(projects|library)\//.test(src) ? src : `${P}/${src}`; // src tương đối = trong thư mục dự án
    overlays.push({src: full, ...rest, atSec: from ?? r2(b.from + 0.3), toSec: to ?? b.to});
  }
}
if (e.credit) {
  locale[`${sid}.credit`] = e.credit.title;
  locale[`${sid}.credit.sub`] = e.credit.sub;
  text.push({type: 'credit', key: `${sid}.credit`, subKey: `${sid}.credit.sub`, from: e.credit.from, to: e.credit.to});
}

const dur = e.durationSec;
const views = e.views ?? [
  {atSec: 0, ...e.view, ease: 'linear'},
  {atSec: dur, lon: e.view.lon, lat: e.view.lat, zoom: r2(e.view.zoom * 1.06), ease: 'linear'},
];

const mapLayer = {
  id: 'map',
  type: 'map',
  z: 3,
  baseSrc: `${P}/assets/map/world.json`,
  empires: e.empires.map((q) => ({id: q.id, src: `${P}/assets/map/${q.data}`, color: q.color, fadeSec: q.fadeSec ?? 2, opacity: q.opacity ?? 0.82, stages: q.stages})),
  views,
  overlays,
  marks,
  labels,
};
const scene = {
  id: sid,
  durationSec: dur,
  template: 'MultiplaneScene',
  grade: 'map_clean',
  focusZ: 3,
  camera: {x: [0, 0], zoom: [1, 1], ease: 'inOutSine'},
  layers: [mapLayer, ...mascotLayers],
  text,
  ...(e.audio ? {audio: e.audio} : {}),
};

// Ghi vào scenes.json (thay cảnh cùng id, giữ thứ tự; chưa có thì thêm cuối) và locales/vi.json (xóa key cũ của cảnh rồi ghi lại).
const scenesPath = path.join(pdir, 'scenes.json');
const proj = fs.existsSync(scenesPath) ? readJson(scenesPath) : {project, locale: 'vi', fps: 24, width: 1920, height: 1080, scenes: []};
const at = proj.scenes.findIndex((s) => s.id === sid);
if (at >= 0) proj.scenes[at] = scene;
else proj.scenes.push(scene);
fs.writeFileSync(scenesPath, JSON.stringify(proj, null, 2) + '\n');

const localePath = path.join(pdir, 'locales', 'vi.json');
const loc = fs.existsSync(localePath) ? readJson(localePath) : {};
for (const k of Object.keys(loc)) if (k.startsWith(`${sid}.`)) delete loc[k];
Object.assign(loc, locale);
fs.mkdirSync(path.dirname(localePath), {recursive: true});
fs.writeFileSync(localePath, JSON.stringify(loc, null, 2) + '\n');
console.log(`✓ ${project}/${sid} (${id}): ${scene.layers.length} layer, ${text.length} chữ, ${overlays.length} ảnh ghim, ${marks.length} vòng chỉ → scenes.json, locales/vi.json`);
