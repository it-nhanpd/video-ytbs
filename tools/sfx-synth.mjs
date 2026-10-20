// Tổng hợp hiệu ứng âm thanh (SFX) bằng code, không dùng mẫu có bản quyền, cho template vox (`v.sfx`).
// Dùng: node tools/sfx-synth.mjs --out <thư-mục> [--only click,ring] [--seed 3]
// Ghi <thư-mục>/<tên>.mp3. Danh sách:
//   click   cạch nút máy ghi âm cuộn       ring    chuông điện thoại quay số (2 hồi)
//   heart   nhịp tim 2 nhịp                stinger nốt nhấn trầm khi lộ chứng cứ (boom + vang)
//   whoosh  lướt giấy/chuyển cảnh          paper   sột soạt lật giấy
//   type    gõ máy chữ 6 phím              riser   dâng căng 2,5 s trước cú cắt
//   thud    tiếng đất/gỗ nặng              pin     ghim bấm lên bảng
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const outDir = opt('out');
if (!outDir) {
  console.error('Dùng: node tools/sfx-synth.mjs --out <thư-mục> [--only click,ring] [--seed 3]');
  process.exit(1);
}
const only = opt('only')?.split(',');
const SR = 44100;
let seed = Number(opt('seed', '3'));
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const noise = () => rnd() * 2 - 1;

// Bộ đệm mono + các hàm dựng.
const buf = (sec) => new Float32Array(Math.round(sec * SR));
const tone = (b, t0, len, f, amp, decay, f2 = f, attack = 0.002) => {
  const i0 = Math.round(t0 * SR);
  let ph = 0;
  for (let k = 0; k < len * SR && i0 + k < b.length; k++) {
    const u = k / SR;
    const fr = f + (f2 - f) * (u / len);
    ph += (2 * Math.PI * fr) / SR;
    b[i0 + k] += amp * Math.exp(-u * decay) * Math.min(1, u / attack) * Math.sin(ph);
  }
};
// Noise qua lọc thông thấp một cực (lp: 0..1, nhỏ = trầm), đường bao env(u) do người gọi định.
const burst = (b, t0, len, amp, lp, env) => {
  const i0 = Math.round(t0 * SR);
  let y = 0;
  for (let k = 0; k < len * SR && i0 + k < b.length; k++) {
    y += lp * (noise() - y);
    b[i0 + k] += amp * env(k / SR) * y;
  }
};
// Highpass thô (hiệu hai mẫu) cho tiếng gõ sắc.
const click = (b, t0, amp, decay = 300) => {
  const i0 = Math.round(t0 * SR);
  let prev = 0;
  for (let k = 0; k < 0.04 * SR && i0 + k < b.length; k++) {
    const n = noise();
    b[i0 + k] += amp * Math.exp(-(k / SR) * decay) * (n - prev);
    prev = n;
  }
};
// Vang đơn giản: vài tiếng dội trễ, suy giảm.
const reverb = (b, mix = 0.3) => {
  const taps = [0.031, 0.047, 0.071, 0.113, 0.167, 0.233];
  const out = Float32Array.from(b);
  taps.forEach((d, j) => {
    const n = Math.round(d * SR);
    const g = mix * Math.pow(0.72, j);
    for (let i = n; i < b.length; i++) out[i] += g * out[i - n];
  });
  return out;
};

