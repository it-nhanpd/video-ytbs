// Gọi G-Labs Studio (Webhook API, chạy trên máy này) để tạo CLIP ngắn vào inbox/ của dự án.
// Dùng: node tools/glabs-video.mjs --prompt-file <file.txt> [--n 1] [--start <ảnh>] [--end <ảnh>] --name <tên-không-đuôi> --out <thư-mục>
//        [--model omni_flash|veo_31_fast|veo_31_lite|veo_31_quality] [--res 360p|720p|1080p] [--len 4|6|8|10] [--aspect 16:9] [--force]
//   - Không có --start: text_to_video. Có --start: start_image. Có cả --start và --end: start_end_image.
//   - Mặc định rẻ nhất: omni_flash, 360p (nháp). 4K và veo_31_lite_relaxed cần tài khoản ULTRA nên không hỗ trợ ở đây.
//   - Veo chỉ cho độ dài 8 s với tài khoản không ULTRA; omni_flash cho 4/6/8/10 s.
//   - File prompt: mỗi prompt một đoạn, cách nhau một dòng trắng (như tools/glabs.mjs).
//   - Mỗi lần chạy = 1 clip = tốn credit. Khóa API đọc từ GLABS_API_KEY hoặc .env ở gốc repo (không in ra).
//   - Không ghi đè file đã có trừ khi --force. Chỉ ghi vào --out. Mỗi độ phân giải ra một file: <name>_<res>.mp4.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};

const promptFile = opt('prompt-file');
const name = opt('name');
const out = opt('out');
if (!promptFile || !name || !out) {
  console.error('Dùng: node tools/glabs-video.mjs --prompt-file <file.txt> [--n 1] [--start <ảnh>] [--end <ảnh>] --name <tên> --out <thư-mục> [--model omni_flash|veo_31_fast|veo_31_lite|veo_31_quality] [--res 360p|720p|1080p] [--len 4|6|8|10] [--aspect 16:9] [--force]');
  process.exit(1);
}

const model = opt('model', 'omni_flash');
const allowedModels = ['omni_flash', 'veo_31_fast', 'veo_31_lite', 'veo_31_quality'];
if (!allowedModels.includes(model)) {
  console.error(`Model "${model}" không được hỗ trợ (chỉ: ${allowedModels.join(', ')}).`);
  process.exit(1);
}
const res = opt('res', model === 'omni_flash' ? '360p' : '720p');
if (!['360p', '720p', '1080p'].includes(res) || (res === '360p' && model !== 'omni_flash')) {
  console.error(`Độ phân giải "${res}" không hợp lệ với ${model} (360p chỉ omni_flash; 4K bị chặn vì cần ULTRA).`);
  process.exit(1);
}
const len = Number(opt('len', '6'));
if (![4, 6, 8, 10].includes(len) || (len === 10 && model !== 'omni_flash')) {
  console.error(`Độ dài ${len} s không hợp lệ với ${model}.`);
  process.exit(1);
}

let key = process.env.GLABS_API_KEY;
if (!key && fs.existsSync(path.join(root, '.env'))) {
  const m = fs.readFileSync(path.join(root, '.env'), 'utf8').match(/^\s*GLABS_API_KEY\s*=\s*(.+?)\s*$/m);
  key = m?.[1]?.replace(/^["']|["']$/g, '');
}
if (!key) {
  console.error('Thiếu GLABS_API_KEY (biến môi trường hoặc .env ở gốc repo).');
  process.exit(1);
}
const base = (process.env.GLABS_URL ?? 'http://127.0.0.1:8765').replace(/\/$/, '');

const prompts = fs.readFileSync(promptFile, 'utf8').split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean);
const n = Number(opt('n', '1'));
const prompt = prompts[n - 1];
if (!prompt) {
  console.error(`File ${promptFile} chỉ có ${prompts.length} prompt, không có số ${n}.`);
  process.exit(1);
}

const imgRef = (flag) => {
  const p = opt(flag);
  if (!p) return null;
  const abs = path.resolve(p);
  if (!fs.existsSync(abs)) {
    console.error(`Không thấy ảnh --${flag}: ${abs}`);
    process.exit(1);
  }
  return {path: abs};
};
const start = imgRef('start');
const end = imgRef('end');
if (end && !start) {
  console.error('--end cần đi kèm --start.');
  process.exit(1);
}
const mode = start && end ? 'start_end_image' : start ? 'start_image' : 'text_to_video';
const refs = [start, end].filter(Boolean);

const health = await fetch(`${base}/api/health`).then((r) => r.json()).catch(() => null);
if (!health || health.status !== 'ok') {
  console.error(`Server G-Labs chưa chạy tại ${base} (mở app, tab Webhook, bấm Start).`);
  process.exit(1);
}

const headers = {'X-API-Key': key, 'Content-Type': 'application/json'};
const body = {prompt, model, aspect_ratio: opt('aspect', '16:9'), mode, reference_images: refs, resolution: [res], video_length: len};
const sub = await fetch(`${base}/api/video/generate`, {method: 'POST', headers, body: JSON.stringify(body)});
const subJson = await sub.json().catch(() => ({}));
if (sub.status !== 202) {
  console.error(`✗ Gửi yêu cầu thất bại (HTTP ${sub.status}): ${JSON.stringify(subJson)}`);
  process.exit(1);
}
const id = subJson.task_id;
console.log(`→ task ${id} (${model}, ${mode}, ${res}, ${len}s, ${body.aspect_ratio}, prompt ${prompt.length} ký tự)`);

// Clip có thể mất vài phút; chờ tối đa 15 phút.
const deadline = Date.now() + 15 * 60 * 1000;
let st;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 5000));
  st = await fetch(`${base}/api/status/${id}`, {headers}).then((r) => r.json()).catch(() => null);
  if (st?.status === 'completed' || st?.status === 'failed') break;
}
if (st?.status !== 'completed') {
  console.error(`✗ task ${id}: ${st?.status ?? 'không rõ'} ${st?.error ?? ''} ${st?.error_detail ?? ''}`.trim());
  process.exit(1);
}

fs.mkdirSync(out, {recursive: true});
let failed = false;
for (const [i, url] of st.results.entries()) {
  const ext = (path.extname(new URL(url).pathname) || '.mp4').toLowerCase();
  const dest = path.join(out, `${name}_${res}${st.results.length > 1 ? `_${i + 1}` : ''}${ext}`);
  if (fs.existsSync(dest) && !args.includes('--force')) {
    console.error(`✗ ${dest} đã có; thêm --force để ghi đè. Clip vẫn nằm ở ${url}`);
    failed = true;
    continue;
  }
  fs.writeFileSync(dest, Buffer.from(await (await fetch(url)).arrayBuffer()));
  console.log(`✓ ${dest} (${fs.statSync(dest).size} byte)`);
}
process.exit(failed ? 1 : 0);
