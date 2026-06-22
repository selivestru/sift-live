export const USERNAME_COLORS = [
  '#FF6B6B',
  '#FFA94D',
  '#FFD43B',
  '#69DB7C',
  '#38D9A9',
  '#22B8CF',
  '#4DABF7',
  '#748FFC',
  '#9775FA',
  '#5F3DC4',
  '#F783AC',
  '#C2255C',
] as const

export type UsernameColor = (typeof USERNAME_COLORS)[number]

export const DEFAULT_USERNAME_COLOR = USERNAME_COLORS[0]
