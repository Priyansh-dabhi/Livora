/**
 * Livora Design System — Typography
 *
 * Theme: Alexandria
 * Noto Serif for headlines, Inter for body, Public Sans for labels.
 */

import { TextStyle, Platform } from 'react-native';

/** Font weight constants */
export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

/** 
 * Font families mapped to the exact string names expected by expo-font.
 * NotoSerif, Inter, PublicSans
 */
export const fontFamilies = {
  headline: 'NotoSerif_400Regular',
  headlineMedium: 'NotoSerif_500Medium',
  headlineSemiBold: 'NotoSerif_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  label: 'PublicSans_500Medium',
  labelSemiBold: 'PublicSans_600SemiBold',
  // Fallback
  system: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
};

/** Font size scale */
export const fontSizes = {
  /** 11px — micro labels (label-sm) */
  xs: 11,
  /** 12px — captions, badges (label-md) */
  sm: 12,
  /** 14px — body small, secondary text (body-md, label-lg) */
  md: 14,
  /** 16px — body default (body-lg) */
  base: 16,
  /** 17px — sub-headings (title-md) */
  lg: 17,
  /** 20px — section headers (headline-sm) */
  xl: 20,
  /** 26px — screen titles (headline-md) */
  xxl: 26,
  /** 32px — hero headings (headline-lg) */
  xxxl: 32,
  /** 36px/48px — display text (display-lg-mobile/display-lg) */
  display: 36,
} as const;

/** Line height scale */
export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.5,
} as const;

/** Pre-composed text styles */
export const typography = {
  display: {
    fontFamily: fontFamilies.headline,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.regular,
    lineHeight: 42,
    letterSpacing: fontSizes.display * -0.015,
  } satisfies TextStyle,

  h1: {
    fontFamily: fontFamilies.headline,
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.regular,
    lineHeight: 38,
    letterSpacing: fontSizes.xxxl * -0.01,
  } satisfies TextStyle,

  h2: {
    fontFamily: fontFamilies.headlineMedium,
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.medium,
    lineHeight: 32,
  } satisfies TextStyle,

  h3: {
    fontFamily: fontFamilies.bodySemiBold, // Using Public Sans/Inter for h3/headline-sm? The plan says headline-sm is Public Sans.
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    lineHeight: 26,
    letterSpacing: fontSizes.xl * -0.01,
  } satisfies TextStyle,

  h4: {
    fontFamily: fontFamilies.bodySemiBold, // title-md uses Public Sans
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    lineHeight: 24,
  } satisfies TextStyle,

  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
  } satisfies TextStyle,

  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
  } satisfies TextStyle,

  bodyMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
  } satisfies TextStyle,

  caption: {
    fontFamily: fontFamilies.label,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: 16,
    letterSpacing: fontSizes.sm * 0.02,
  } satisfies TextStyle,

  captionMedium: {
    fontFamily: fontFamilies.label,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: 16,
    letterSpacing: fontSizes.sm * 0.02,
  } satisfies TextStyle,

  micro: {
    fontFamily: fontFamilies.labelSemiBold,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    lineHeight: 14,
    letterSpacing: fontSizes.xs * 0.04,
  } satisfies TextStyle,

  button: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: 24,
  } satisfies TextStyle,

  buttonSmall: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
  } satisfies TextStyle,

  input: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
  } satisfies TextStyle,

  label: {
    fontFamily: fontFamilies.labelSemiBold,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    lineHeight: 18,
    letterSpacing: fontSizes.md * 0.01,
  } satisfies TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
