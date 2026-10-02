/**
 * Not Found / Fallback Route
 *
 * Catches any unmatched route and provides a graceful recovery back to the app.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '@/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="compass" size={48} color={colors.primary} />
        </View>

        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>
          The screen you are looking for doesn't exist or has moved.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <Feather name="home" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>Return to Livora</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  buttonText: {
    ...typography.button,
    color: '#FFFFFF',
  },
});
