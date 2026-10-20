// Trích bản đồ khu vực từ Natural Earth (public domain) thành path SVG đã chiếu, cho kind `geomap` của template vox.
// Dùng: node tools/geo-map-extract.mjs --countries <ne_10m_admin_0_countries.geojson> --admin1 <ne_10m_admin_1_states_provinces.geojson>
//         --rivers <ne_10m_rivers_lake_centerlines.geojson> --admin1-of VNM --bbox 96,6,114,25 [--detail 107.5,14.5,109.5,16]
//         [--tol 0.02] [--tol-detail 0.002] [--points <points.json>] [--width 1000] --out <out.json>
//   points.json: [{"id": "...", "lon": 108.87, "lat": 15.18, ...thuộc tính khác giữ nguyên}]
// Chiếu phẳng đều (equirectangular) có hệ số cos(vĩ độ giữa): đủ chính xác cho vùng cỡ Đông Dương.
// Vòng nằm trong vùng --detail giản lược mịn hơn (để phóng tới cấp tỉnh/xã). Vòng nằm ngoài hẳn --bbox bị bỏ.
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const out = opt('out');
const bboxArg = opt('bbox');
if (!out || !bboxArg || !opt('countries')) {
  console.error('Dùng: --countries <f> --bbox lon0,lat0,lon1,lat1 --out <f> [--admin1 <f> --admin1-of VNM] [--rivers <f>] [--detail ...] [--points <f>]');
  process.exit(1);
}
const nums = (s) => s.split(',').map(Number);
const [lon0, lat0, lon1, lat1] = nums(bboxArg);
const detail = opt('detail') ? nums(opt('detail')) : null;
const tol = Number(opt('tol', '0.02'));
const tolDetail = Number(opt('tol-detail', '0.002'));
const W = Number(opt('width', '1000'));
const cosc = Math.cos((((lat0 + lat1) / 2) * Math.PI) / 180);
const S = W / ((lon1 - lon0) * cosc); // px trên 1 độ vĩ
const H = (lat1 - lat0) * S;
const proj = ([lo, la]) => [(lo - lon0) * cosc * S, (lat1 - la) * S];

const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const boxOf = (ring) => {
  let [a, b, c, d] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [x, y] of ring) [a, b, c, d] = [Math.min(a, x), Math.min(b, y), Math.max(c, x), Math.max(d, y)];
  return [a, b, c, d];
};
const hits = (bx, [x0, y0, x1, y1]) => !(bx[2] < x0 || bx[0] > x1 || bx[3] < y0 || bx[1] > y1);

// Douglas–Peucker (độ).
const dp = (pts, eps) => {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    const [ax, ay] = pts[i];
    const [bx, by] = pts[j];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    let best = -1;
    let at = -1;
    for (let k = i + 1; k < j; k++) {
      // Vòng kín (điểm đầu = cuối): đo khoảng cách tới điểm đầu.
      const d = len < 1e-12 ? Math.hypot(pts[k][0] - ax, pts[k][1] - ay) : Math.abs(dy * pts[k][0] - dx * pts[k][1] + bx * ay - by * ax) / len;
      if (d > best) [best, at] = [d, k];
    }
    if (best > eps) {
      keep[at] = 1;
      stack.push([i, at], [at, j]);
    }
  }
  return pts.filter((_, k) => keep[k]);
};

const r1 = (n) => Math.round(n * 10) / 10;
const toPath = (lines, closed) =>
  lines
    .map((l) => 'M' + l.map((p) => proj(p).map(r1).join(',')).join('L') + (closed ? 'Z' : ''))
    .join('');

// Giữ vòng/đường giao bbox; giản lược theo vùng.
const prep = (lines, closed) =>
  lines
    .filter((l) => hits(boxOf(l), [lon0, lat0, lon1, lat1]))
    .map((l) => dp(l, detail && hits(boxOf(l), detail) ? tolDetail : tol))
    .filter((l) => l.length >= (closed ? 4 : 2));

const ringsOf = (g) => (g.type === 'Polygon' ? g.coordinates : g.type === 'MultiPolygon' ? g.coordinates.flat() : []);
const linesOf = (g) => (g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []);

const countries = read(opt('countries'))
  .features.map((f) => ({id: f.properties.ADM0_A3, name: f.properties.NAME, d: toPath(prep(ringsOf(f.geometry), true), true)}))
  .filter((c) => c.d);

const admin1 = opt('admin1')
  ? read(opt('admin1'))
      .features.filter((f) => !opt('admin1-of') || f.properties.adm0_a3 === opt('admin1-of'))
      .map((f) => ({id: f.properties.iso_3166_2 || f.properties.adm1_code, name: f.properties.name, d: toPath(prep(ringsOf(f.geometry), true), true)}))
      .filter((a) => a.d)
  : [];

const rivers = opt('rivers')
  ? read(opt('rivers'))
      .features.map((f) => ({name: f.properties.name ?? '', rank: f.properties.scalerank, d: toPath(prep(linesOf(f.geometry), false), false)}))
      .filter((r) => r.d)
  : [];

const points = opt('points')
  ? read(opt('points')).map((p) => {
      const [x, y] = proj([p.lon, p.lat]);
      return {...p, x: r1(x), y: r1(y)};
    })
  : [];

const data = {
  source: 'Natural Earth 1:10m (public domain), giản lược Douglas–Peucker',
  bbox: [lon0, lat0, lon1, lat1],
  width: W,
  height: Math.round(H),
  scale: S,
  cosc,
  countries,
  admin1,
  rivers,
  points,
};
fs.writeFileSync(out, JSON.stringify(data));
console.log(`✓ ${out}: ${countries.length} nước, ${admin1.length} tỉnh, ${rivers.length} sông, ${points.length} điểm, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
