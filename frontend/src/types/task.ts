/**
 * Task & Category type definitions
 */

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  taskCount: number;
}

export interface Task {
  id: string;
  name: string;
  categoryId: string;
  description: string;
}

export interface TasksState {
  categories: Category[];
  tasks: Task[];
  selectedCategoryId: string | null;
  selectedTaskIds: string[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}
