/**
 * CategoryCard Component
 *
 * Large, spacious category card with icon, name, task count,
 * and prominent selected state (green border + mint background).
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '@/theme';

interface CategoryCardProps {
  name: string;
  icon: keyof typeof Feather.glyphMap;
  taskCount: number;
  selected: boolean;
  onPress: () => void;
}

export function CategoryCard({
  name,
  icon,
  taskCount,
  selected,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${name}, ${taskCount} tasks${selected ? ', selected' : ''}`}
      style={[
        styles.card,
        shadows.sm,
        selected && styles.cardSelected,
      ]}
    >
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <Feather
          name={icon}
          size={22}
          color={selected ? colors.primary : colors.textSecondary}
        />
      </View>

      <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={2}>
        {name}
      </Text>

      <Text style={styles.taskCount}>
        {taskCount} {taskCount === 1 ? 'service' : 'services'}
      </Text>

      {selected && (
        <View style={styles.checkBadge}>
          <Feather name="check" size={12} color={colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 120,
    justifyContent: 'center',
    position: 'relative',
  },
  cardSelected: {
    borderColor: colors.borderSelected,
    backgroundColor: colors.highlightMint,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: colors.primaryLight,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  nameSelected: {
    color: colors.primary,
  },
  taskCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
