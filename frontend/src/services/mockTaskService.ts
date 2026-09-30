/**
 * Mock Task Service
 *
 * Simulates backend task API with realistic delays.
 * Replace with real API calls during backend integration.
 */

import type { Category, Task } from '@/types';
import { MOCK_CATEGORIES, MOCK_TASKS } from '@/constants';

/** Simulated network delay */
function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all categories */
export async function getCategories(): Promise<Category[]> {
  await delay(400);
  return MOCK_CATEGORIES;
}

/** Fetch all tasks */
export async function getTasks(): Promise<Task[]> {
  await delay(500);
  return MOCK_TASKS;
}

/** Save selected task IDs (in real app, POST to server) */
export async function saveSelectedTasks(taskIds: string[]): Promise<void> {
  await delay(300);
  // In real app, persist selections to server
}

/** Get previously selected task IDs (in real app, GET from server) */
export async function getSelectedTasks(): Promise<string[]> {
  await delay(300);
  // In real app, fetch from server.
  // Mock: return empty (no prior selections)
  return [];
}
