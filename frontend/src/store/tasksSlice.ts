/**
 * Tasks & Service Request Redux Slice
 *
 * Manages category, 3-level selections (complete assistance, help types, detailed activities),
 * urgency timing, and description/schedule request state.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TasksState, Category, Task, TimingOptionId } from '@/types';
import { SERVICE_CATEGORIES, ALL_FLATTENED_TASKS } from '@/constants/serviceCatalog';

const initialState: TasksState = {
  categories: SERVICE_CATEGORIES,
  tasks: ALL_FLATTENED_TASKS,
  selectedCategoryId: 'cat-errands',
  completeCategoryAssistance: false,
  selectedHelpTypeIds: [],
  selectedActivityIds: [],
  selectedTiming: 'standard',
  description: '',
  scheduledDate: '',
  scheduledTime: '',
  selectedTaskIds: [],
  searchQuery: '',
  isLoading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedCategoryId = action.payload;
    },

    toggleCompleteAssistance(state) {
      state.completeCategoryAssistance = !state.completeCategoryAssistance;
    },

    setCompleteAssistance(state, action: PayloadAction<boolean>) {
      state.completeCategoryAssistance = action.payload;
    },

    toggleHelpType(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.selectedHelpTypeIds.indexOf(id);
      if (index === -1) {
        state.selectedHelpTypeIds.push(id);
      } else {
        state.selectedHelpTypeIds.splice(index, 1);
      }
    },

    toggleActivity(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.selectedActivityIds.indexOf(id);
      if (index === -1) {
        state.selectedActivityIds.push(id);
        if (!state.selectedTaskIds.includes(id)) {
          state.selectedTaskIds.push(id);
        }
      } else {
        state.selectedActivityIds.splice(index, 1);
        state.selectedTaskIds = state.selectedTaskIds.filter((tId) => tId !== id);
      }
    },

    selectAllActivitiesForHelpType(
      state,
      action: PayloadAction<{ helpTypeId: string; activityIds: string[] }>
    ) {
      const { helpTypeId, activityIds } = action.payload;
      // Ensure help type is selected
      if (!state.selectedHelpTypeIds.includes(helpTypeId)) {
        state.selectedHelpTypeIds.push(helpTypeId);
      }
      // Add all activity IDs
      activityIds.forEach((id) => {
        if (!state.selectedActivityIds.includes(id)) {
          state.selectedActivityIds.push(id);
        }
        if (!state.selectedTaskIds.includes(id)) {
          state.selectedTaskIds.push(id);
        }
      });
    },

    deselectAllActivitiesForHelpType(
      state,
      action: PayloadAction<{ helpTypeId: string; activityIds: string[] }>
    ) {
      const { activityIds } = action.payload;
      state.selectedActivityIds = state.selectedActivityIds.filter(
        (id) => !activityIds.includes(id)
      );
      state.selectedTaskIds = state.selectedTaskIds.filter(
        (id) => !activityIds.includes(id)
      );
    },

    setSelectedTiming(state, action: PayloadAction<TimingOptionId>) {
      state.selectedTiming = action.payload;
    },

    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },

    setScheduledDate(state, action: PayloadAction<string>) {
      state.scheduledDate = action.payload;
    },

    setScheduledTime(state, action: PayloadAction<string>) {
      state.scheduledTime = action.payload;
    },

    // Legacy compatibility: toggle task selection
    toggleTaskSelection(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      const index = state.selectedTaskIds.indexOf(taskId);
      if (index === -1) {
        state.selectedTaskIds.push(taskId);
        if (!state.selectedActivityIds.includes(taskId)) {
          state.selectedActivityIds.push(taskId);
        }
      } else {
        state.selectedTaskIds.splice(index, 1);
        state.selectedActivityIds = state.selectedActivityIds.filter((id) => id !== taskId);
      }
    },

    removeTaskSelection(state, action: PayloadAction<string>) {
      state.selectedTaskIds = state.selectedTaskIds.filter((id) => id !== action.payload);
      state.selectedActivityIds = state.selectedActivityIds.filter((id) => id !== action.payload);
    },

    setSelectedTaskIds(state, action: PayloadAction<string[]>) {
      state.selectedTaskIds = action.payload;
      state.selectedActivityIds = action.payload;
    },

    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    clearSelections(state) {
      state.completeCategoryAssistance = false;
      state.selectedHelpTypeIds = [];
      state.selectedActivityIds = [];
      state.selectedTaskIds = [];
    },

    resetRequest(state) {
      state.completeCategoryAssistance = false;
      state.selectedHelpTypeIds = [];
      state.selectedActivityIds = [];
      state.selectedTiming = 'standard';
      state.description = '';
      state.scheduledDate = '';
      state.scheduledTime = '';
      state.selectedTaskIds = [];
    },

    clearTasksState(state) {
      state.categories = SERVICE_CATEGORIES;
      state.tasks = ALL_FLATTENED_TASKS;
      state.selectedCategoryId = 'cat-errands';
      state.completeCategoryAssistance = false;
      state.selectedHelpTypeIds = [];
      state.selectedActivityIds = [];
      state.selectedTiming = 'standard';
      state.description = '';
      state.scheduledDate = '';
      state.scheduledTime = '';
      state.selectedTaskIds = [];
      state.searchQuery = '';
      state.isLoading = false;
      state.error = null;
    },

    hydrateSelectedTasks(state, action: PayloadAction<string[]>) {
      state.selectedTaskIds = action.payload;
      state.selectedActivityIds = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setCategories,
  setTasks,
  setSelectedCategory,
  toggleCompleteAssistance,
  setCompleteAssistance,
  toggleHelpType,
  toggleActivity,
  selectAllActivitiesForHelpType,
  deselectAllActivitiesForHelpType,
  setSelectedTiming,
  setDescription,
  setScheduledDate,
  setScheduledTime,
  toggleTaskSelection,
  removeTaskSelection,
  setSelectedTaskIds,
  setSearchQuery,
  clearSelections,
  resetRequest,
  clearTasksState,
  hydrateSelectedTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
