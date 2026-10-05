/**
 * Livora Design System — Border Radius Scale
 */

export const radius = {
  /** 2px — tight rounding (sm) */
  xs: 2,
  /** 4px — inputs, small cards (DEFAULT) */
  sm: 4,
  /** 8px — standard cards (md) */
  md: 8,
  /** 12px — larger cards, category cards (lg) */
  lg: 12,
  /** 16px — prominent cards (xl) */
  xl: 16,
  /** 24px — hero cards (xxl fallback) */
  xxl: 24,
  /** 9999px — pill shapes (tags, badges, avatars) */
  pill: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
