/**
 * Livora Design System — Typography
 *
 * System font stack. Large readable text with strong hierarchy.
 */

import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

/** Font weight constants */
export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

/** Font size scale */
export const fontSizes = {
  /** 11px — micro labels */
  xs: 11,
  /** 12px — captions, badges */
  sm: 12,
  /** 14px — body small, secondary text */
  md: 14,
  /** 16px — body default */
  base: 16,
  /** 18px — large body, sub-headings */
  lg: 18,
  /** 20px — section headers */
  xl: 20,
  /** 24px — screen titles */
  xxl: 24,
  /** 28px — hero headings */
  xxxl: 28,
  /** 32px — display text */
  display: 32,
} as const;

/** Line height scale */
export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

/** Pre-composed text styles */
export const typography = {
  display: {
    fontFamily,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.display * lineHeights.tight,
  } satisfies TextStyle,

  h1: {
    fontFamily,
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xxxl * lineHeights.tight,
  } satisfies TextStyle,

  h2: {
    fontFamily,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.xxl * lineHeights.tight,
  } satisfies TextStyle,

  h3: {
    fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.xl * lineHeights.normal,
  } satisfies TextStyle,

  h4: {
    fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.lg * lineHeights.normal,
  } satisfies TextStyle,

  bodyLarge: {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.relaxed,
  } satisfies TextStyle,

  body: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.md * lineHeights.relaxed,
  } satisfies TextStyle,

  bodyMedium: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.md * lineHeights.relaxed,
  } satisfies TextStyle,

  caption: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } satisfies TextStyle,

  captionMedium: {
    fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } satisfies TextStyle,

  micro: {
    fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.xs * lineHeights.normal,
  } satisfies TextStyle,

  button: {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.base * lineHeights.normal,
  } satisfies TextStyle,

  buttonSmall: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.md * lineHeights.normal,
  } satisfies TextStyle,

  input: {
    fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.base * lineHeights.normal,
  } satisfies TextStyle,

  label: {
    fontFamily,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.md * lineHeights.normal,
  } satisfies TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
