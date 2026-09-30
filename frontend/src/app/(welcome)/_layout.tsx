/**
 * Welcome Flow Layout
 */

import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function WelcomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
