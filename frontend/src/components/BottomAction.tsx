/**
 * BottomAction Component
 *
 * Fixed bottom CTA bar with safe-area padding. Used for primary actions
 * like "Continue", "Confirm", "Save" at the bottom of screens.
 */

import React, { type ReactNode } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, shadows } from '@/theme';

interface BottomActionProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function BottomAction({ children, style }: BottomActionProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        shadows.md,
        { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
