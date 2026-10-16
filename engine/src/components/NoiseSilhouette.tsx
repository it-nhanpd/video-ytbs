import React, {useMemo} from 'react';
import {AbsoluteFill, random, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';

type Props = {seed: number; baseY: number; amp: number; color: string; palms: number; palmScale?: number};

const OVERSCAN = 0.25; // vẽ rộng hơn khung mỗi bên để pan/zoom không lộ mép

// Hàng cây dạng bóng: tán cây nhấp nhô sinh bằng noise + vài cây dừa.
export const NoiseSilhouette: React.FC<Props> = ({seed, baseY, amp, color, palms, palmScale = 1}) => {
  const {width, height} = useVideoConfig();
  const x0 = -width * OVERSCAN;
  const totalW = width * (1 + OVERSCAN * 2);

  const {canopy, palmPaths} = useMemo(() => {
    const step = 34;
    const pts: [number, number][] = [];
    for (let x = x0; x <= x0 + totalW + step; x += step) {
      const big = noise2D(`${seed}-big`, x * 0.0016, 0) * 0.5 + 0.5;
      const small = noise2D(`${seed}-small`, x * 0.012, 0) * 0.5 + 0.5;
      pts.push([x, height * (baseY - amp * (0.65 * big + 0.35 * small))]);
    }
    // Mỗi đoạn là một "búi" tán cây: điểm điều khiển nhô lên trên.
    let d = `M ${x0} ${height} L ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1];
      const [cx, cy] = pts[i];
      const bump = 10 + random(`${seed}-bump-${i}`) * 18;
      d += ` Q ${(px + cx) / 2} ${Math.min(py, cy) - bump} ${cx} ${cy}`;
    }
    d += ` L ${x0 + totalW + step} ${height} Z`;

    const palmPaths: string[] = [];
    for (let k = 0; k < palms; k++) {
      const px = x0 + totalW * (0.08 + 0.84 * random(`${seed}-palm-${k}`));
      const ground = height * (baseY - amp * 0.4);
      const trunkH = height * (0.1 + 0.08 * random(`${seed}-palmh-${k}`)) * palmScale;
      const lean = (random(`${seed}-lean-${k}`) - 0.5) * 60 * palmScale;
      const topX = px + lean;
      const topY = ground - trunkH;
      palmPaths.push(
        `M ${px - 4} ${ground} Q ${px + lean * 0.3} ${ground - trunkH * 0.5} ${topX} ${topY} L ${topX + 4} ${topY} Q ${px + lean * 0.3 + 6} ${ground - trunkH * 0.5} ${px + 5} ${ground} Z`,
      );
      const fronds = 7;
      for (let j = 0; j < fronds; j++) {
        const a = Math.PI * (0.05 + (0.9 * j) / (fronds - 1)) + (random(`${seed}-fa-${k}-${j}`) - 0.5) * 0.3;
        const len = (55 + random(`${seed}-fl-${k}-${j}`) * 35) * palmScale;
        const ex = topX - Math.cos(a) * len;
        const ey = topY - Math.sin(a) * len * 0.35 + len * 0.45; // rủ xuống
        const mx = topX - Math.cos(a) * len * 0.5;
        const my = topY - Math.sin(a) * len * 0.55;
        palmPaths.push(`M ${topX} ${topY} Q ${mx} ${my - 8} ${ex} ${ey} Q ${mx} ${my + 4} ${topX} ${topY + 3} Z`);
      }
    }
    return {canopy: d, palmPaths};
  }, [seed, baseY, amp, palms, palmScale, height, x0, totalW]);

  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{overflow: 'visible'}}>
        <path d={canopy} fill={color} />
        {palmPaths.map((p, i) => (
          <path key={i} d={p} fill={color} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
