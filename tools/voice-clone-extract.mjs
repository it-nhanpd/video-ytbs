// Tool trích xuất đoạn giọng nói mẫu sạch từ video YouTube để phục vụ Voice Cloning (F5-TTS, GPT-SoVITS, etc.)
// Dùng: node tools/voice-clone-extract.mjs <youtube_url> [--name voice_name] [--start 00:01:00] [--duration 20]
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};

const url = args.find((a) => a.startsWith('http') || a.includes('youtu'));
if (!url) {
  console.error('Dùng: node tools/voice-clone-extract.mjs <youtube_url> [--name <tên_giọng>] [--start 00:00:10] [--duration 20]');
  process.exit(1);
}

const name = opt('name', 'voice_sample_' + Date.now());
const start = opt('start', '00:00:10');
const duration = Number(opt('duration', '20'));

const outDir = path.join(root, 'content/library/voice-clones', name);
fs.mkdirSync(outDir, {recursive: true});

console.log(`=== BẮT ĐẦU TRÍCH XUẤT AUDIO MẪU TỪ YOUTUBE ===`);
console.log(`URL: ${url}`);
console.log(`Khoảng thời gian: ${start} (độ dài: ${duration}s)`);
console.log(`Tên giọng / Thư mục: ${outDir}\n`);

// Tính thời điểm kết thúc
function toSeconds(timeStr) {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(timeStr);
}

const startSec = toSeconds(start);
const endSec = startSec + duration;

const rawFile = path.join(outDir, 'raw.mp3');
const wavClean = path.join(outDir, 'reference.wav');

// Bước 1: Dùng yt-dlp tải đoạn audio với js runtime
console.log('1. Đang tải đoạn âm thanh từ YouTube bằng yt-dlp...');
execFileSync('python', [
  '-m', 'yt_dlp',
  '--js-runtimes', 'node',
  '--download-sections', `*${startSec}-${endSec}`,
  '--force-keyframes-at-cuts',
  '-x',
  '--audio-format', 'mp3',
  '-o', rawFile,
  url,
], {stdio: 'inherit'});

// Bước 2: Chuẩn hóa audio thành chuẩn 24kHz Mono 16-bit PCM WAV (chuẩn đầu vào tốt nhất cho F5-TTS / GPT-SoVITS)
// Áp dụng bộ lọc khử ù, dọn dẹp tần số thấp dưới 80Hz và cắt tiếng chói gắt trên 10kHz
console.log('\n2. Chuẩn hóa & làm sạch dải âm bằng ffmpeg...');
execFileSync('ffmpeg', [
  '-y',
  '-i', rawFile,
  '-af', 'highpass=f=80,lowpass=f=10000,loudnorm=I=-16:TP=-1.5:LRA=10',
  '-ar', '24000',
  '-ac', '1',
  '-c:a', 'pcm_s16le',
  wavClean,
], {stdio: 'ignore'});

console.log(`\n=== THÀNH CÔNG! ===`);
console.log(`File mẫu sạch sẵn sàng cho Voice Clone:`);
console.log(`-> ${wavClean}`);
console.log(`\nBạn có thể nạp file reference.wav này vào F5-TTS / GPT-SoVITS để clone giọng 100% miễn phí.`);

