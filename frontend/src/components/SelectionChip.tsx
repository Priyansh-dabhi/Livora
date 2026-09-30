/**
 * SelectionChip Component
 *
 * Removable chip for displaying selected items (e.g., selected tasks in confirmation).
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '@/theme';

interface SelectionChipProps {
  label: string;
  onRemove?: () => void;
}

export function SelectionChip({ label, onRemove }: SelectionChipProps) {
  return (
    <View style={styles.chip} accessibilityRole="text">
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          accessibilityLabel={`Remove ${label}`}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="x" size={14} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlightMint,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.captionMedium,
    color: colors.primary,
    maxWidth: 180,
  },
  removeButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
});
