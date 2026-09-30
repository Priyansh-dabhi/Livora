/**
 * Card Component
 *
 * Generic rounded card wrapper with optional press action and subtle shadow.
 */

import React, { type ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors, spacing, radius, shadows } from '@/theme';

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  selected?: boolean;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function Card({
  children,
  onPress,
  selected = false,
  style,
  noPadding = false,
}: CardProps) {
  const content = (
    <View
      style={[
        styles.card,
        shadows.sm,
        selected && styles.selected,
        noPadding && styles.noPadding,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  selected: {
    borderColor: colors.borderSelected,
    backgroundColor: colors.highlightMint,
  },
  noPadding: {
    padding: 0,
  },
});
