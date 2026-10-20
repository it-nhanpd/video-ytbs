// Tạo rig mẫu bằng hình hộp (không cần ảnh AI) để kiểm tra engine rig + chu kỳ đi.
// Dùng: node tools/synth-rig.mjs  → ghi content/projects/_rig-demo/{assets,scenes.json,locales/vi.json}
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const dir = path.join(root, 'content', 'projects', '_rig-demo');
fs.mkdirSync(path.join(dir, 'assets'), {recursive: true});
fs.mkdirSync(path.join(dir, 'locales'), {recursive: true});

const near = '#c9b27a';
const far = '#8f7d52';
const skin = '#e0b48f';
const body = '#4a5d73';
// w, h (px), fill, hình dạng
const S = {
  head: {w: 110, h: 140, fill: skin, round: 50},
  torso: {w: 170, h: 300, fill: body, round: 28},
  upperArmN: {w: 46, h: 150, fill: near, round: 22},
  foreArmN: {w: 42, h: 140, fill: skin, round: 20},
  upperArmF: {w: 46, h: 150, fill: far, round: 22},
  foreArmF: {w: 42, h: 140, fill: '#b08e70', round: 20},
  thighN: {w: 82, h: 210, fill: near, round: 36},
  shinN: {w: 70, h: 200, fill: '#6f7e55', round: 30},
  footN: {w: 150, h: 54, fill: '#2a2018', round: 22},
  thighF: {w: 82, h: 210, fill: far, round: 36},
  shinF: {w: 70, h: 200, fill: '#55603f', round: 30},
  footF: {w: 150, h: 54, fill: '#1c150f', round: 22},
};
for (const [id, s] of Object.entries(S)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}"><rect x="3" y="3" width="${s.w - 6}" height="${s.h - 6}" rx="${s.round}" fill="${s.fill}" stroke="#111" stroke-width="6"/></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir, 'assets', `${id}.png`));
}

const rel = 'projects/_rig-demo/assets/';
const P = (id, parent, pivot, attach, z, joint) => ({id, src: `${rel}${id}.png`, ...(parent ? {parent} : {}), w: S[id].w, h: S[id].h, pivot, ...(attach ? {attach} : {}), z, joint: joint ?? id});
const parts = [
  P('torso', null, [0.5, 0.97], null, 10),
  P('head', 'torso', [0.5, 0.92], [0.5, 0.0], 11),
  P('upperArmF', 'torso', [0.5, 0.08], [0.5, 0.1], 1),
  P('foreArmF', 'upperArmF', [0.5, 0.06], [0.5, 0.92], 2),
  P('thighF', 'torso', [0.5, 0.06], [0.5, 0.97], 3),
  P('shinF', 'thighF', [0.5, 0.05], [0.5, 0.94], 4),
  P('footF', 'shinF', [0.25, 0.15], [0.5, 0.95], 5),
  P('thighN', 'torso', [0.5, 0.06], [0.5, 0.97], 12),
  P('shinN', 'thighN', [0.5, 0.05], [0.5, 0.94], 13),
  P('footN', 'shinN', [0.25, 0.15], [0.5, 0.95], 14),
  P('upperArmN', 'torso', [0.5, 0.08], [0.5, 0.1], 15),
  P('foreArmN', 'upperArmN', [0.5, 0.06], [0.5, 0.92], 16),
];

const rig = (id, x, phase, assetId) => ({id, type: 'rig', ...(assetId ? {assetId} : {}), z: 3, status: 'placeholder', x: [x, x], groundY: 0.82, height: 0.6, ease: 'linear', cycleSec: 1, phase, moving: true, parts});
const scenes = {
  project: 'rig-demo',
  locale: 'vi',
  fps: 24,
  width: 1920,
  height: 1080,
  scenes: [
    {
      id: 'walk',
      durationSec: 6,
      template: 'MultiplaneScene',
      grade: 'misty_green',
      letterbox: 2.35,
      focusZ: 3,
      camera: {x: [0, 0], zoom: [1, 1], ease: 'linear'},
      text: [],
      walkSpeed: 0,
      layers: [
        {id: 'sky', type: 'sky', z: 0, preset: 'misty_green'},
        rig('a', 0.38, 0, 'rigtest'),
        rig('b', 0.62, 0.37, 'rig_prussia_1871'),
      ],
    },
  ],
};
fs.writeFileSync(path.join(dir, 'scenes.json'), JSON.stringify(scenes, null, 2));
fs.writeFileSync(path.join(dir, 'locales', 'vi.json'), '{}\n');
console.log('✓ rig mẫu →', dir);
