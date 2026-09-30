/**
 * ErrorState Component
 *
 * Visual error state with icon, message, and retry button.
 * Never leaves the user at a dead end.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="alert-triangle" size={48} color={colors.error} />
      </View>

      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <View style={styles.actionContainer}>
          <Button
            label={retryLabel}
            onPress={onRetry}
            variant="outline"
            size="sm"
            icon="refresh-cw"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionContainer: {
    marginTop: spacing.xl,
  },
});
