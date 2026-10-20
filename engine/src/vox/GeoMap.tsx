import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {paperMapTheme as M} from '../theme';
import {voxFonts as F} from './fonts';
import {clamp} from './paper';

// Dữ liệu từ tools/geo-map-extract.mjs (Natural Earth, đã chiếu, đơn vị = px của bản đồ rộng `width`).
export type GeoPoint = {id: string; lon: number; lat: number; x: number; y: number};
export type GeoMapData = {
  bbox: [number, number, number, number];
  width: number;
  height: number;
  scale: number;
  cosc: number;
  countries: {id: string; name: string; d: string}[];
  admin1: {id: string; name: string; d: string}[];
  rivers: {name: string; rank: number; d: string}[];
  points: GeoPoint[];
};

const cache = new Map<string, Promise<GeoMapData>>();
export const useGeoMap = (src: string) => {
  const [data, setData] = useState<GeoMapData | null>(null);
  const [handle] = useState(() => delayRender(`geomap ${src}`));
  useEffect(() => {
    let p = cache.get(src);
    if (!p) {
      p = fetch(src).then((r) => r.json() as Promise<GeoMapData>);
      cache.set(src, p);
    }
    p.then((d) => {
      setData(d);
      continueRender(handle);
    });
  }, [src, handle]);
  return data;
};

// Vị trí: id điểm có sẵn trong dữ liệu, hoặc lon/lat.
export type Where = {pt?: string; lon?: number; lat?: number};
export const locate = (data: GeoMapData, w: Where): [number, number] => {
  if (w.pt) {
    const p = data.points.find((q) => q.id === w.pt);
    if (!p) throw new Error(`geomap: không có điểm "${w.pt}"`);
    return [p.x, p.y];
  }
  const [lon0, , , lat1] = data.bbox;
  return [((w.lon ?? 0) - lon0) * data.cosc * data.scale, (lat1 - (w.lat ?? 0)) * data.scale];
};

// Khóa camera: tại frame `at`, nhìn vào `where`, zoom 1 = cả bản đồ vừa bề ngang khung.
export type CamKey = Where & {at: number; zoom: number};
export type GeoLabel = Where & {
  text: string;
  at: number;
  style?: 'country' | 'place' | 'box';
  dx?: number; // lệch nhãn, px màn hình
  dy?: number;
  size?: number;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const camAt = (data: GeoMapData, keys: CamKey[], frame: number) => {
  const pts = keys.map((k) => ({...k, xy: locate(data, k)}));
  if (frame <= pts[0].at) return {c: pts[0].xy, z: pts[0].zoom};
  for (let i = 1; i < pts.length; i++) {
    const [a, b] = [pts[i - 1], pts[i]];
    if (frame <= b.at) {
      const u = ease((frame - a.at) / Math.max(1, b.at - a.at));
      // Zoom nội suy theo log để tốc độ phóng đều; tâm đi theo cùng nhịp.
      const z = Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * u);
      return {c: [a.xy[0] + (b.xy[0] - a.xy[0]) * u, a.xy[1] + (b.xy[1] - a.xy[1]) * u] as [number, number], z};
    }
  }
  const last = pts[pts.length - 1];
  return {c: last.xy, z: last.zoom};
};

