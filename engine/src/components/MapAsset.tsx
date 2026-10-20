import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {MapLayerT} from '../schema';
import {fonts, mapTheme} from '../theme';
import {easings} from '../utils';

type MapFrame = {key: string; rings: [number, number][][]};
type MapData = {frames: MapFrame[]};

const LAM0 = 160; // kinh tuyến giữa bản đồ (độ). Khớp với tools/map-extract.mjs (lon -30..330).
const UNITS_PER_ZOOM_WIDTH = 3.2; // zoom 1 ≈ 3,2 đơn vị Equal Earth theo chiều ngang khung

// Equal Earth (Šavrič, Patterson, Jenny 2018): chiếu bảo toàn diện tích, đúng chủ đề so sánh diện tích.
const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const M = Math.sqrt(3) / 2;
const rad = (d: number) => (d * Math.PI) / 180;
export const project = (lon: number, lat: number): [number, number] => {
  const lam = rad(lon - LAM0);
  const th = Math.asin(M * Math.sin(rad(lat)));
  const t2 = th * th;
  const t6 = t2 * t2 * t2;
  const x = (2 * Math.sqrt(3) * lam * Math.cos(th)) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
  const y = th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
  return [x, y];
};

const ringsPath = (rings: [number, number][][]) =>
  rings
    .map((r) => 'M' + r.map(([lon, lat]) => project(lon, lat).map((v) => v.toFixed(4)).join(',')).join('L') + 'Z')
    .join('');

const cache = new Map<string, Promise<MapData>>();
const load = (src: string) => {
  let p = cache.get(src);
  if (!p) {
    p = fetch(staticFile(src)).then((r) => r.json() as Promise<MapData>);
    cache.set(src, p);
  }
  return p;
};

