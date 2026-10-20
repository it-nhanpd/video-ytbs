import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Locale, Project} from '../engine/src/schema';
import {grades} from '../engine/src/theme';
import {moves} from '../engine/src/stick/moves';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = path.join(root, 'content');
const projectsDir = path.join(content, 'projects');

const only = process.argv[2];
const dirs = fs
  .readdirSync(projectsDir)
  .filter((d) => fs.statSync(path.join(projectsDir, d)).isDirectory())
  .filter((d) => !only || d === only || d.endsWith(only));

const errors: string[] = [];
const err = (proj: string, msg: string) => errors.push(`[${proj}] ${msg}`);
const readJson = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));

for (const dir of dirs) {
  const pdir = path.join(projectsDir, dir);
  const scenesPath = path.join(pdir, 'scenes.json');
  if (!fs.existsSync(scenesPath)) {
    err(dir, 'thiếu scenes.json');
    continue;
  }

  const parsed = Project.safeParse(readJson(scenesPath));
  if (!parsed.success) {
    for (const issue of parsed.error.issues) err(dir, `scenes.json › ${issue.path.join('.')}: ${issue.message}`);
    continue;
  }
  const project = parsed.data;

  // locale: mọi key được tham chiếu phải có trong mọi locale của dự án
  const localeDir = path.join(pdir, 'locales');
  const localeFiles = fs.existsSync(localeDir) ? fs.readdirSync(localeDir).filter((f) => f.endsWith('.json')) : [];
  if (!localeFiles.includes(`${project.locale}.json`)) err(dir, `thiếu locales/${project.locale}.json`);
  const locales = localeFiles.map((f) => {
    const p = Locale.safeParse(readJson(path.join(localeDir, f)));
    if (!p.success) err(dir, `locales/${f} không hợp lệ`);
    return {name: f, data: p.success ? p.data : {}};
  });

  const sceneIds = new Set<string>();
  const assetIds = new Set<string>();
  for (const scene of project.scenes) {
    if (sceneIds.has(scene.id)) err(dir, `trùng scene id "${scene.id}"`);
    sceneIds.add(scene.id);
    if (!grades[scene.grade]) err(dir, `${scene.id}: grade "${scene.grade}" không tồn tại trong theme.ts`);

    const layerIds = new Set<string>();
    for (const l of scene.layers) {
      if (layerIds.has(l.id)) err(dir, `${scene.id}: trùng layer id "${l.id}"`);
      layerIds.add(l.id);
      if (l.type === 'fighters') {
        const ids = new Set(l.fighters.map((f) => f.id));
        for (const f of l.fighters) for (const t of f.timeline) if (!moves[t.move]) err(dir, `${scene.id}/${l.id}: đòn "${t.move}" chưa có trong stick/moves.ts`);
        for (const fx of l.fx) if ('fighter' in fx && !ids.has(fx.fighter)) err(dir, `${scene.id}/${l.id}: fx tham chiếu võ sĩ "${fx.fighter}" không tồn tại`);
      }
      if (l.type === 'rig') {
        const ids = new Set(l.parts.map((q) => q.id));
        for (const q of l.parts) {
          if (!fs.existsSync(path.join(content, q.src))) err(dir, `${scene.id}/${l.id}: không thấy ảnh bộ phận ${q.src}`);
          if (q.parent && !ids.has(q.parent)) err(dir, `${scene.id}/${l.id}: bộ phận "${q.id}" có parent "${q.parent}" không tồn tại`);
        }
        if (l.parts.filter((q) => !q.parent).length !== 1) err(dir, `${scene.id}/${l.id}: rig cần đúng 1 bộ phận gốc (thân, không parent)`);
        if (l.weapon) {
          if (!fs.existsSync(path.join(content, l.weapon.src))) err(dir, `${scene.id}/${l.id}: không thấy ảnh vũ khí ${l.weapon.src}`);
          if (!ids.has(l.weapon.parent)) err(dir, `${scene.id}/${l.id}: weapon.parent "${l.weapon.parent}" không có trong parts (${[...ids].join(', ')})`);
        }
        for (const sw of l.swaps) {
          const src = scene.layers.find((x) => x.id === sw.fromLayer);
          if (!src || src.type !== 'rig') err(dir, `${scene.id}/${l.id}: swap tại ${sw.atSec}s lấy từ "${sw.fromLayer}" không có hoặc không phải layer rig`);
          else if (!src.parts.some((q) => q.id === sw.part)) err(dir, `${scene.id}/${l.id}: swap tại ${sw.atSec}s: "${sw.fromLayer}" không có bộ phận "${sw.part}"`);
          if (!ids.has(sw.part)) err(dir, `${scene.id}/${l.id}: swap tại ${sw.atSec}s: bộ phận "${sw.part}" không có trong rig này`);
        }
        for (const co of l.callouts) if (!ids.has(co.part) && !(co.part === 'weapon' && l.weapon)) err(dir, `${scene.id}/${l.id}: callout bộ phận "${co.part}" không tồn tại`);
        if (l.assetId) assetIds.add(l.assetId);
      }
      if (l.type === 'image') {
        if (!fs.existsSync(path.join(content, l.src))) err(dir, `${scene.id}/${l.id}: không thấy file ${l.src}`);
        for (const fr of l.frames ?? []) if (!fs.existsSync(path.join(content, fr))) err(dir, `${scene.id}/${l.id}: không thấy frame ${fr}`);
        if (l.assetId) assetIds.add(l.assetId);
        if (l.status === 'final' && l.src.endsWith('.svg')) err(dir, `${scene.id}/${l.id}: status final nhưng vẫn là SVG`);
      }
    }
    for (const t of scene.text) {
      for (const key of [t.key, t.subKey].filter((k): k is string => !!k)) {
        for (const loc of locales) {
          if (!(key in loc.data)) err(dir, `${scene.id}: key "${key}" thiếu trong locales/${loc.name}`);
        }
      }
    }
  }

  // manifest ↔ layer
  const manifestPath = path.join(pdir, 'prompts', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = readJson(manifestPath) as {assets: {assetId: string; scene: string; layer: string}[]};
    for (const a of manifest.assets) {
      if (!assetIds.has(a.assetId)) err(dir, `manifest: assetId "${a.assetId}" không có layer nào dùng`);
      const scene = project.scenes.find((s) => s.id === a.scene);
      if (!scene?.layers.some((l) => l.id === a.layer)) err(dir, `manifest: không thấy layer ${a.scene}/${a.layer}`);
    }
  }

  console.log(`✓ ${dir}: ${project.scenes.length} cảnh, ${locales.length} locale`);
}

if (errors.length) {
  console.error('\n' + errors.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
