import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

type Pt = [number, number];
type Manifest = {
  assets: {
    assetId: string;
    inbox: string; // tên file không đuôi; nhận .png .jpg .jpeg .webp
    target: string; // tương đối content/
    scene: string;
    layer: string;
    process?: {
      crop?: {left: number; top: number; width: number; height: number}; // theo pixel ảnh gốc (loại watermark, lề thừa)
      keyOut?: boolean;
      keyTolerance?: number;
      minHolePx?: number; // vùng nền kín nhỏ hơn ngưỡng này (pixel) được giữ lại; đặt rất lớn để tắt
      trim?: boolean; // cắt sát chủ thể sau khi tách nền
      fit?: {width: number; height: number};
      // Điểm gắn cánh quạt theo pixel ẢNH GỐC; ingest tự quy đổi sang tỉ lệ ảnh cuối.
      anchors?: {mainHub?: Pt; tailHub?: Pt};
      // Bán kính cánh theo tỉ lệ chiều rộng chủ thể (sau trim).
      rotorRadius?: {main: number; tail: number};
    };
  }[];
};

const EXTS = ['.png', '.jpg', '.jpeg', '.webp'];
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = path.join(root, 'content');
const arg = process.argv[2];
const dirName = fs.readdirSync(path.join(content, 'projects')).find((d) => d === arg || d.endsWith(`-${arg}`));
if (!dirName) {
  console.error(`Dùng: npm run ingest -- <project>   (vd: test-huey)`);
  process.exit(1);
}
const pdir = path.join(content, 'projects', dirName);
const manifest: Manifest = JSON.parse(fs.readFileSync(path.join(pdir, 'prompts', 'manifest.json'), 'utf8'));
const scenesPath = path.join(pdir, 'scenes.json');
const scenes = JSON.parse(fs.readFileSync(scenesPath, 'utf8'));

// Cùng tên khác đuôi (jpg/png/webp): lấy file mới nhất, vì người dùng thường tải lại bản mới.
const findInbox = (stem: string) => {
  const base = stem.replace(/\.[^.]+$/, '');
  const found = EXTS.map((ext) => path.join(pdir, 'inbox', base + ext)).filter((p) => fs.existsSync(p));
  found.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return found[0] ?? null;
};

type Rgba = {data: Buffer; w: number; h: number};
const toRaw = async (buf: Buffer): Promise<Rgba> => {
  const {data, info} = await sharp(buf).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  return {data, w: info.width, h: info.height};
};
const fromRaw = ({data, w, h}: Rgba) => sharp(data, {raw: {width: w, height: h, channels: 4}}).png().toBuffer();

// Tách nền phẳng bằng flood-fill từ mép ảnh: chỉ vùng nền liên thông với mép mới bị xóa,
// nên các mảng màu xám bên trong chủ thể (kính, vỏ máy) không bị thủng.
function keyOut(img: Rgba, tol: number, minHole: number): void {
  const {data, w, h} = img;
  const px = (x: number, y: number) => (y * w + x) * 4;
  const corners = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)];
  const bg = [0, 1, 2].map((k) => Math.round(corners.reduce((s, i) => s + data[i + k], 0) / 4));
  const dist = (i: number) => Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);

  const isBg = new Uint8Array(w * h);
  const stack: number[] = [];
  const push = (x: number, y: number) => {
    const k = y * w + x;
    if (!isBg[k] && dist(k * 4) <= tol) {
      isBg[k] = 1;
      stack.push(k);
    }
  };
  for (let x = 0; x < w; x++) (push(x, 0), push(x, h - 1));
  for (let y = 0; y < h; y++) (push(0, y), push(w - 1, y));
  while (stack.length) {
    const k = stack.pop()!;
    const x = k % w;
    const y = (k - x) / w;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  // Vùng nền bị bao kín (qua cửa mở, giữa hai thanh trượt...): xóa nếu đủ lớn.
  // Mảng nhỏ giữ lại vì có thể là chi tiết của chủ thể.
  const seen = new Uint8Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (isBg[s] || seen[s] || dist(s * 4) > tol) continue;
    const comp: number[] = [s];
    seen[s] = 1;
    for (let i = 0; i < comp.length; i++) {
      const k = comp[i];
      const x = k % w;
      const y = (k - x) / w;
      const nb = [x > 0 ? k - 1 : -1, x < w - 1 ? k + 1 : -1, y > 0 ? k - w : -1, y < h - 1 ? k + w : -1];
      for (const n of nb) {
        if (n < 0 || isBg[n] || seen[n] || dist(n * 4) > tol) continue;
        seen[n] = 1;
        comp.push(n);
      }
    }
    if (comp.length >= minHole) for (const k of comp) isBg[k] = 1;
  }

  // viền mềm: pixel chủ thể sát nền và còn gần màu nền → alpha tăng dần
  const soft = tol * 0.8;
  const edgeAlpha: [number, number][] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      if (isBg[k]) continue;
      const nearBg =
        (x > 0 && isBg[k - 1]) || (x < w - 1 && isBg[k + 1]) || (y > 0 && isBg[k - w]) || (y < h - 1 && isBg[k + w]);
      if (!nearBg) continue;
      const d = dist(k * 4);
      if (d <= tol + soft) edgeAlpha.push([k, Math.round(((d - tol) / soft) * 255)]);
    }
  }
  for (let k = 0; k < isBg.length; k++) if (isBg[k]) data[k * 4 + 3] = 0;
  for (const [k, a] of edgeAlpha) data[k * 4 + 3] = Math.max(0, Math.min(255, a));
}

