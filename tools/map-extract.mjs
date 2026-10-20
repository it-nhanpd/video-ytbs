// Trích polygon bản đồ cho layer `map`: (1) đế chế từ Cliopatria theo các năm cần, (2) nền đất liền Natural Earth.
// Dùng: node --max-old-space-size=4096 tools/map-extract.mjs --clio <polities_only.geojson> --name "Russian Empire" --years 1721,1860,1865,1868 --out <file.json> [--tol 0.08]
//       node tools/map-extract.mjs --land <ne_50m_land.geojson> --out <file.json> [--tol 0.12]
// Đầu ra: {source, license, attribution, modified, frames:[{key, year, from, to, areaKm2, rings:[[[lon,lat],…]]}]}
// Mọi vòng được "mở kinh tuyến 180°" rồi dịch +360 nếu nằm phía tây kinh tuyến -30°, để Âu–Á–Alaska liền một dải (lon -30..330).
// Giản lược Douglas–Peucker (độ). Dữ liệu Cliopatria: CC BY 4.0 (ghi công + nêu có giản lược); Natural Earth: public domain.
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const out = opt('out');
if (!out || (!opt('clio') && !opt('land'))) {
  console.error('Dùng: --clio <file> --name <tên> --years a,b,c --out <file> | --land <file> --out <file>  [--tol độ]');
  process.exit(1);
}

const unwrap = (ring) => {
  const r = [];
  let prev = null;
  for (const [x, y] of ring) {
    let lon = x;
    if (prev !== null) {
      while (lon - prev > 180) lon -= 360;
      while (lon - prev < -180) lon += 360;
    }
    r.push([lon, y]);
    prev = lon;
  }
  const mean = r.reduce((s, p) => s + p[0], 0) / r.length;
  const shift = mean < -30 ? 360 : mean > 330 ? -360 : 0;
  return shift ? r.map(([x, y]) => [x + shift, y]) : r;
};

const dp = (pts, tol) => {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0;
    let idx = -1;
    const [x1, y1] = pts[a];
    const [x2, y2] = pts[b];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1e-12;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
};

// Vòng kín có đầu = cuối nên chord bằng 0: tách đôi tại điểm giữa rồi giản lược từng nửa.
const dpRing = (pts, tol) => {
  const m = Math.floor(pts.length / 2);
  return [...dp(pts.slice(0, m + 1), tol), ...dp(pts.slice(m), tol).slice(1)];
};

const ringsOf = (geom, tol) => {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  const rings = [];
  for (const poly of polys) {
    for (const ring of poly) {
      const s = dpRing(unwrap(ring), tol);
      if (s.length >= 4) rings.push(s.map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100]));
    }
  }
  return rings;
};

const tol = Number(opt('tol', opt('land') ? '0.12' : '0.08'));
let result;
if (opt('clio')) {
  const name = opt('name');
  const years = opt('years').split(',').map(Number);
  const fc = JSON.parse(fs.readFileSync(opt('clio'), 'utf8'));
  const frames = years.map((year) => {
    const f = fc.features.find((q) => q.properties.Name === name && q.properties.FromYear <= year && year <= q.properties.ToYear);
    if (!f) throw new Error(`Không thấy "${name}" năm ${year}`);
    const p = f.properties;
    return {key: `y${year}`, year, from: p.FromYear, to: p.ToYear, areaKm2: Math.round(p.Area), rings: ringsOf(f.geometry, tol)};
  });
  result = {
    source: 'Cliopatria v0.1.3 (Seshat Global History Databank), polities only',
    license: 'CC BY 4.0',
    attribution: 'Cliopatria (Seshat Global History Databank), CC BY 4.0; polygon đã giản lược (Douglas–Peucker) và dịch kinh độ để bản đồ liền dải; có chỉnh sửa',
    modified: true,
    name,
    frames,
  };
} else {
  const fc = JSON.parse(fs.readFileSync(opt('land'), 'utf8'));
  const rings = fc.features.flatMap((f) => ringsOf(f.geometry, tol));
  result = {
    source: 'Natural Earth 1:50m land',
    license: 'Public domain',
    attribution: 'Natural Earth (public domain); đã giản lược và dịch kinh độ',
    modified: true,
    frames: [{key: 'land', year: 0, from: 0, to: 0, areaKm2: 0, rings}],
  };
}
fs.mkdirSync(new URL('.', 'file:///' + out.replace(/\\/g, '/')).pathname.replace(/^\/([A-Za-z]:)/, '$1'), {recursive: true});
fs.writeFileSync(out, JSON.stringify(result));
const pts = result.frames.reduce((s, f) => s + f.rings.reduce((t, r) => t + r.length, 0), 0);
console.log(`✓ ${out}: ${result.frames.length} frame, ${pts} điểm, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
