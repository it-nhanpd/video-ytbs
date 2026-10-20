// house-style: mọi màu/grade nằm ở đây, component không hardcode màu.
export type Grade = {
  sky: {top: string; mid: string; horizon: string};
  sunGlow: string;
  // Lớp phủ màu toàn khung (blend soft-light) + độ mạnh vignette + grain.
  wash: string;
  washOpacity: number;
  vignette: number;
  grain: number;
};

export const grades: Record<string, Grade> = {
  ochre_dusk: {
    sky: {top: '#d6c47e', mid: '#cfa65e', horizon: '#b8743f'},
    sunGlow: 'rgba(255, 226, 160, 0.55)',
    wash: '#c98a45',
    washOpacity: 0.18,
    vignette: 0.45,
    grain: 0.07,
  },
  arena_warm: {
    sky: {top: '#1a1624', mid: '#2c2233', horizon: '#4a3340'},
    sunGlow: 'rgba(255, 214, 160, 0.35)',
    wash: '#d08a4a',
    washOpacity: 0.16,
    vignette: 0.5,
    grain: 0.06,
  },
  arena_cold: {
    sky: {top: '#0b0f1a', mid: '#141c2c', horizon: '#223048'},
    sunGlow: 'rgba(190, 215, 255, 0.35)',
    wash: '#5a7fb0',
    washOpacity: 0.2,
    vignette: 0.6,
    grain: 0.06,
  },
  misty_green: {
    sky: {top: '#9aa58f', mid: '#b9bfa0', horizon: '#d8cf9e'},
    sunGlow: 'rgba(255, 236, 190, 0.5)',
    wash: '#6f7d68',
    washOpacity: 0.22,
    vignette: 0.55,
    grain: 0.07,
  },
  // Hoàng hôn tím nhạt (bài thử run20): gần như không phủ màu, vignette rõ như video tham chiếu.
  lilac_dusk: {
    sky: {top: '#cdbfd8', mid: '#d9ccdf', horizon: '#e4dae6'},
    sunGlow: 'rgba(255, 240, 230, 0.2)',
    wash: '#8a7a96',
    washOpacity: 0.08,
    vignette: 0.5,
    grain: 0.05,
  },
  // Bản đồ phẳng (empire-map): gần như không phủ màu để bảng màu đế chế đọc đúng.
  map_clean: {
    sky: {top: '#cfe2ea', mid: '#cfe2ea', horizon: '#cfe2ea'},
    sunGlow: 'rgba(255, 255, 255, 0)',
    wash: '#ffffff',
    washOpacity: 0,
    vignette: 0.12,
    grain: 0.02,
  },
};

// Nhân vật hoạt hình MMA (style bible cartoon-mma.md): màu nhân vật + màu hiệu ứng.
// Quân phục (thay quần đấu + găng) cho nhân vật lính. Không có phù hiệu (style-lock.md).
export type Soldier = {
  tunic: string;
  collar: string;
  trousers: string;
  boots: string;
  belt: string;
  helmet: 'stahlhelm' | 'pickelhaube';
  helmetColor: string;
  brass?: string;
  lug?: boolean; // chốt thông gió nhô ra bên mũ M1916
  canister?: string; // hộp trụ mặt nạ phòng độc ở hông
};
export type Cast = {main: string; skin: string; hair: string; hairStyle: 'spiky' | 'buzz' | 'bald'; band?: string; soldier?: Soldier};
export type CastId = 'red' | 'blue' | 'ref' | 'wehrmacht1936' | 'prussia1871' | 'heer1916';
export const cast: Record<CastId, Cast> = {
  red: {main: '#d9453b', skin: '#f2c29b', hair: '#2a1a12', hairStyle: 'spiky', band: '#f4f1ea'},
  blue: {main: '#3b7bd9', skin: '#b87a52', hair: '#1a1a22', hairStyle: 'buzz'},
  ref: {main: '#9a9aa6', skin: '#e8c9a8', hair: '#6b6b74', hairStyle: 'bald'},
  // Thẻ library de-wehrmacht-infantry-1936: áo xanh xám, cổ xanh lục sẫm, quần olive sẫm, ủng cao, mũ M35.
  wehrmacht1936: {
    main: '#5e6650',
    skin: '#f2c29b',
    hair: '#2a1a12',
    hairStyle: 'bald',
    soldier: {tunic: '#5e6650', collar: '#2f4a38', trousers: '#444d41', boots: '#16161a', belt: '#2a1f18', helmet: 'stahlhelm', helmetColor: '#4a5240'},
  },
  // Thẻ library de-heer-infantry-1916: Bluse M1915 xanh xám ngả lục, mũ M1916 xanh olive đậm có chốt thông gió, hộp mặt nạ phòng độc.
  heer1916: {
    main: '#4a5746',
    skin: '#f2c29b',
    hair: '#2a1a12',
    hairStyle: 'bald',
    soldier: {tunic: '#4a5746', collar: '#394336', trousers: '#41493c', boots: '#16161a', belt: '#16161a', helmet: 'stahlhelm', helmetColor: '#394336', lug: true, canister: '#6e7466'},
  },
  // Thẻ library de-prussia-infantry-1871: áo xanh Phổ, cổ đỏ, mũ Pickelhaube da đen, phụ kiện đồng.
  prussia1871: {
    main: '#27386b',
    skin: '#b87a52',
    hair: '#1a1a22',
    hairStyle: 'bald',
    soldier: {tunic: '#27386b', collar: '#b8312f', trousers: '#2a2a33', boots: '#16161a', belt: '#e8e4d8', helmet: 'pickelhaube', helmetColor: '#1c1c22', brass: '#c9a24a'},
  },
};

