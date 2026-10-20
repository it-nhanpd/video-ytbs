import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

type Pt = [number, number];
type Manifest = {
  assets: {
    assetId: string;
    inbox: string | string[]; // tên file không đuôi; nhận .png .jpg .jpeg .webp. Mảng: nhiều sheet, ghép frame theo thứ tự
    target: string; // tương đối content/
    scene: string;
    layer: string;
    process?: {
      crop?: {left: number; top: number; width: number; height: number}; // theo pixel ảnh gốc (loại watermark, lề thừa)
      keyOut?: boolean;
      keyColor?: [number, number, number]; // màu nền cần tách (mặc định: trung bình 4 góc); dùng khi góc ảnh không phải nền
      replacesLayers?: string[]; // khi ảnh này về: hiện layer đích (bỏ opacity 0) và xóa các layer nền sinh bằng code có id này trong cảnh
      seamBlend?: number; // 0..0.5: làm ảnh lặp ngang liền mạch bằng cách trộn đầu–cuối (tỉ lệ chiều rộng); ảnh ngắn đi bấy nhiêu
      aspectFromImage?: boolean; // ghi layer.aspect = cao/rộng của ảnh cuối (không cần fit)
      keyTolerance?: number;
      minHolePx?: number; // vùng nền kín nhỏ hơn ngưỡng này (pixel) được giữ lại; đặt rất lớn để tắt
      trim?: boolean; // cắt sát chủ thể sau khi tách nền
      fit?: {width: number; height: number};
      // Sprite sheet bước đi: tách N tư thế/ảnh theo khoảng trống cột, chung scale + baseline, ghi layer.frames.
      splitFrames?: {count: number; minGapPx?: number; frameFit: {width: number; height: number}; headNorm?: boolean | 'sheet'; alignX?: 'centroid' | 'head'; take?: number; despeckle?: number};
      // Bảng bộ phận nhân vật rig (1 ảnh, xếp một hàng trái → phải): tách, ghi layer.parts của layer type 'rig'.
      splitParts?: {pieces: string[]; erase?: {left: number; top: number; width: number; height: number}[]; minGapPx?: number; maxSidePx?: number; elbowCut?: number; elbowOverlap?: number; components?: boolean; noNearArm?: boolean; farArmZ?: number; farArmShade?: number; overrides?: Record<string, {pivot?: Pt; attach?: Pt; scale?: number}>};
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
function keyOut(img: Rgba, tol: number, minHole: number, keyColor?: number[]): void {
  const {data, w, h} = img;
  const px = (x: number, y: number) => (y * w + x) * 4;
  const corners = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)];
  const bg = keyColor ?? [0, 1, 2].map((k) => Math.round(corners.reduce((s, i) => s + data[i + k], 0) / 4));
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

// Tách sprite sheet: các cụm cột có alpha, cách nhau ≥ minGap cột trống. Trả về [left, right] từng cụm.
function columnRuns({data, w, h}: Rgba, minGap: number): [number, number][] {
  const on = (x: number) => {
    let n = 0;
    for (let y = 0; y < h; y++) if (data[(y * w + x) * 4 + 3] > 128) n++;
    return n >= 3;
  };
  const runs: [number, number][] = [];
  let start = -1;
  let gap = 0;
  for (let x = 0; x < w; x++) {
    if (on(x)) {
      if (start < 0) start = x;
      gap = 0;
    } else if (start >= 0 && ++gap >= minGap) {
      runs.push([start, x - gap]);
      start = -1;
    }
  }
  if (start >= 0) runs.push([start, w - 1]);
  return runs;
}

let done = 0;
let failed = 0;
// Tìm layer đích TRƯỚC khi ghi file, để lỗi tên layer không để lại ảnh mới trong assets/ mà scenes.json không cập nhật.
const findLayer = (a: Manifest['assets'][number], type?: string) => {
  const scene = scenes.scenes.find((s: {id: string}) => s.id === a.scene);
  const layer = scene?.layers.find((l: {id: string}) => l.id === a.layer);
  if (!layer || (type && layer.type !== type)) {
    console.error(`✗ ${a.assetId}: layer ${a.scene}/${a.layer} không có trong scenes.json` + (type ? ` hoặc không phải type "${type}"` : ''));
    failed++;
    return null;
  }
  return {scene, layer};
};
// Tham số thứ 2 (tùy chọn): danh sách assetId cách nhau bằng dấu phẩy để chỉ xử lý các asset đó.
const only = process.argv[3]?.split(',');
assetLoop: for (const a of manifest.assets) {
  if (only && !only.includes(a.assetId)) continue;
  const stems = Array.isArray(a.inbox) ? a.inbox : [a.inbox];
  const srcs = stems.map(findInbox);
  if (srcs.some((s) => !s)) {
    console.log(`– ${a.assetId}: chưa đủ inbox/${stems.join(', ')}.(png|jpg|webp), bỏ qua`);
    continue;
  }
  const src = srcs[0]!;
  const p = a.process ?? {};

  if (p.splitParts) {
    // Bảng bộ phận nhân vật rig: MỘT ảnh, các bộ phận xếp một hàng trái → phải theo thứ tự `pieces`.
    // Chi xa dùng lại ảnh chi gần (tối hơn bằng `shade`), nên màu/tỉ lệ luôn khớp. Ghi layer.parts của layer type 'rig'.
    const sp = p.splitParts;
    const target3 = findLayer(a, 'rig');
    if (!target3) continue;
    let b: Buffer = await sharp(fs.readFileSync(src)).rotate().ensureAlpha().png().toBuffer();
    if (p.crop) b = await sharp(b).extract(p.crop).toBuffer();
    const raw = await toRaw(b);
    if (p.keyOut) keyOut(raw, p.keyTolerance ?? 38, p.minHolePx ?? 600, p.keyColor);
    // Xóa vùng cố định (watermark sao góc dưới phải...) trước khi tách cụm.
    for (const e of sp.erase ?? []) for (let y = Math.max(0, e.top); y < Math.min(raw.h, e.top + e.height); y++) for (let x = Math.max(0, e.left); x < Math.min(raw.w, e.left + e.width); x++) raw.data[(y * raw.w + x) * 4 + 3] = 0;
    // components: tách theo thành phần liên thông 2D (bộ phận có phần nhô ngang như nòng súng chồng cột với bộ phận khác).
    // Mỗi bộ phận chỉ giữ điểm ảnh của chính nó; sắp theo tâm x từ trái sang phải.
    let masked: Rgba[] | null = null;
    let runs: [number, number][] = [];
    if (sp.components) {
      const lab = new Int32Array(raw.w * raw.h).fill(-1);
      const comps: {n: number; l: number; r: number; t: number; b: number; sx: number}[] = [];
      for (let s0 = 0; s0 < raw.w * raw.h; s0++) {
        if (lab[s0] >= 0 || raw.data[s0 * 4 + 3] <= 128) continue;
        const id = comps.length;
        const c = {n: 0, l: raw.w, r: 0, t: raw.h, b: 0, sx: 0};
        const st = [s0];
        lab[s0] = id;
        while (st.length) {
          const q = st.pop()!;
          const x = q % raw.w, y = (q - x) / raw.w;
          c.n++; c.sx += x;
          if (x < c.l) c.l = x; if (x > c.r) c.r = x; if (y < c.t) c.t = y; if (y > c.b) c.b = y;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= raw.w || ny >= raw.h) continue;
            const k = ny * raw.w + nx;
            if (lab[k] < 0 && raw.data[k * 4 + 3] > 128) { lab[k] = id; st.push(k); }
          }
        }
        comps.push(c);
      }
      // Mảnh nhỏ rời (đốm sót do keyOut): gộp vào bộ phận gần nhất thay vì bỏ, để không mất nét vẽ.
      let keep = comps.map((_, i) => i);
      const owner = comps.map((_, i) => i);
      while (keep.length > sp.pieces.length) {
        const k = keep.reduce((m, i) => (comps[i].n < comps[m].n ? i : m), keep[0]);
        keep = keep.filter((i) => i !== k);
        const gap = (u: (typeof comps)[number], v: (typeof comps)[number]) => Math.hypot(Math.max(0, u.l - v.r, v.l - u.r), Math.max(0, u.t - v.b, v.t - u.b));
        const tgt = keep.reduce((m, i) => (gap(comps[k], comps[i]) < gap(comps[k], comps[m]) ? i : m), keep[0]);
        console.warn(`⚠ ${a.assetId}: gộp mảnh rời ${comps[k].n} điểm ảnh (cột ${comps[k].l}–${comps[k].r}) vào bộ phận ở cột ${comps[tgt].l}–${comps[tgt].r}`);
        const T = comps[tgt], K = comps[k];
        T.l = Math.min(T.l, K.l); T.r = Math.max(T.r, K.r); T.t = Math.min(T.t, K.t); T.b = Math.max(T.b, K.b); T.sx += K.sx; T.n += K.n;
        for (let i = 0; i < owner.length; i++) if (owner[i] === k) owner[i] = tgt;
      }
      keep.sort((i, j) => comps[i].sx / comps[i].n - comps[j].sx / comps[j].n);
      masked = keep.map((i) => {
        const d = Buffer.from(raw.data);
        for (let k = 0; k < raw.w * raw.h; k++) if (lab[k] < 0 || owner[lab[k]] !== i) d[k * 4 + 3] = 0;
        return {...raw, data: d};
      });
      runs = keep.map((i) => [comps[i].l, comps[i].r] as [number, number]);
    } else runs = columnRuns(raw, sp.minGapPx ?? 20);
    // Thừa cụm (watermark sao ở góc, đốm lẻ): bỏ cụm có ít điểm ảnh nhất cho tới khi đủ số bộ phận.
    while (!masked && runs.length > sp.pieces.length) {
      const mass = runs.map(([l, r]) => {
        let m = 0;
        for (let y = 0; y < raw.h; y++) for (let x = l; x <= r; x++) if (raw.data[(y * raw.w + x) * 4 + 3] > 128) m++;
        return m;
      });
      const k = mass.indexOf(Math.min(...mass));
      console.warn(`⚠ ${a.assetId}: bỏ cụm thừa cột ${runs[k][0]}–${runs[k][1]} (${mass[k]} điểm ảnh): nghi watermark hoặc đốm lẻ`);
      runs = runs.filter((_, i) => i !== k);
    }
    if (runs.length !== sp.pieces.length) {
      console.error(`✗ ${a.assetId}: tìm thấy ${runs.length} bộ phận, cần ${sp.pieces.length} (${sp.pieces.join(', ')}). Kiểm tra khoảng trống giữa các bộ phận (minGapPx=${sp.minGapPx ?? 20}), bộ phận chồng/chạm nhau, hoặc crop.`);
      failed++;
      continue;
    }
    const boxes = runs.map(([l, r], bi) => {
      const src2 = masked ? masked[bi] : raw;
      let top = raw.h, bottom = -1;
      for (let y = 0; y < raw.h; y++)
        for (let x = l; x <= r; x++)
          if (src2.data[(y * raw.w + x) * 4 + 3] > 128) {
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
      return {l, r, top, bottom, w: r - l + 1, h: bottom - top + 1};
    });
    const sc = Math.min(1, (sp.maxSidePx ?? 900) / Math.max(...boxes.map((q) => Math.max(q.w, q.h))));
    const img: Record<string, {rel: string; w: number; h: number}> = {};
    for (let i = 0; i < boxes.length; i++) {
      const q = boxes[i];
      const w = Math.max(1, Math.round(q.w * sc));
      const h = Math.max(1, Math.round(q.h * sc));
      const buf2 = await sharp(await fromRaw(masked ? masked[i] : raw)).extract({left: q.l, top: q.top, width: q.w, height: q.h}).resize(w, h, {fit: 'fill'}).png().toBuffer();
      const rel2 = a.target.replace(/\.png$/, '') + `_${sp.pieces[i]}.png`;
      fs.mkdirSync(path.dirname(path.join(content, rel2)), {recursive: true});
      fs.writeFileSync(path.join(content, rel2), buf2);
      img[sp.pieces[i]] = {rel: rel2, w, h};
    }
    // Khớp mặc định (tỉ lệ trong ảnh; chi vẽ thẳng đứng, bàn chân hướng phải). Ghi đè từng bộ phận bằng sp.overrides.
    const D: Record<string, {pivot: Pt; attach?: Pt}> = {
      torso: {pivot: [0.5, 0.97]},
      head: {pivot: [0.45, 0.93], attach: [0.5, 0.02]},
      upperArm: {pivot: [0.5, 0.07], attach: [0.5, 0.12]},
      foreArm: {pivot: [0.5, 0.07], attach: [0.5, 0.93]},
      thigh: {pivot: [0.5, 0.06], attach: [0.5, 0.97]},
      shin: {pivot: [0.5, 0.05], attach: [0.5, 0.94]},
      foot: {pivot: [0.28, 0.12], attach: [0.5, 0.96]},
      weapon: {pivot: [0.15, 0.5], attach: [0.5, 0.95]},
    };
    const FAR = 0.78;
    // Tay nguyên cánh → tách khuỷu bằng code: tay trên [0, cut+ov?] và cẳng tay [cut-ov, 1] (chồng nhau một dải để không hở khi gập).
    const elbow = sp.elbowCut && img.arm ? {cut: sp.elbowCut, ov: sp.elbowOverlap ?? 0.04} : null;
    const armOv: {pivot?: Pt; attach?: Pt} = sp.overrides?.arm ?? {};
    if (elbow && img.arm) {
      const A = img.arm;
      const hU = Math.round(A.h * (elbow.cut + elbow.ov));
      const y2 = Math.round(A.h * (elbow.cut - elbow.ov));
      const armBuf = fs.readFileSync(path.join(content, A.rel));
      const relU = A.rel.replace(/_arm.png$/, '_upperArm.png');
      const relF = A.rel.replace(/_arm.png$/, '_foreArm.png');
      fs.writeFileSync(path.join(content, relU), await sharp(armBuf).extract({left: 0, top: 0, width: A.w, height: hU}).png().toBuffer());
      fs.writeFileSync(path.join(content, relF), await sharp(armBuf).extract({left: 0, top: y2, width: A.w, height: A.h - y2}).png().toBuffer());
      img.upperArm = {rel: relU, w: A.w, h: hU};
      img.foreArm = {rel: relF, w: A.w, h: A.h - y2};
      delete img.arm;
      const sh = armOv.pivot?.[1] ?? D.upperArm.pivot[1]; // vai, theo tỉ lệ cả cánh
      D.upperArm = {pivot: [armOv.pivot?.[0] ?? 0.5, (sh * A.h) / hU], attach: armOv.attach ?? D.upperArm.attach};
      D.foreArm = {pivot: [0.5, (elbow.cut * A.h - y2) / img.foreArm.h], attach: [0.5, (elbow.cut * A.h) / hU]};
    }
    // Ảnh AI không luôn tách đúng: tay nguyên cánh ("arm") thay cho tay trên + cẳng tay (không có khuỷu); cẳng chân đã gồm bàn chân thì bỏ "foot" (không có cổ chân).
    // Thứ tự z: chi xa (1–6) < thân (10) < đầu (11) < tay gần (15–16); chân gần nằm SAU thân (7–9) để vạt áo che khớp hông.
    type Plan = {id: string; name: string; parent: string | null; z: number; joint: string; shade: number};
    const plan: Plan[] = [{id: 'torso', name: 'torso', parent: null, z: 10, joint: 'torso', shade: 1}, {id: 'head', name: 'head', parent: 'torso', z: 11, joint: 'head', shade: 1}];
    for (const side of [{k: 'F', shade: FAR, za: sp.farArmZ ?? 1, zl: 3}, {k: 'N', shade: 1, za: 15, zl: 7}]) {
      // noNearArm: tay gần đã nằm trong ảnh thân (tay cầm súng liền khối), không tạo bộ phận tay gần.
      if (!(sp.noNearArm && side.k === 'N')) {
        const ash = side.k === 'F' ? (sp.farArmShade ?? side.shade) : side.shade;
        if (img.arm) plan.push({id: 'upperArm' + side.k, name: 'arm', parent: 'torso', z: side.za, joint: 'upperArm' + side.k, shade: ash});
        else {
          plan.push({id: 'upperArm' + side.k, name: 'upperArm', parent: 'torso', z: side.za, joint: 'upperArm' + side.k, shade: ash});
          plan.push({id: 'foreArm' + side.k, name: 'foreArm', parent: 'upperArm' + side.k, z: side.za + 1, joint: 'foreArm' + side.k, shade: ash});
        }
      }
      plan.push({id: 'thigh' + side.k, name: 'thigh', parent: 'torso', z: side.zl, joint: 'thigh' + side.k, shade: side.shade});
      plan.push({id: 'shin' + side.k, name: 'shin', parent: 'thigh' + side.k, z: side.zl + 1, joint: 'shin' + side.k, shade: side.shade});
      if (img.foot) plan.push({id: 'foot' + side.k, name: 'foot', parent: 'shin' + side.k, z: side.zl + 2, joint: 'foot' + side.k, shade: side.shade});
    }
    if (img.weapon) plan.push({id: 'weapon', name: 'weapon', parent: img.arm ? 'upperArmN' : 'foreArmN', z: 17, joint: 'weapon', shade: 1});
    const parts = [];
    for (const {id, name, parent, z, joint, shade} of plan) {
      const im = img[name];
      if (!im) {
        console.error(`✗ ${a.assetId}: thiếu bộ phận "${name}" trong pieces`);
        failed++;
        continue assetLoop;
      }
      const d = {...D[name === 'arm' ? 'upperArm' : name], ...(sp.overrides?.[name] ?? {})};
      parts.push({id, src: im.rel, ...(parent ? {parent} : {}), w: Math.round(im.w * (sp.overrides?.[name]?.scale ?? 1)), h: Math.round(im.h * (sp.overrides?.[name]?.scale ?? 1)), pivot: d.pivot, ...(parent && d.attach ? {attach: d.attach} : {}), z, joint, shade});
    }
    const ly3 = target3.layer;
    ly3.parts = parts;
    ly3.status = 'final';
    console.log(`✓ ${a.assetId}: ${sp.pieces.length} bộ phận → ${parts.length} phần rig (scale ${sc.toFixed(3)}), ví dụ ${parts[0].src}`);
    done++;
    continue;
  }

  if (p.splitFrames) {
    const sf = p.splitFrames;
    const target2 = findLayer(a);
    if (!target2) continue;
    // 1) crop + tách nền từng sheet, gom cụm cột thành frame
    const cut: {raw: Rgba; l: number; r: number; top: number; bottom: number; cx: number; si: number}[] = [];
    for (const [si, s] of (srcs as string[]).entries()) {
      let b: Buffer = await sharp(fs.readFileSync(s)).rotate().ensureAlpha().png().toBuffer();
      if (p.crop) b = await sharp(b).extract(p.crop).toBuffer();
      const raw = await toRaw(b);
      if (p.keyOut) keyOut(raw, p.keyTolerance ?? 38, p.minHolePx ?? 600, p.keyColor);
      let runs = columnRuns(raw, sf.minGapPx ?? 10);
      // Các tư thế chạm/chồng nhau (bước chân dài): thử khoảng trống nhỏ dần, rồi cắt tại cột thưa nhất.
      if (runs.length < sf.count) {
        for (const g of [10, 5, 3, 1]) {
          const r2 = columnRuns(raw, g);
          if (r2.length >= runs.length) runs = r2;
          if (r2.length === sf.count) break;
        }
        while (runs.length < sf.count) {
          let wi = 0;
          runs.forEach((r, i) => { if (r[1] - r[0] > runs[wi][1] - runs[wi][0]) wi = i; });
          const [l, r] = runs[wi];
          let best = l + Math.round((r - l) / 2), bestN = Infinity;
          for (let x = l + Math.round((r - l) * 0.3); x <= l + Math.round((r - l) * 0.7); x++) {
            let n = 0;
            for (let y = 0; y < raw.h; y++) if (raw.data[(y * raw.w + x) * 4 + 3] > 128) n++;
            if (n < bestN) { bestN = n; best = x; }
          }
          runs.splice(wi, 1, [l, best - 1], [best + 1, r]);
          console.warn(`⚠ ${a.assetId}: ${path.basename(s)} có tư thế chạm nhau, cắt tại cột ${best}: kiểm tra chân/ủng bị cụt`);
        }
      }
      if (runs.length !== sf.count) {
        console.error(`✗ ${a.assetId}: ${path.basename(s)} tìm thấy ${runs.length} tư thế, cần ${sf.count}. Kiểm tra khoảng trống giữa các tư thế (minGapPx=${sf.minGapPx ?? 10}) hoặc crop.`);
        failed++;
        continue assetLoop; // bỏ qua asset lỗi, vẫn ingest các asset khác
      }
      // despeckle: xóa mảnh rời nhỏ (đốm/rác do model vẽ) trong từng cột-tư-thế trước khi đo hộp bao.
      if (sf.despeckle) {
        const seen = new Uint8Array(raw.w * raw.h);
        for (const [l, r] of runs) {
          for (let y0 = 0; y0 < raw.h; y0++)
            for (let x0 = l; x0 <= r; x0++) {
              const k0 = y0 * raw.w + x0;
              if (seen[k0] || raw.data[k0 * 4 + 3] <= 128) continue;
              const comp: number[] = [k0];
              seen[k0] = 1;
              for (let h = 0; h < comp.length; h++) {
                const q = comp[h];
                const x = q % raw.w, y = (q - x) / raw.w;
                for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                  const nx = x + dx, ny = y + dy;
                  if (nx < l || nx > r || ny < 0 || ny >= raw.h) continue;
                  const k = ny * raw.w + nx;
                  if (!seen[k] && raw.data[k * 4 + 3] > 128) { seen[k] = 1; comp.push(k); }
                }
              }
              if (comp.length < sf.despeckle) for (const q of comp) raw.data[q * 4 + 3] = 0;
            }
        }
      }
      for (const [l, r] of runs) {
        let top = raw.h, bottom = -1, mass = 0, sumX = 0;
        for (let y = 0; y < raw.h; y++)
          for (let x = l; x <= r; x++)
            if (raw.data[(y * raw.w + x) * 4 + 3] > 128) {
              if (y < top) top = y;
              if (y > bottom) bottom = y;
              mass++;
              sumX += x;
            }
        cut.push({raw, l, r, top, bottom, cx: sumX / mass, si});
      }
    }
    // 2) chung scale (theo tư thế cao nhất/rộng nhất quanh trọng tâm), chung baseline (đáy), chung trục ngang (trọng tâm)
    const {width: FW, height: FH} = sf.frameFit;
    // Cảnh báo ảnh lệch: chiều cao các tư thế chênh nhiều thường do chữ/đường kẻ đất dính vào hoặc khác tỉ lệ giữa các sheet.
    const hs = cut.map((c) => c.bottom - c.top + 1);
    const hMin = Math.min(...hs);
    const hMax = Math.max(...hs);
    if (hMax / hMin > 1.2) console.warn(`⚠ ${a.assetId}: chiều cao tư thế chênh ${Math.round((hMax / hMin - 1) * 100)}% (${hs.join(', ')}px): kiểm tra chữ/đường kẻ đất dính vào, hoặc khác tỉ lệ giữa các sheet`);
    // Chuẩn hóa tỉ lệ theo bề rộng mũ (đầu không đổi theo tư thế): sửa lệch tỉ lệ giữa các sheet/tư thế do ảnh AI. Tắt bằng headNorm:false.
    const headBand = cut.map((c) => {
      const h0 = c.bottom - c.top + 1;
      const y0 = c.top + Math.round(h0 * 0.05);
      const y1 = c.top + Math.round(h0 * 0.14);
      let mn = c.r, mx = c.l;
      for (let y = y0; y <= y1; y++)
        for (let x = c.l; x <= c.r; x++)
          if (c.raw.data[(y * c.raw.w + x) * 4 + 3] > 128) {
            if (x < mn) mn = x;
            if (x > mx) mx = x;
          }
      return {w: Math.max(1, mx - mn + 1), cx: (mn + mx) / 2};
    });
    const headW = headBand.map((h) => h.w);
    // alignX 'head': căn theo tâm mũ (thân không giật ngang khi chân/súng duỗi); mặc định căn theo trọng tâm.
    const anchorX = cut.map((c, i) => (sf.alignX === 'head' ? headBand[i].cx : c.cx));
    const refHead = [...headW].sort((p, q) => p - q)[Math.floor(headW.length / 2)];
    // headNorm 'sheet': chuẩn hóa theo chiều cao trung vị của từng sheet (bề rộng mũ không đo được khi vai lẫn vào dải đầu).
    const med = (a: number[]) => [...a].sort((p, q) => p - q)[Math.floor(a.length / 2)];
    const sheetMed = new Map<number, number>();
    for (const si of new Set(cut.map((c) => c.si))) sheetMed.set(si, med(cut.filter((c) => c.si === si).map((c) => c.bottom - c.top + 1)));
    const globalMed = med([...sheetMed.values()]);
    const rel = cut.map((c, i) => (sf.headNorm === false ? 1 : sf.headNorm === 'sheet' ? globalMed / sheetMed.get(c.si)! : refHead / headW[i]));
    if (sf.headNorm !== false) console.log(`  headNorm${sf.headNorm === 'sheet' ? '(sheet)' : ''}: bề rộng mũ ${headW.join(', ')}px → hệ số ${rel.map((r) => r.toFixed(2)).join(', ')}`);
    const maxH = Math.max(...cut.map((c, i) => (c.bottom - c.top + 1) * rel[i]));
    const maxHalf = Math.max(...cut.map((c, i) => (Math.max(anchorX[i] - c.l, c.r - anchorX[i]) + 1) * rel[i]));
    const sc0 = Math.min(FH / maxH, FW / 2 / maxHalf);
    const frames: string[] = [];
    for (let i = 0; i < Math.min(cut.length, sf.take ?? cut.length); i++) {
      const c = cut[i];
      const w0 = c.r - c.l + 1;
      const h0 = c.bottom - c.top + 1;
      const piece = await sharp(await fromRaw(c.raw)).extract({left: c.l, top: c.top, width: w0, height: h0}).toBuffer();
      const sc = sc0 * rel[i];
      const rw = Math.max(1, Math.round(w0 * sc));
      const rh = Math.max(1, Math.round(h0 * sc));
      const left = Math.round(FW / 2 - (anchorX[i] - c.l) * sc);
      const top = FH - rh;
      const outBuf = await sharp(piece)
        .resize(rw, rh, {fit: 'fill'})
        .extend({top, bottom: 0, left: Math.max(0, left), right: Math.max(0, FW - rw - Math.max(0, left)), background: {r: 0, g: 0, b: 0, alpha: 0}})
        .png()
        .toBuffer();
      const relPath = a.target.replace(/.png$/, `_f${i + 1}.png`);
      fs.mkdirSync(path.dirname(path.join(content, relPath)), {recursive: true});
      fs.writeFileSync(path.join(content, relPath), outBuf);
      frames.push(relPath);
    }
    const ly = target2.layer;
    ly.frames = frames;
    ly.src = frames[0];
    ly.aspect = Number((FH / FW).toFixed(4));
    ly.status = 'final';
    console.log(`✓ ${a.assetId}: ${cut.length} frame ${FW}×${FH} (scale ${sc0.toFixed(3)}) → ${frames[0]} … ${path.basename(frames[frames.length - 1])}`);
    done++;
    continue;
  }
  const target = findLayer(a);
  if (!target) continue;
  if (p.seamBlend !== undefined && !(p.seamBlend > 0 && p.seamBlend <= 0.5)) {
    console.error(`✗ ${a.assetId}: seamBlend phải trong (0, 0.5], đang là ${p.seamBlend}`);
    failed++;
    continue;
  }
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
    keyOut(raw, p.keyTolerance ?? 38, p.minHolePx ?? 600, p.keyColor);
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
  if (p.seamBlend) {
    const raw = await toRaw(buf);
    const b = Math.round(raw.w * p.seamBlend);
    const nw = raw.w - b;
    const outBuf = Buffer.alloc(nw * raw.h * 4);
    for (let y = 0; y < raw.h; y++) {
      for (let x = 0; x < nw; x++) {
        const o = (y * nw + x) * 4;
        const i = (y * raw.w + x) * 4;
        if (x >= b) {
          raw.data.copy(outBuf, o, i, i + 4);
          continue;
        }
        const j = (y * raw.w + x + nw) * 4; // đoạn đuôi, trộn dần vào đầu
        // Trộn theo alpha (premultiplied): điểm trong suốt còn giữ màu nền đã tách không lem vào thành quầng.
        const k = x / b;
        const ai = raw.data[i + 3] * k;
        const aj = raw.data[j + 3] * (1 - k);
        const ao = ai + aj;
        for (let c = 0; c < 3; c++) outBuf[o + c] = ao > 0 ? Math.round((raw.data[i + c] * ai + raw.data[j + c] * aj) / ao) : 0;
        outBuf[o + 3] = Math.round(ao);
      }
    }
    buf = await fromRaw({data: outBuf, w: nw, h: raw.h});
    curW = nw;
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

  const {scene, layer} = target;
  layer.src = a.target;
  layer.status = 'final';
  if (p.fit) layer.aspect = Number((p.fit.height / p.fit.width).toFixed(4)); // khung theo ảnh, không ép 5:2
  else if (p.aspectFromImage) layer.aspect = Number((curH / curW).toFixed(4));
  // Nền painterly thật đã về: hiện layer đích và bỏ các lớp nền sinh bằng code mà manifest chỉ định (replacesLayers).
  if (p.replacesLayers) {
    const ids = p.replacesLayers;
    if (layer.opacity === 0) delete layer.opacity;
    const gone = scene.layers.filter((l: {id: string}) => ids.includes(l.id)).map((l: {id: string}) => l.id);
    scene.layers = scene.layers.filter((l: {id: string}) => !ids.includes(l.id));
    if (gone.length) console.log(`   bỏ layer: ${gone.join(', ')}`);
  }

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
if (failed) {
  console.error(`✗ ${failed} asset lỗi (xem ở trên); các asset khác đã ghi.`);
  process.exit(1);
}