// Bản đồ giấy cổ: biển + đường nước kép, đất, nước tô nhấn, ranh tỉnh, sông, vĩ tuyến 17, nhãn hiện dần.
export const GeoMap: React.FC<{
  data: GeoMapData;
  cam: CamKey[];
  fill?: Record<string, string>; // ADM0_A3 → màu (tên khóa trong paperMapTheme hoặc mã màu)
  split17?: boolean; // tô Bắc Việt Nam khác màu (trên vĩ tuyến 17, minh họa)
  dmz?: boolean;
  provinces?: boolean;
  focusProvince?: string; // tên tỉnh trong dữ liệu (vd. "Quảng Ngãi")
  provinceAt?: number;
  labels?: GeoLabel[];
  bursts?: (Where & {at: number})[]; // vòng đỏ lan ra tại điểm (sự kiện có nguồn), lặp 3 nhịp
}> = ({data, cam, fill = {}, split17, dmz, provinces, focusProvince, provinceAt = 0, labels = [], bursts = []}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const k0 = W / data.width;
  const {c, z} = camAt(data, cam, frame);
  const k = k0 * z;
  const tx = W / 2 - c[0] * k;
  const ty = H / 2 - c[1] * k;
  const toScreen = ([x, y]: [number, number]) => [x * k + tx, y * k + ty];
  const color = (s: string) => (s in M ? M[s as keyof typeof M] : s);
  const y17 = (data.bbox[3] - 17) * data.scale;
  const vnm = data.countries.find((q) => q.id === 'VNM');
  const prov = data.admin1.find((a) => a.name === focusProvince);
  const provE = interpolate(frame, [provinceAt, provinceAt + fps * 0.6], [0, 1], clamp);
  // Nét giữ độ dày trên màn hình khi phóng.
  const nss = {vectorEffect: 'non-scaling-stroke'} as const;
  const dmzPts = dmz ? [locate(data, {pt: 'dmz-w'}), locate(data, {pt: 'dmz-e'})] : null;

  return (
    <AbsoluteFill style={{background: M.sea}}>
      <svg width={W} height={H}>
        <defs>
          <clipPath id="geo-north">
            <rect x={-1e5} y={-1e5} width={2e5} height={1e5 + y17} />
          </clipPath>
        </defs>
        <g transform={`translate(${tx} ${ty}) scale(${k})`}>
          {/* Đường nước kép dọc bờ: nét rộng nhạt dưới đất. */}
          {data.countries.map((q) => (
            <path key={`w2-${q.id}`} d={q.d} fill="none" stroke={M.seaLine} strokeWidth={22} strokeOpacity={0.35} style={nss} />
          ))}
          {data.countries.map((q) => (
            <path key={`w1-${q.id}`} d={q.d} fill="none" stroke={M.seaLine} strokeWidth={9} strokeOpacity={0.6} style={nss} />
          ))}
          {data.countries.map((q) => (
            <path key={q.id} d={q.d} fill={fill[q.id] ? color(fill[q.id]) : M.land} stroke={M.border} strokeWidth={1.4} strokeDasharray="6 3" style={nss} />
          ))}
          {split17 && vnm && <path d={vnm.d} fill={M.north} clipPath="url(#geo-north)" />}
          {provinces && data.admin1.map((a) => <path key={a.id} d={a.d} fill="none" stroke={M.province} strokeWidth={1} style={nss} />)}
          {prov && provE > 0 && <path d={prov.d} fill={M.provinceFill} fillOpacity={provE} stroke={M.red} strokeWidth={2.5} strokeOpacity={provE} style={nss} />}
          {data.rivers
            .filter((r) => r.rank <= 8)
            .map((r, i) => (
              <path key={i} d={r.d} fill="none" stroke={M.river} strokeWidth={1.6} style={nss} />
            ))}
          {/* Bờ biển đậm vẽ lại trên cùng (không nét đứt). */}
          {vnm && <path d={vnm.d} fill="none" stroke={M.coast} strokeWidth={2} style={nss} />}
          {dmzPts && (
            <path d={`M${dmzPts[0].join(',')}L${dmzPts[1].join(',')}`} fill="none" stroke={M.red} strokeWidth={4} strokeDasharray="10 6" style={nss} />
          )}
        </g>
      </svg>
      {/* Giấy cũ: hạt + vignette phủ lên bản đồ (dưới nhãn). Filter vox-grain ở VoxDefs. */}
      <AbsoluteFill style={{filter: 'url(#vox-grain)', opacity: 0.2, mixBlendMode: 'multiply', background: '#fff'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 50%, ${M.vignette} 100%)`}} />
      {bursts.map((b, i) => {
        const [sx, sy] = toScreen(locate(data, b));
        if (frame < b.at) return null;
        const pulse = fps * 0.9;
        return (
          <svg key={`b${i}`} width={W} height={H} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
            <circle cx={sx} cy={sy} r={11} fill={M.red} stroke={M.labelPlate} strokeWidth={3} />
            {[0, 1, 2].map((k) => {
              const u = (frame - b.at - k * pulse * 0.33) / pulse;
              if (u < 0 || u > 1) return null;
              return <circle key={k} cx={sx} cy={sy} r={14 + u * 70} fill="none" stroke={M.red} strokeWidth={5 * (1 - u) + 1} opacity={1 - u} />;
            })}
          </svg>
        );
      })}
      {labels.map((l, i) => {
        const e = spring({frame: frame - l.at, fps, config: {stiffness: 180, damping: 16}});
        if (e <= 0.001) return null;
        const [sx, sy] = toScreen(locate(data, l));
        const style = l.style ?? 'place';
        const x = sx + (l.dx ?? 0);
        const y = sy + (l.dy ?? 0);
        if (style === 'country')
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * e})`,
                opacity: e,
                fontFamily: F.serif,
                fontWeight: 900,
                fontSize: l.size ?? 40,
                letterSpacing: '0.18em',
                color: M.labelInk,
                textShadow: `0 0 6px ${M.labelHalo}`,
                whiteSpace: 'nowrap',
              }}
            >
              {l.text}
            </div>
          );
        return (
          <React.Fragment key={i}>
            {(l.dx || l.dy) && (
              <div style={{position: 'absolute', left: sx - 9, top: sy - 9, width: 18, height: 18, borderRadius: 9, background: M.red, border: `3px solid ${M.labelPlate}`, opacity: e}} />
            )}
            <div
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `translate(-50%, -50%) translateY(${(1 - e) * 14}px)`,
                opacity: e,
                fontFamily: F.serif,
                fontWeight: 700,
                fontSize: l.size ?? 30,
                color: M.labelInk,
                whiteSpace: 'nowrap',
                ...(style === 'box'
                  ? {background: M.labelPlate, border: `3px solid ${M.labelInk}`, padding: '4px 14px', boxShadow: `3px 3px 0 ${M.labelInk}`}
                  : {textShadow: `0 0 6px ${M.labelHalo}, 0 0 2px ${M.labelHalo}`}),
              }}
            >
              {l.text}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