// Hộp bao của vùng có alpha; bỏ qua đốm lẻ (hàng/cột có < 3 pixel đục).
function alphaBBox({data, w, h}: Rgba) {
  const rows = new Uint32Array(h);
  const cols = new Uint32Array(w);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (data[(y * w + x) * 4 + 3] > 128) {
        rows[y]++;
        cols[x]++;
      }
  const first = (a: Uint32Array) => a.findIndex((v) => v >= 3);
  const last = (a: Uint32Array) => a.length - 1 - [...a].reverse().findIndex((v) => v >= 3);
  const left = first(cols);
  const top = first(rows);
  return {left, top, width: last(cols) - left + 1, height: last(rows) - top + 1};
}

let done = 0;
for (const a of manifest.assets) {
  const src = findInbox(a.inbox);
  if (!src) {
    console.log(`– ${a.assetId}: chưa có inbox/${a.inbox}.(png|jpg|webp), bỏ qua`);
    continue;
  }
  const p = a.process ?? {};
  // Chuẩn hóa định dạng: mọi đầu vào (jpg/png/webp) → PNG RGBA, áp EXIF orientation, bỏ metadata.
  // Tọa độ crop/anchors trong manifest tính trên ảnh này (cùng kích thước ảnh gốc).
  let buf: Buffer = await sharp(fs.readFileSync(src)).rotate().ensureAlpha().png().toBuffer();
  const srcMeta = await sharp(buf).metadata();

  // Hệ tọa độ: pixel ảnh gốc → (trừ crop) → (trừ trim) → (scale+pad của fit)
  let offX = 0;
  let offY = 0;
  let scale = 1;
  let padX = 0;
  let padY = 0;
  let curW = srcMeta.width!;
  let curH = srcMeta.height!;

  if (p.crop) {
    buf = await sharp(buf).extract(p.crop).toBuffer();
    offX += p.crop.left;
    offY += p.crop.top;
    curW = p.crop.width;
    curH = p.crop.height;
  }
  if (p.keyOut) {
    const raw = await toRaw(buf);
    keyOut(raw, p.keyTolerance ?? 38, p.minHolePx ?? 600);
    buf = await fromRaw(raw);
    if (p.trim) {
      const bb = alphaBBox(raw);
      buf = await sharp(buf).extract(bb).png().toBuffer();
      offX += bb.left;
      offY += bb.top;
      curW = bb.width;
      curH = bb.height;
    }
  }
  if (p.fit) {
    scale = Math.min(p.fit.width / curW, p.fit.height / curH);
    const rw = Math.round(curW * scale);
    const rh = Math.round(curH * scale);
    padX = Math.floor((p.fit.width - rw) / 2);
    padY = Math.floor((p.fit.height - rh) / 2);
    buf = await sharp(buf)
      .resize(rw, rh, {fit: 'fill'})
      .extend({top: padY, bottom: p.fit.height - rh - padY, left: padX, right: p.fit.width - rw - padX, background: {r: 0, g: 0, b: 0, alpha: 0}})
      .png()
      .toBuffer();
  }

  const out = path.join(content, a.target);
  fs.mkdirSync(path.dirname(out), {recursive: true});
  fs.writeFileSync(out, buf);

  const scene = scenes.scenes.find((s: {id: string}) => s.id === a.scene);
  const layer = scene?.layers.find((l: {id: string}) => l.id === a.layer);
  if (!layer) {
    console.error(`✗ ${a.assetId}: không thấy layer ${a.scene}/${a.layer} trong scenes.json`);
    process.exit(1);
  }
  layer.src = a.target;
  layer.status = 'final';

  // Quy đổi điểm gắn cánh quạt sang tỉ lệ ảnh cuối
  const outW = p.fit?.width ?? curW;
  const outH = p.fit?.height ?? curH;
  const conv = ([x, y]: Pt): Pt => [
    Number((((x - offX) * scale + padX) / outW).toFixed(4)),
    Number((((y - offY) * scale + padY) / outH).toFixed(4)),
  ];
  const subjectW = (curW * scale) / outW; // chiều rộng chủ thể theo tỉ lệ ảnh cuối
  if (p.anchors && layer.rotors) {
    const r = p.rotorRadius ?? {main: 0.55, tail: 0.085};
    if (p.anchors.mainHub) {
      const [x, y] = conv(p.anchors.mainHub);
      layer.rotors.main = {x, y, radius: Number((r.main * subjectW).toFixed(4))};
    }
    if (p.anchors.tailHub) {
      const [x, y] = conv(p.anchors.tailHub);
      layer.rotors.tail = {x, y, radius: Number((r.tail * subjectW).toFixed(4))};
    }
  }
  console.log(
    `✓ ${a.assetId}: ${path.basename(src)} ${srcMeta.width}×${srcMeta.height} → ${a.target}` +
      (p.keyOut ? ' (đã tách nền' + (p.trim ? ', trim' : '') + ')' : '') +
      (p.anchors && layer.rotors ? `\n   rotors: ${JSON.stringify(layer.rotors)}` : ''),
  );
  done++;
}

if (done) fs.writeFileSync(scenesPath, JSON.stringify(scenes, null, 2) + '\n');
console.log(done ? `\nĐã cập nhật scenes.json (${done} asset). Chạy: npm run validate` : '\nKhông có gì để ingest.');
