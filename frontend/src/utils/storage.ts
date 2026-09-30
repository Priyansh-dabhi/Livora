/**
 * Storage Utilities
 *
 * Thin wrappers around AsyncStorage (general data) and SecureStore (tokens).
 * All persistence goes through here for easy backend migration.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { User, Profile } from '@/types';

// ── Storage Keys ─────────────────────────────────────────
const KEYS = {
  AUTH_TOKEN: 'livora_auth_token',
  USER: 'livora_user',
  PROFILE: 'livora_profile',
  ONBOARDING_COMPLETE: 'livora_onboarding_complete',
  SELECTED_TASKS: 'livora_selected_tasks',
} as const;

// ── Session (Secure) ────────────────────────────────────

export async function saveSession(token: string, user: User): Promise<void> {
  await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export async function getSession(): Promise<{
  token: string;
  user: User;
} | null> {
  const token = await SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
  const userJson = await AsyncStorage.getItem(KEYS.USER);

  if (token && userJson) {
    return { token, user: JSON.parse(userJson) as User };
  }
  return null;
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
  await AsyncStorage.multiRemove([
    KEYS.USER,
    KEYS.PROFILE,
    KEYS.ONBOARDING_COMPLETE,
    KEYS.SELECTED_TASKS,
  ]);
}

// ── Profile ──────────────────────────────────────────────

export async function saveProfileData(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function getProfileData(): Promise<Profile | null> {
  const json = await AsyncStorage.getItem(KEYS.PROFILE);
  return json ? (JSON.parse(json) as Profile) : null;
}

// ── Onboarding ───────────────────────────────────────────

export async function saveOnboardingComplete(
  complete: boolean,
): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, JSON.stringify(complete));
}

export async function getOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
  return value ? (JSON.parse(value) as boolean) : false;
}

// ── Selected Tasks ───────────────────────────────────────

export async function saveSelectedTaskIds(taskIds: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SELECTED_TASKS, JSON.stringify(taskIds));
}

export async function getSelectedTaskIds(): Promise<string[]> {
  const json = await AsyncStorage.getItem(KEYS.SELECTED_TASKS);
  return json ? (JSON.parse(json) as string[]) : [];
}
