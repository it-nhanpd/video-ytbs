// Gọi G-Labs Studio (Webhook API, chạy trên máy này) để tạo ảnh vào inbox/ của dự án.
// Dùng: node tools/glabs.mjs --prompt-file <file.txt> [--n 1] [--ref <ảnh>]... --name <tên-không-đuôi> --out <thư-mục>
//        [--aspect 16:9] [--model nano_banana_2.1|nano_banana_2_lite|nano_banana_2|nano_banana_pro] [--force]
//   - File prompt: mỗi prompt một đoạn, cách nhau một dòng trắng (cùng định dạng prompts/g-labs/*.txt); --n chọn đoạn (1 = đầu).
//   - --ref lặp được (tối đa 10); đường dẫn thật trên máy này, G-Labs đọc tại chỗ.
//   - Khóa API đọc từ biến môi trường GLABS_API_KEY hoặc file .env ở gốc repo (không in ra, không ghi vào repo).
//   - Không ghi đè file đã có trừ khi --force. Chỉ ghi vào --out.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const all = (k) => args.flatMap((a, i) => (a === `--${k}` ? [args[i + 1]] : []));

const promptFile = opt('prompt-file');
const name = opt('name');
const out = opt('out');
if (!promptFile || !name || !out) {
  console.error('Dùng: node tools/glabs.mjs --prompt-file <file.txt> [--n 1] [--ref <ảnh>]... --name <tên> --out <thư-mục> [--aspect 16:9] [--model nano_banana_2.1|nano_banana_2_lite|nano_banana_2|nano_banana_pro] [--force]');
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
const refs = all('ref').map((p) => {
  const abs = path.resolve(p);
  if (!fs.existsSync(abs)) {
    console.error(`Không thấy ảnh tham chiếu: ${abs}`);
    process.exit(1);
  }
  return {path: abs};
});

const health = await fetch(`${base}/api/health`).then((r) => r.json()).catch(() => null);
if (!health || health.status !== 'ok') {
  console.error(`Server G-Labs chưa chạy tại ${base} (mở app, tab Webhook, bấm Start).`);
  process.exit(1);
}

const headers = {'X-API-Key': key, 'Content-Type': 'application/json'};
const body = {prompt, model: opt('model', 'nano_banana_2.1'), aspect_ratio: opt('aspect', '16:9'), reference_images: refs};
const sub = await fetch(`${base}/api/image/generate`, {method: 'POST', headers, body: JSON.stringify(body)});
const subJson = await sub.json().catch(() => ({}));
if (sub.status !== 202) {
  console.error(`✗ Gửi yêu cầu thất bại (HTTP ${sub.status}): ${JSON.stringify(subJson)}`);
  process.exit(1);
}
const id = subJson.task_id;
console.log(`→ task ${id} (${body.model}, ${body.aspect_ratio}, ${refs.length} ảnh tham chiếu, prompt ${prompt.length} ký tự)`);

const deadline = Date.now() + 8 * 60 * 1000;
let st;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 4000));
  st = await fetch(`${base}/api/status/${id}`, {headers}).then((r) => r.json()).catch(() => null);
  if (st?.status === 'completed' || st?.status === 'failed') break;
}
if (st?.status !== 'completed') {
  console.error(`✗ task ${id}: ${st?.status ?? 'không rõ'} ${st?.error ?? ''} ${st?.error_detail ?? ''}`.trim());
  process.exit(1);
}

fs.mkdirSync(out, {recursive: true});
const url = st.results[0];
const ext = (path.extname(new URL(url).pathname) || '.png').toLowerCase();
const dest = path.join(out, name + ext);
if (fs.existsSync(dest) && !args.includes('--force')) {
  console.error(`✗ ${dest} đã có; thêm --force để ghi đè. Ảnh vẫn nằm ở ${url}`);
  process.exit(1);
}
fs.writeFileSync(dest, Buffer.from(await (await fetch(url)).arrayBuffer()));
console.log(`✓ ${dest} (${fs.statSync(dest).size} byte)`);
