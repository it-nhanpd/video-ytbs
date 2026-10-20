// Tổng hợp nhạc nền ambient trầm (tự sáng tác bằng code, không dùng mẫu/nhạc có bản quyền) cho video tài liệu.
// Dùng: node tools/music-synth.mjs --out <file.mp3> [--sec 120] [--seed 7] [--key 50] [--mood calm]
//   --key: nốt gốc MIDI (50 = D3). Gồm: drone trầm, pad hợp âm thứ đổi mỗi 8 s, nốt gảy thưa, gió (noise lọc).
//   --mood (nhạc nền cho video điều tra, đổi theo chương qua `cues` của vox.json):
//     calm        như cũ (mặc định).
//     investigate nhịp tích tắc nhẹ + nốt rải hợp âm thứ đều đặn: cảm giác lần theo manh mối.
//     tension     cụm hợp âm nghịch (quãng 2 thứ), nhịp tim chậm, tiếng "thủy tinh" cao thưa, gió dâng: hồi hộp, không hù dọa.
//     grief       pad chậm (12 s/hợp âm), nốt thưa: đoạn tưởng niệm.
// Ghi WAV tạm cạnh file đích rồi ffmpeg → mp3 (-16 LUFS gần đúng do người dùng chỉnh volume trong VoxVideo).
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const out = opt('out');
if (!out) {
  console.error('Dùng: node tools/music-synth.mjs --out <file.mp3> [--sec 120] [--seed 7] [--key 50]');
  process.exit(1);
}
const SR = 44100;
const sec = Number(opt('sec', '120'));
const key = Number(opt('key', '50'));
const mood = opt('mood', 'calm');
let seed = Number(opt('seed', '7'));
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const N = Math.round(sec * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const add = (i, v, pan = 0) => {
  L[i] += v * (1 - pan) * 0.5 + v * 0.5;
  R[i] += v * (1 + pan) * 0.5 + v * 0.5;
};

// Tiến trình hợp âm (bậc so với gốc, giọng thứ): i – VI – III – VII, mỗi hợp âm 8 s.
const chords =
  mood === 'tension'
    ? [
        [0, 1, 7],
        [0, 1, 6],
        [-1, 0, 6],
        [0, 3, 4],
      ]
    : [
        [0, 3, 7],
        [-4, 0, 3],
        [3, 7, 10],
        [-2, 2, 5],
      ];
const CH = mood === 'tension' ? 10 : mood === 'grief' ? 12 : 8;
const padAmp = mood === 'tension' ? 0.018 : mood === 'grief' ? 0.026 : 0.022;
const env = (t, a, len) => Math.min(1, t / a) * Math.min(1, (len - t) / a);

for (let i = 0; i < N; i++) {
  const t = i / SR;
  // Drone: gốc + quãng 5 thấp, rung chậm.
  const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.05 * t);
  add(i, 0.09 * lfo * Math.sin(2 * Math.PI * hz(key - 12) * t) + 0.05 * Math.sin(2 * Math.PI * hz(key - 5) * t));
  // Pad: mỗi nốt 2 dao động lệch nhẹ (chorus), vào/ra 2 s.
  const ci = Math.floor(t / CH);
  const ct = t - ci * CH;
  const e = env(ct, 2, CH);
  for (const [n, d] of chords[ci % chords.length].map((d, j) => [j, d])) {
    const f = hz(key + d);
    const v = (padAmp * e * (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * 1.003 * t + n))) / 2;
    add(i, v, (n - 1) * 0.4);
  }
}