export const toon = {
  ink: '#14141a',
  shoe: '#22222c',
  white: '#f4f1ea',
  mouth: '#5a1620',
  tongue: '#e0606a',
  shadow: 'rgba(0, 0, 0, 0.35)',
  impact: '#fff3b0',
  impactEdge: '#14141a',
  flash: '#ffffff',
  fade: '#000000',
};

export const arena = {
  floor: '#2b2b35',
  floorEdge: '#46465a',
  fence: 'rgba(255, 255, 255, 0.14)',
  crowd: '#0c0c12',
  light: 'rgba(255, 240, 214, 0.20)',
};

// Hiệu ứng vẽ bằng code: bóng/bụi dưới chân rig, tia sáng đổi bộ phận, vòng chú thích, nổ ở xa (Burst).
export const fx = {
  groundShadow: '#14110c',
  dust: '#d8c9a0',
  swapFlash: 'rgba(255, 246, 214, 0.95)',
  swapFlashMid: 'rgba(255, 236, 180, 0.45)',
  swapFlashEdge: 'rgba(255, 236, 180, 0)',
  callout: '#f4ead2',
  calloutShadow: 'rgba(0, 0, 0, 0.55)',
  smoke: 'rgba(70, 62, 54, 0.9)',
  smokeMid: 'rgba(70, 62, 54, 0.55)',
  smokeEdge: 'rgba(70, 62, 54, 0)',
  fireCore: 'rgba(255, 244, 200, 1)',
  fireMid: 'rgba(255, 160, 60, 0.85)',
  fireEdge: 'rgba(255, 110, 30, 0)',
};

// Chữ trên màn hình (LowerThird, Chip, credit).
export const caption = {
  text: '#f4ead2',
  shadow: 'rgba(0, 0, 0, 0.6)',
  plate: 'rgba(14, 12, 10, 0.62)',
  plateCredit: 'rgba(14, 12, 10, 0.66)',
  border: 'rgba(244, 234, 210, 0.55)',
  accent: '#e5524e',
};

export const fonts = {
  // Josefin Sans có subset tiếng Việt.
  label: 'Josefin Sans',
};

// Bản đồ phẳng (style empire-map): màu đất/biển và bảng màu đế chế. Layer `map` tham chiếu đế chế bằng key.
export const mapTheme = {
  sea: '#cfe2ea',
  land: '#efe6cf',
  coast: '#a89c80',
  graticule: 'rgba(120, 140, 150, 0.22)',
  mark: '#1d3557',
  labelRegion: '#5d6b73',
  labelPlace: '#2b2a26',
  labelHalo: 'rgba(239, 230, 207, 0.9)',
  photoFrame: '#fbf8ee',
  photoShadow: 'rgba(30, 24, 16, 0.35)',
  empires: {
    russia: '#c4533d',
    mongol: '#4f7f9e',
    british: '#b24a63',
    qing: '#d1a43a',
    spanish: '#d98b3a',
    french: '#5b6fb0',
    umayyad: '#4f9a6b',
    abbasid: '#2f6f5e',
    yuan: '#7b5aa6',
    brazil: '#6aa84f',
  } as Record<string, string>,
};

// Style truecrime-collage (template vox, content/library/styles/truecrime-collage.md).
export const voxTheme = {
  paper: '#ece4d3',
  paperEdge: '#f8f4ea',
  paperDark: '#1c1a17',
  ink: '#1b1b1b',
  inkSoft: '#4a453d',
  red: '#d7372b',
  mustard: '#e8b33c',
  blue: '#2c4a6b',
  land: '#d8ccb1',
  landStroke: '#9c8f74',
  shadow: 'rgba(28, 22, 14, 0.38)',
  tape: 'rgba(232, 214, 160, 0.88)',
  subtitleText: '#f6f1e6',
  subtitlePlate: 'rgba(22, 20, 17, 0.78)',
  vignette: 'rgba(40, 30, 18, 0.35)',
  highlight: 'rgba(232, 179, 60, 0.75)',
  stampPlate: 'rgba(248, 244, 234, 0.9)',
  subPlateDark: 'rgba(16, 14, 12, 0.72)',
};

// Bản đồ giấy cổ (history-cel-docu.md §3–4): kind `geomap` của template vox.
export const paperMapTheme = {
  paper: '#e9e1cc',
  sea: '#c9d3d0',
  seaLine: '#9fb2b1', // đường nước kép dọc bờ
  land: '#e2d5ae',
  landFocus: '#d8c48f',
  north: '#c9b98c',
  red: '#c8392b',
  border: '#6b5a3e',
  coast: '#3d3326',
  river: '#7f9aa0',
  province: 'rgba(107, 90, 62, 0.55)',
  provinceFill: 'rgba(200, 57, 43, 0.22)',
  labelInk: '#2a231a',
  labelPlate: '#fbf8ef',
  labelHalo: 'rgba(233, 225, 204, 0.9)',
  vignette: 'rgba(60, 44, 24, 0.38)',
};

export const blurPerZ = 2.5;
