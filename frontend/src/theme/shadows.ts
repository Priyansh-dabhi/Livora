/**
 * Livora Design System — Shadow presets
 *
 * Minimal shadow usage — clean and premium feel.
 */

import { ViewStyle, Platform } from 'react-native';

export const shadows = {
  none: {} as ViewStyle,

  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1B1C1D', // neutral cool (rgba 27,28,29)
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
    default: {},
  }) ?? {},

  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1B1C1D',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }) ?? {},

  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#1B1C1D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }) ?? {},
} as const;

export type ShadowToken = keyof typeof shadows;
