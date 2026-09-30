/**
 * Livora Design System — Border Radius Scale
 */

export const radius = {
  /** 4px — subtle rounding */
  xs: 4,
  /** 8px — inputs, small cards */
  sm: 8,
  /** 12px — standard cards */
  md: 12,
  /** 16px — larger cards, category cards */
  lg: 16,
  /** 20px — prominent cards */
  xl: 20,
  /** 24px — hero cards */
  xxl: 24,
  /** 9999px — pill shapes (tags, badges, avatars) */
  pill: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
