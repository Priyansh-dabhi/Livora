/**
 * Badge Component
 *
 * Small label badge for counts, "Soon" tags, and status indicators.
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors, spacing, typography, radius } from '@/theme';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<
  BadgeVariant,
  { bg: string; text: string }
> = {
  primary: { bg: colors.primaryLight, text: colors.primary },
  accent: { bg: colors.accentLight, text: colors.accent },
  success: { bg: colors.successLight, text: colors.success },
  error: { bg: colors.errorLight, text: colors.error },
  neutral: { bg: colors.surfaceElevated, text: colors.textSecondary },
};

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: variantStyle.bg },
        style,
      ]}
      accessibilityRole="text"
    >
      <Text style={[styles.text, { color: variantStyle.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
  },
  text: {
    ...typography.micro,
  },
});
