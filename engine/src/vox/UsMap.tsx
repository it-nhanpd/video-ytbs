import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {voxTheme as T} from '../theme';
import {voxFonts as F} from './fonts';
import {clamp} from './paper';

export type MapPoint = {
  id: string;
  n: number;
  date: string;
  place: string;
  x: number;
  y: number;
  death: boolean;
  lx?: number; // lệch nhãn tên thành phố (đơn vị bản đồ)
  ly?: number;
  la?: 'start' | 'end' | 'middle';
};
export type UsMapData = {width: number; height: number; states: {id: string; d: string}[]; points: MapPoint[]};

const cache = new Map<string, Promise<UsMapData>>();
export const useUsMap = (src: string) => {
  const [data, setData] = useState<UsMapData | null>(null);
  const [handle] = useState(() => delayRender(`usmap ${src}`));
  useEffect(() => {
    let p = cache.get(src);
    if (!p) {
      p = fetch(src).then((r) => r.json() as Promise<UsMapData>);
      cache.set(src, p);
    }
    p.then((d) => {
      setData(d);
      continueRender(handle);
    });
  }, [src, handle]);
  return data;
};

const yearOf = (date: string) => {
  const [y, m, d] = date.split('-').map(Number);
  return y + (m - 1) / 12 + (d - 1) / 365;
};

// Các điểm trùng thành phố: tách nhẹ quanh tâm để thấy đủ số.
const spread = (pts: MapPoint[]) => {
  const seen = new Map<string, number>();
  return pts.map((p) => {
    const k = seen.get(p.place) ?? 0;
    seen.set(p.place, k + 1);
    const a = k * 2.3 - 0.4;
    const r = k === 0 ? 0 : 24;
    return {...p, ox: p.x + Math.cos(a) * r, oy: p.y + Math.sin(a) * r, first: k === 0};
  });
};

// Bản đồ 48 bang: mode timeline = các vụ hiện dần theo ngày; mode focus = phóng vào một điểm (id).
export const UsMap: React.FC<{
  data: UsMapData;
  mode: 'timeline' | 'focus';
  width: number;
  focusId?: string;
  revealFrom?: number;
  revealTo?: number;
  zoomFrom?: number;
  zoomTo?: number;
}> = ({data, mode, width, focusId = 'lincoln', revealFrom = 0, revealTo = 100, zoomFrom = 0, zoomTo = 40}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = width / data.width;
  const h = data.height * k;
  const bombs = spread(data.points.filter((p) => p.n > 0));
  const y0 = yearOf(bombs[0].date);
  const y1 = yearOf(bombs[bombs.length - 1].date);
  const appearAt = (p: MapPoint) => (mode === 'timeline' ? revealFrom + ((yearOf(p.date) - y0) / (y1 - y0)) * (revealTo - revealFrom) : -1e9);

  const focus = data.points.find((p) => p.id === focusId);
  const z = mode === 'focus' ? interpolate(frame, [zoomFrom, zoomTo], [1, 3.4], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)}) : 1;
  const fx = focus ? focus.x * k : width / 2;
  const fy = focus ? focus.y * k : h / 2;
  const tx = mode === 'focus' ? interpolate(z, [1, 3.4], [0, width / 2 - fx]) : 0;
  const ty = mode === 'focus' ? interpolate(z, [1, 3.4], [0, h / 2 - fy]) : 0;

  return (
    <div style={{position: 'relative', width, height: h}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: `${fx}px ${fy}px`}}>
        <svg width={width} height={h} viewBox={`0 0 ${data.width} ${data.height}`} style={{overflow: 'visible', filter: `drop-shadow(0 8px 10px ${T.shadow})`}}>
          <g filter="url(#vox-rough)">
            {data.states.map((s) => (
              <path
                key={s.id}
                d={s.d}
                fill={mode === 'focus' && s.id === 'MT' ? T.mustard : T.land}
                stroke={T.landStroke}
                strokeWidth={1.1 / z}
                opacity={mode === 'focus' && s.id !== 'MT' ? interpolate(frame, [zoomFrom, zoomTo], [1, 0.75], clamp) : 1}
              />
            ))}
          </g>
          {mode === 'timeline' &&
            bombs.map((p) => {
              const at = appearAt(p);
              const e = spring({frame: frame - at, fps, config: {stiffness: 200, damping: 12}});
              if (e <= 0.001) return null;
              const r = 13;
              const ring = interpolate(frame - at, [0, 18], [r, r * 3.2], clamp);
              const ringO = interpolate(frame - at, [0, 18], [0.8, 0], clamp);
              const col = p.death ? T.red : T.ink;
              return (
                <g key={p.id}>
                  <circle cx={p.ox} cy={p.oy} r={ring} fill="none" stroke={col} strokeWidth={3} opacity={ringO} />
                  <circle cx={p.ox} cy={p.oy} r={r * e} fill={col} stroke={T.paperEdge} strokeWidth={2.5} />
                  <text x={p.ox} y={p.oy + 5} fontSize={14} fontFamily={F.mono} fontWeight={700} fill={T.paperEdge} textAnchor="middle" opacity={e}>
                    {p.n}
                  </text>
                  {p.first && (
                    <text
                      x={p.x + (p.lx ?? 20)}
                      y={p.y + (p.ly ?? -16)}
                      fontSize={17}
                      fontFamily={F.mono}
                      fontWeight={700}
                      fill={T.inkSoft}
                      textAnchor={p.la ?? 'start'}
                      opacity={e}
                    >
                      {p.place.split(',')[0]}
                    </text>
                  )}
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
};

export const mapYear = (data: UsMapData, frame: number, revealFrom: number, revealTo: number) => {
  const bombs = data.points.filter((p) => p.n > 0);
  const y0 = yearOf(bombs[0].date);
  const y1 = yearOf(bombs[bombs.length - 1].date);
  return Math.floor(interpolate(frame, [revealFrom, revealTo], [y0, y1], clamp));
};

export const mapCount = (data: UsMapData, frame: number, revealFrom: number, revealTo: number) => {
  const bombs = data.points.filter((p) => p.n > 0);
  const y0 = yearOf(bombs[0].date);
  const y1 = yearOf(bombs[bombs.length - 1].date);
  return bombs.filter((p) => frame >= revealFrom + ((yearOf(p.date) - y0) / (y1 - y0)) * (revealTo - revealFrom)).length;
};
