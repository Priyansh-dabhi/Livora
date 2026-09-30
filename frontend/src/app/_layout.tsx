/**
 * Root Layout
 *
 * Sets up Redux Provider, SafeAreaProvider, session hydration, and navigation stack.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import {
  store,
  useAppDispatch,
  hydrateAuth,
  hydrateProfile,
  hydrateOnboarding,
  hydrateSelectedTasks,
  hydrateWelcome,
} from '@/store';
import {
  getSession,
  getProfileData,
  getOnboardingComplete,
  getSelectedTaskIds,
  getWelcomeSeen,
} from '@/utils/storage';
import { colors, typography, spacing, radius } from '@/theme';

function AppContent() {
  const dispatch = useAppDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function hydrateApp() {
      try {
        const [session, profile, onboarding, selectedTasks, welcomeSeen] =
          await Promise.all([
            getSession(),
            getProfileData(),
            getOnboardingComplete(),
            getSelectedTaskIds(),
            getWelcomeSeen(),
          ]);

        dispatch(hydrateWelcome(welcomeSeen));

        if (session) {
          dispatch(hydrateAuth(session));
        }
        if (profile) {
          dispatch(hydrateProfile(profile));
        }
        dispatch(hydrateOnboarding(onboarding));
        if (selectedTasks.length > 0) {
          dispatch(hydrateSelectedTasks(selectedTasks));
        }
      } catch (error) {
        // Fallback to initial state if storage reading fails
        console.warn('Failed to hydrate app state from storage:', error);
      } finally {
        setIsHydrated(true);
      }
    }

    hydrateApp();
  }, [dispatch]);

  if (!isHydrated) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoBadge}>
          <Feather name="feather" size={36} color={colors.primary} />
        </View>
        <Text style={styles.splashTitle}>Livora</Text>
        <Text style={styles.splashSubtitle}>Lifestyle Management</Text>
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.splashSpinner}
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(welcome)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  splashTitle: {
    ...typography.display,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  splashSpinner: {
    marginTop: spacing.xxl,
  },
});
