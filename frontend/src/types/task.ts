/**
 * Task, HelpType & Category Type Definitions
 *
 * Supports 3-level data hierarchy:
 * Category -> Help Type -> Detailed Activity
 */

export interface DetailedActivity {
  id: string;
  name: string;
  description?: string;
}

export interface HelpType {
  id: string;
  name: string;
  description?: string;
  activities: DetailedActivity[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  completeAssistanceTitle?: string;
  completeAssistanceDesc?: string;
  isComingSoon?: boolean;
  helpTypes: HelpType[];
}

// Backward-compatible Category interface
export interface Category extends ServiceCategory {
  taskCount?: number;
}

// Backward-compatible Task interface
export interface Task {
  id: string;
  name: string;
  categoryId: string;
  description: string;
}

export type TimingOptionId = 'standard' | 'same_day' | 'express' | 'scheduled';

export type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  categoryName: string;
  categoryIcon: string;
  activities: string[];
  timing: TimingOptionId;
  scheduledDate?: string;
  scheduledTime?: string;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  lifestyleManagerName: string;
}

export interface TasksState {
  categories: Category[];
  tasks: Task[];
  selectedCategoryId: string | null;
  completeCategoryAssistance: boolean;
  selectedHelpTypeIds: string[];
  selectedActivityIds: string[];
  selectedTiming: TimingOptionId;
  description: string;
  multiDescriptions: Record<string, string>;
  scheduledDate: string;
  scheduledTime: string;
  selectedTaskIds: string[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