// Nốt gảy (sine + bội âm, tắt dần) trong hợp âm đang chạy. calm/grief: thưa; investigate: rải đều; tension: "thủy tinh" cao, vào chậm.
const pluck = (t, f, amp, decay, pan, attack = 0.005) => {
  const i0 = Math.round(t * SR);
  for (let k = 0; k < SR * 3 && i0 + k < N; k++) {
    const u = k / SR;
    const v = amp * Math.exp(-u * decay) * Math.min(1, u / attack) * (Math.sin(2 * Math.PI * f * u) + 0.3 * Math.sin(4 * Math.PI * f * u));
    add(i0 + k, v, pan);
  }
};
if (mood === 'investigate') {
  let j = 0;
  for (let t = 1.5; t < sec - 3; t += 0.75, j++) {
    if (rnd() < 0.18) continue; // chừa nhịp trống cho đỡ máy móc
    const c = chords[Math.floor(t / CH) % chords.length];
    pluck(t, hz(key + 12 + c[j % 3] + (j % 6 >= 3 ? 12 : 0)), 0.03, 2.4, (j % 2 ? 0.4 : -0.4));
  }
} else if (mood === 'tension') {
  for (let t = 3; t < sec - 4; t += 4 + rnd() * 4) {
    const c = chords[Math.floor(t / CH) % chords.length];
    pluck(t, hz(key + 24 + c[Math.floor(rnd() * 3)]), 0.025, 0.9, rnd() * 1.4 - 0.7, 0.4);
  }
} else {
  const gap = mood === 'grief' ? 3 : 2;
  for (let t = 1.5; t < sec - 3; t += gap + rnd() * 3) {
    const c = chords[Math.floor(t / CH) % chords.length];
    const f = hz(key + 12 + c[Math.floor(rnd() * 3)]);
    pluck(t, f, 0.05, 1.4, rnd() * 1.2 - 0.6);
  }
}

// Nhịp tim (tension): "thình-thịch" sine trầm ~52 bpm.
if (mood === 'tension') {
  for (let t = 2; t < sec - 2; t += 60 / 52) {
    for (const [dt, a] of [
      [0, 0.32],
      [0.28, 0.2],
    ]) {
      const i0 = Math.round((t + dt) * SR);
      for (let k = 0; k < SR * 0.35 && i0 + k < N; k++) {
        const u = k / SR;
        add(i0 + k, a * Math.exp(-u * 14) * Math.min(1, u * 300) * Math.sin(2 * Math.PI * (48 + 30 * Math.exp(-u * 30)) * u));
      }
    }
  }
}

// Tích tắc (investigate): cú gõ noise rất ngắn, 96 bpm, trái/phải xen kẽ.
if (mood === 'investigate') {
  let j = 0;
  for (let t = 1; t < sec - 2; t += 60 / 96, j++) {
    const i0 = Math.round(t * SR);
    let prev = 0;
    for (let k = 0; k < SR * 0.03 && i0 + k < N; k++) {
      const n = rnd() * 2 - 1;
      add(i0 + k, 0.05 * Math.exp(-(k / SR) * 160) * (n - prev), j % 2 ? 0.5 : -0.5); // hiệu hai mẫu ≈ lọc thông cao
      prev = n;
    }
  }
}

// Gió: noise trắng qua lọc thông thấp một cực, biên độ dâng hạ chậm.
let lp = 0;
for (let i = 0; i < N; i++) {
  lp += 0.02 * (rnd() * 2 - 1 - lp);
  const w = mood === 'tension' ? Math.pow(((i / SR) % 18) / 18, 3) * 1.6 + 0.2 : 0.5 + 0.5 * Math.sin((2 * Math.PI * i) / SR / 11);
  add(i, lp * 0.35 * w, Math.sin(i / SR / 3) * 0.5);
}

// Vào/ra 3 s, chuẩn hóa đỉnh -3 dBFS, ghi WAV 16-bit.
let peak = 0;
for (let i = 0; i < N; i++) {
  const g = Math.min(1, i / SR / 3, (N - i) / SR / 3);
  L[i] *= g;
  R[i] *= g;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const k = 0.708 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write('WAVEfmt ', 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(L[i] * k * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(R[i] * k * 32767), 46 + i * 4);
}
const wav = out.replace(/\.mp3$/i, '') + '.tmp.wav';
fs.writeFileSync(wav, buf);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '160k', out]);
fs.unlinkSync(wav);
console.log(`✓ ${out}: ${sec}s, gốc MIDI ${key}, seed ${opt('seed', '7')}, mood ${mood}`);
