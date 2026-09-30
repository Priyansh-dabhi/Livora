/**
 * Main App Route Group Layout
 */

import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="tasks" />
      <Stack.Screen name="task-confirmation" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
