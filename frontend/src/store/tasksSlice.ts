/**
 * Tasks Redux Slice
 *
 * Manages categories, tasks, selection, and search state.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TasksState, Category, Task } from '@/types';

const initialState: TasksState = {
  categories: [],
  tasks: [],
  selectedCategoryId: null,
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

    toggleTaskSelection(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      const index = state.selectedTaskIds.indexOf(taskId);
      if (index === -1) {
        state.selectedTaskIds.push(taskId);
      } else {
        state.selectedTaskIds.splice(index, 1);
      }
    },

    removeTaskSelection(state, action: PayloadAction<string>) {
      state.selectedTaskIds = state.selectedTaskIds.filter(
        (id) => id !== action.payload,
      );
    },

    setSelectedTaskIds(state, action: PayloadAction<string[]>) {
      state.selectedTaskIds = action.payload;
    },

    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    clearSelections(state) {
      state.selectedTaskIds = [];
    },

    clearTasksState(state) {
      state.categories = [];
      state.tasks = [];
      state.selectedCategoryId = null;
      state.selectedTaskIds = [];
      state.searchQuery = '';
      state.isLoading = false;
      state.error = null;
    },

    /** Hydrate selected tasks from persisted storage */
    hydrateSelectedTasks(state, action: PayloadAction<string[]>) {
      state.selectedTaskIds = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setCategories,
  setTasks,
  setSelectedCategory,
  toggleTaskSelection,
  removeTaskSelection,
  setSelectedTaskIds,
  setSearchQuery,
  clearSelections,
  clearTasksState,
  hydrateSelectedTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
