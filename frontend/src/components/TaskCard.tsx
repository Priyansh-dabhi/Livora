/**
 * TaskCard Component
 *
 * Task/service item card with checkbox-style multi-select.
 * Shows name, description, and a clear selected/unselected state.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '@/theme';

interface TaskCardProps {
  name: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  categoryName?: string;
}

export function TaskCard({
  name,
  description,
  selected,
  onPress,
  categoryName,
}: TaskCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${name}${selected ? ', selected' : ''}`}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
          {categoryName && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
          )}
        </View>

        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && (
            <Feather name="check" size={14} color={colors.white} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  cardSelected: {
    borderColor: colors.borderSelected,
    backgroundColor: colors.highlightMint,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  nameSelected: {
    color: colors.primary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    marginTop: spacing.sm,
  },
  categoryText: {
    ...typography.micro,
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
