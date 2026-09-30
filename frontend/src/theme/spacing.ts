/**
 * Livora Design System — Spacing Scale
 *
 * 4-point grid system for consistent vertical/horizontal rhythm.
 */

export const spacing = {
  /** 2px — hairline gaps */
  xxs: 2,
  /** 4px — tight internal padding */
  xs: 4,
  /** 8px — small gaps, icon padding */
  sm: 8,
  /** 12px — medium internal spacing */
  md: 12,
  /** 16px — standard content padding, gap between related items */
  lg: 16,
  /** 20px — section internal padding */
  xl: 20,
  /** 24px — generous spacing between sections */
  xxl: 24,
  /** 32px — large section breaks */
  xxxl: 32,
  /** 40px — extra large spacing */
  '4xl': 40,
  /** 48px — screen-level margins / hero spacing */
  '5xl': 48,
  /** 64px — major layout breaks */
  '6xl': 64,

  // ── Screen-level constants ────────────────────────────
  /** Horizontal padding for screen content */
  screenHorizontal: 20,
  /** Vertical padding for screen content */
  screenVertical: 16,
} as const;

export type SpacingToken = keyof typeof spacing;
