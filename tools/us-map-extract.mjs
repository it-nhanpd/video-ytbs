// Trích 48 bang lục địa Mỹ từ Natural Earth (public domain) thành path SVG đã chiếu (Albers đồng diện tích, chuẩn USGS),
// kèm tọa độ điểm đã chiếu, cho component VoxUsMap.
// Dùng: node tools/us-map-extract.mjs <ne_50m_admin_1_states_provinces_lakes.geojson> <points.json> <out.json>
//   points.json: [{"id": "...", "lat": 41.8, "lon": -87.6, ...thuộc tính khác giữ nguyên}]
import fs from 'node:fs';

const [src, pointsPath, out] = process.argv.slice(2);
if (!src || !pointsPath || !out) {
  console.error('Dùng: node tools/us-map-extract.mjs <states.geojson> <points.json> <out.json>');
  process.exit(1);
}
const rad = (d) => (d * Math.PI) / 180;
// Albers equal-area conic: vĩ tuyến chuẩn 29,5° và 45,5°, gốc 37,5°N 96°W.
const [p1, p2, p0, l0] = [rad(29.5), rad(45.5), rad(37.5), rad(-96)];
const n = (Math.sin(p1) + Math.sin(p2)) / 2;
const C = Math.cos(p1) ** 2 + 2 * n * Math.sin(p1);
const rho0 = Math.sqrt(C - 2 * n * Math.sin(p0)) / n;
const albers = (lon, lat) => {
  const rho = Math.sqrt(C - 2 * n * Math.sin(rad(lat))) / n;
  const th = n * (rad(lon) - l0);
  return [rho * Math.sin(th), -(rho0 - rho * Math.cos(th))];
};

const W = 1000;
const geo = JSON.parse(fs.readFileSync(src, 'utf8'));
const states = geo.features.filter((f) => f.properties.iso_a2 === 'US' && !['AK', 'HI'].includes(f.properties.postal));
const polys = states.map((f) => ({
  id: f.properties.postal,
  rings: (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).flat().map((r) => r.map(([lo, la]) => albers(lo, la))),
}));
const all = polys.flatMap((p) => p.rings.flat());
const minX = Math.min(...all.map((p) => p[0]));
const maxX = Math.max(...all.map((p) => p[0]));
const minY = Math.min(...all.map((p) => p[1]));
const maxY = Math.max(...all.map((p) => p[1]));
const k = W / (maxX - minX);
const H = Math.round((maxY - minY) * k);
const tx = ([x, y]) => [(x - minX) * k, (y - minY) * k];
const ringD = (r) => {
  const pts = [];
  for (const p of r.map(tx)) {
    const q = p.map((v) => Math.round(v * 10) / 10);
    const last = pts[pts.length - 1];
    if (!last || Math.hypot(q[0] - last[0], q[1] - last[1]) >= 0.8) pts.push(q);
  }
  return pts.length > 2 ? 'M' + pts.map((p) => p.join(',')).join('L') + 'Z' : '';
};
const points = JSON.parse(fs.readFileSync(pointsPath, 'utf8')).map((p) => {
  const [x, y] = tx(albers(p.lon, p.lat));
  return {...p, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10};
});
const data = {width: W, height: H, states: polys.map((p) => ({id: p.id, d: p.rings.map(ringD).join('')})), points};
fs.writeFileSync(out, JSON.stringify(data));
console.log(`${polys.length} bang, ${points.length} điểm, ${W}×${H}, ${(fs.statSync(out).size / 1024).toFixed(0)} KB → ${out}`);