// Tải mọi JSON bản đồ trước khi vẽ khung đầu tiên (render chờ qua delayRender).
const useMapData = (srcs: string[]) => {
  const key = srcs.join('|');
  const [data, setData] = useState<Record<string, MapData> | null>(null);
  useEffect(() => {
    const handle = delayRender(`map:${key}`);
    Promise.all(srcs.map(load))
      .then((all) => setData(Object.fromEntries(srcs.map((s, i) => [s, all[i]]))))
      .catch((e) => {
        console.error(e);
        throw e;
      })
      .finally(() => continueRender(handle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return data;
};

// Trọng số hiển thị từng stage tại thời điểm t (giây): crossfade fadeSec kết thúc đúng lúc stage sau bắt đầu.
const stageWeights = (stages: {atSec: number; key: string}[], t: number, fade: number) => {
  const s = [...stages].sort((a, b) => a.atSec - b.atSec);
  const w: Record<string, number> = {};
  const add = (key: string, v: number) => {
    w[key] = Math.max(w[key] ?? 0, v);
  };
  if (t < s[0].atSec) return w;
  for (let i = 0; i < s.length; i++) {
    const next = s[i + 1];
    if (!next) {
      if (t >= s[i].atSec) add(s[i].key, i === 0 ? Math.min(1, (t - s[i].atSec) / 0.4) : 1);
      continue;
    }
    if (t >= s[i].atSec && t < next.atSec) {
      const k = Math.min(1, Math.max(0, (t - (next.atSec - fade)) / fade));
      add(s[i].key, (i === 0 ? Math.min(1, (t - s[i].atSec) / 0.4) : 1) * (1 - k));
      add(next.key, k);
    }
  }
  return w;
};

const viewAt = (views: MapLayerT['views'], t: number) => {
  const v = [...views].sort((a, b) => a.atSec - b.atSec);
  let a = v[0];
  let b = v[0];
  for (let i = 0; i < v.length; i++) {
    if (v[i].atSec <= t) {
      a = v[i];
      b = v[i + 1] ?? v[i];
    }
  }
  const k = a === b ? 0 : easings[a.ease](Math.min(1, Math.max(0, (t - a.atSec) / (b.atSec - a.atSec))));
  const mix = (x: number, y: number) => x + (y - x) * k;
  return {lon: mix(a.lon, b.lon), lat: mix(a.lat, b.lat), zoom: Math.exp(mix(Math.log(a.zoom), Math.log(b.zoom)))};
};

type Props = {layer: MapLayerT; locale?: Record<string, string>};

export const MapAsset: React.FC<Props> = ({layer, locale = {}}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const srcs = useMemo(() => [layer.baseSrc, ...layer.empires.map((e) => e.src)], [layer]);
  const data = useMapData(srcs);

  const basePath = useMemo(() => (data ? ringsPath(data[layer.baseSrc].frames[0].rings) : ''), [data, layer.baseSrc]);
  const empirePaths = useMemo(() => {
    if (!data) return [];
    return layer.empires.map((e) => ({
      e,
      paths: Object.fromEntries(data[e.src].frames.map((f) => [f.key, ringsPath(f.rings)])),
    }));
  }, [data, layer.empires]);
  const grat = useMemo(() => {
    if (!layer.graticule) return '';
    const parts: string[] = [];
    for (let lon = -30; lon <= 330; lon += 30) {
      const pts: string[] = [];
      for (let lat = -80; lat <= 80; lat += 5) pts.push(project(lon, lat).map((v) => v.toFixed(4)).join(','));
      parts.push('M' + pts.join('L'));
    }
    for (let lat = -60; lat <= 80; lat += 30) {
      const pts: string[] = [];
      for (let lon = -30; lon <= 330; lon += 5) pts.push(project(lon, lat).map((v) => v.toFixed(4)).join(','));
      parts.push('M' + pts.join('L'));
    }
    return parts.join('');
  }, [layer.graticule]);

  if (!data) return null;

  const view = viewAt(layer.views, t);
  const [cx, cy] = project(view.lon, view.lat);
  const S = (view.zoom * width) / UNITS_PER_ZOOM_WIDTH;
  const toScreen = (lon: number, lat: number): [number, number] => {
    const [x, y] = project(lon, lat);
    return [width / 2 + (x - cx) * S, height / 2 - (y - cy) * S];
  };

  return (
    <AbsoluteFill style={{background: mapTheme.sea}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${width / 2},${height / 2}) scale(${S},${-S}) translate(${-cx},${-cy})`} fillRule="evenodd">
          {grat ? <path d={grat} fill="none" stroke={mapTheme.graticule} strokeWidth={1} vectorEffect="non-scaling-stroke" /> : null}
          <path d={basePath} fill={mapTheme.land} stroke={mapTheme.coast} strokeWidth={1.2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {empirePaths.map(({e, paths}) => {
            const w = stageWeights(e.stages, t, e.fadeSec);
            const color = mapTheme.empires[e.color] ?? '#c0392b';
            return Object.entries(w).map(([key, v]) =>
              v > 0 && paths[key] ? (
                <path
                  key={`${e.id}-${key}`}
                  d={paths[key]}
                  fill={color}
                  fillOpacity={e.opacity * v}
                  stroke={color}
                  strokeOpacity={v}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null,
            );
          })}
        </g>
      </svg>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        {layer.labels.map((l, i) => {
          const op = interpolate(t, [l.atSec, l.atSec + 0.4, l.toSec - 0.4, l.toSec], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          if (op <= 0) return null;
          const [px, py] = toScreen(l.lon, l.lat);
          if (px < -50 || px > width + 50 || py < -20 || py > height + 20) return null;
          const region = l.kind === 'region';
          return (
            <text
              key={i}
              x={px}
              y={py}
              textAnchor="middle"
              fontFamily={fonts.label}
              fontWeight={region ? 500 : 700}
              fontSize={(region ? 0.0155 : 0.0165) * width}
              letterSpacing={region ? width * 0.0035 : 0}
              fill={region ? mapTheme.labelRegion : mapTheme.labelPlace}
              stroke={mapTheme.labelHalo}
              strokeWidth={width * 0.004}
              strokeLinejoin="round"
              paintOrder="stroke"
              opacity={op * (region ? 0.85 : 1)}
            >
              {region ? (locale[l.key] ?? l.key).toUpperCase() : (locale[l.key] ?? l.key)}
            </text>
          );
        })}
      </svg>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        {layer.marks.map((m, i) => {
          const op = interpolate(t, [m.atSec, m.atSec + 0.3, m.toSec - 0.3, m.toSec], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          if (op <= 0) return null;
          const [px, py] = toScreen(m.lon, m.lat);
          const base = m.radiusFrac * width;
          const ph = (t * 1.1) % 1; // sóng lan ra rồi tắt
          return (
            <g key={i} opacity={op}>
              <circle cx={px} cy={py} r={base} fill="none" stroke={mapTheme.mark} strokeWidth={5} />
              <circle cx={px} cy={py} r={base * (1 + ph * 0.8)} fill="none" stroke={mapTheme.mark} strokeWidth={3} opacity={1 - ph} />
            </g>
          );
        })}
      </svg>
      {layer.overlays.map((o, i) => {
        const fade = 0.3;
        const op = interpolate(t, [o.atSec, o.atSec + fade, o.toSec - fade, o.toSec], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (op <= 0) return null;
        const [px, py] = o.geo ? toScreen(o.geo.lon, o.geo.lat) : [o.fixed!.x * width, o.fixed!.y * height];
        const w = o.widthFrac * width;
        const h = w * o.aspect;
        const pop = interpolate(t, [o.atSec, o.atSec + 0.35], [0.88, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px + o.dx * width - w / 2,
              top: py + o.dy * width - h / 2,
              width: w,
              height: h,
              opacity: op,
              transform: `rotate(${o.rotateDeg}deg) scale(${pop})`,
              ...(o.frame
                ? {boxSizing: 'content-box', padding: 8, margin: -8, background: mapTheme.photoFrame, boxShadow: `0 6px 18px ${mapTheme.photoShadow}`}
                : {}),
            }}
          >
            <Img src={staticFile(o.src)} style={{width: '100%', height: '100%', objectFit: o.frame ? 'cover' : 'contain', transform: o.flipX ? 'scaleX(-1)' : undefined}} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
