/**
 * Root Index Route
 *
 * Evaluates authentication, email verification, profile completion,
 * and selected tasks to dispatch the user to the correct initial screen.
 */

import React from 'react';
import { Redirect } from 'expo-router';
import { useAppSelector } from '@/store';

export default function Index() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { isProfileComplete } = useAppSelector((state) => state.profile);
  const { selectedTaskIds } = useAppSelector((state) => state.tasks);

  // 1. Unauthenticated users go to login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // 2. Authenticated but unverified email
  if (!user?.isVerified) {
    return (
      <Redirect
        href={{
          pathname: '/(auth)/verify-email',
          params: { email: user?.email ?? '' },
        }}
      />
    );
  }

  // 3. Verified but incomplete profile
  if (!isProfileComplete) {
    return <Redirect href="/(onboarding)/profile" />;
  }

  // 4. Completed profile but no tasks selected
  if (selectedTaskIds.length === 0) {
    return <Redirect href="/(main)/tasks" />;
  }

  // 5. Complete state: verified, profile done, tasks selected
  return <Redirect href="/(main)/home" />;
}