const S = {
  click() {
    const b = buf(0.5);
    click(b, 0, 0.9, 220);
    tone(b, 0, 0.12, 180, 0.35, 40);
    click(b, 0.07, 0.5, 400);
    return b;
  },
  ring() {
    // Chuông cơ: hai chuông ~ 1,1 kHz & 1,45 kHz bị búa gõ 25 lần/giây; 2 hồi 1 s cách 2 s.
    const b = buf(4.4);
    for (const r0 of [0, 3]) {
      for (let k = 0; k < 25; k++) {
        const t = r0 + k / 25;
        tone(b, t, 0.25, k % 2 ? 1100 : 1450, 0.18, 9);
        tone(b, t, 0.25, k % 2 ? 2210 : 2900, 0.05, 14);
      }
    }
    return reverb(b, 0.18);
  },
  heart() {
    const b = buf(1.6);
    for (const t0 of [0, 0.82]) {
      tone(b, t0, 0.3, 75, 0.9, 14, 42);
      tone(b, t0 + 0.27, 0.3, 65, 0.6, 16, 40);
    }
    return b;
  },
  stinger() {
    const b = buf(4);
    tone(b, 0, 3.5, 55, 0.85, 1.4, 38);
    tone(b, 0, 3.5, 110, 0.25, 2.2, 82);
    burst(b, 0, 1.2, 0.5, 0.08, (u) => Math.exp(-u * 4));
    // Cụm nghịch cao mờ dần
    for (const f of [622, 659, 932]) tone(b, 0.02, 3.5, f, 0.05, 1.3, f * 0.99, 0.05);
    return reverb(b, 0.35);
  },
  whoosh() {
    const b = buf(0.9);
    burst(b, 0, 0.9, 0.9, 0.12, (u) => Math.sin(Math.PI * Math.min(1, u / 0.9)) ** 2);
    return b;
  },
  paper() {
    const b = buf(1.1);
    for (let k = 0; k < 14; k++) {
      const t = 0.05 + rnd() * 0.8;
      burst(b, t, 0.09, 0.35 + rnd() * 0.3, 0.55, (u) => Math.exp(-u * 40));
    }
    return b;
  },
  type() {
    const b = buf(1.6);
    for (let k = 0; k < 6; k++) {
      const t = 0.05 + k * 0.17 + rnd() * 0.06;
      click(b, t, 0.8, 260);
      tone(b, t, 0.05, 900 + rnd() * 300, 0.12, 80);
    }
    tone(b, 1.2, 0.4, 2300, 0.08, 6); // chuông hết dòng
    return b;
  },
  riser() {
    const b = buf(2.6);
    burst(b, 0, 2.5, 0.6, 0.05, (u) => (u / 2.5) ** 2.2);
    tone(b, 0, 2.5, 80, 0.3, 0, 240, 1.5);
    return b;
  },
  thud() {
    const b = buf(1);
    tone(b, 0, 0.6, 70, 0.9, 9, 45);
    burst(b, 0, 0.4, 0.6, 0.06, (u) => Math.exp(-u * 12));
    return b;
  },
  pin() {
    const b = buf(0.4);
    click(b, 0, 0.7, 500);
    tone(b, 0, 0.08, 1400, 0.1, 60);
    return b;
  },
};

fs.mkdirSync(outDir, {recursive: true});
for (const [name, make] of Object.entries(S)) {
  if (only && !only.includes(name)) continue;
  const b = make();
  // Chuẩn hóa đỉnh -3 dBFS, vào/ra 5 ms, ghi WAV 16-bit mono rồi ffmpeg → mp3.
  let peak = 1e-9;
  for (const v of b) peak = Math.max(peak, Math.abs(v));
  const g = 0.708 / peak;
  const N = b.length;
  const w = Buffer.alloc(44 + N * 2);
  w.write('RIFF', 0);
  w.writeUInt32LE(36 + N * 2, 4);
  w.write('WAVEfmt ', 8);
  w.writeUInt32LE(16, 16);
  w.writeUInt16LE(1, 20);
  w.writeUInt16LE(1, 22);
  w.writeUInt32LE(SR, 24);
  w.writeUInt32LE(SR * 2, 28);
  w.writeUInt16LE(2, 32);
  w.writeUInt16LE(16, 34);
  w.write('data', 36);
  w.writeUInt32LE(N * 2, 40);
  for (let i = 0; i < N; i++) {
    const f = Math.min(1, i / (SR * 0.005), (N - i) / (SR * 0.005));
    w.writeInt16LE(Math.round(Math.max(-1, Math.min(1, b[i] * g * f)) * 32767), 44 + i * 2);
  }
  const wav = path.join(outDir, `${name}.tmp.wav`);
  fs.writeFileSync(wav, w);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '160k', path.join(outDir, `${name}.mp3`)]);
  fs.unlinkSync(wav);
  console.log(`✓ ${name}.mp3 (${(N / SR).toFixed(2)} s)`);
}
