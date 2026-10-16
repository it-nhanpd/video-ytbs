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
  misty_green: {
    sky: {top: '#9aa58f', mid: '#b9bfa0', horizon: '#d8cf9e'},
    sunGlow: 'rgba(255, 236, 190, 0.5)',
    wash: '#6f7d68',
    washOpacity: 0.22,
    vignette: 0.55,
    grain: 0.07,
  },
};

export const fonts = {
  // Josefin Sans có subset tiếng Việt.
  label: 'Josefin Sans',
};

export const blurPerZ = 2.5;
