/**
 * Task Discovery & Selection Screen
 *
 * Allows users to browse categories, search across services,
 * multi-select tasks, and proceed to confirmation.
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import {
  Header,
  SearchInput,
  CategoryCard,
  TaskCard,
  BottomAction,
  Button,
  EmptyState,
  LoadingState,
  ErrorState,
} from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import {
  useAppDispatch,
  useAppSelector,
  setCategories,
  setTasks,
  setSelectedCategory,
  toggleTaskSelection,
  clearSelections,
  setSearchQuery,
  setTasksLoading,
  setTasksError,
} from '@/store';
import { getCategories, getTasks } from '@/services/mockTaskService';
import type { Task, Category } from '@/types';

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TasksScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    categories,
    tasks,
    selectedCategoryId,
    selectedTaskIds,
    searchQuery,
    isLoading,
    error,
  } = useAppSelector((state) => state.tasks);

  const profile = useAppSelector((state) => state.profile.profile);
  const user = useAppSelector((state) => state.auth.user);
  const greeting = getTimeOfDayGreeting();
  const displayName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Priyansh';

  // 1. Fetch categories and tasks on initial load if not populated
  useEffect(() => {
    async function loadData() {
      if (categories.length > 0 && tasks.length > 0) return;

      dispatch(setTasksLoading(true));
      try {
        const [cats, taskList] = await Promise.all([
          getCategories(),
          getTasks(),
        ]);
        dispatch(setCategories(cats));
        dispatch(setTasks(taskList));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load services';
        dispatch(setTasksError(message));
      } finally {
        dispatch(setTasksLoading(false));
      }
    }

    loadData();
  }, [categories.length, tasks.length, dispatch]);

  // 2. Map category IDs to category names for fast badge lookups
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // 3. Filter tasks by search query (global) or selected category
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query.length > 0) {
      // Global search across all categories
      return tasks.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          (categoryMap.get(t.categoryId)?.toLowerCase().includes(query) ?? false),
      );
    }

    if (selectedCategoryId) {
      return tasks.filter((t) => t.categoryId === selectedCategoryId);
    }

    // Default: show all tasks
    return tasks;
  }, [tasks, searchQuery, selectedCategoryId, categoryMap]);

  // 4. Handlers
  const handleCategoryPress = useCallback(
    (catId: string) => {
      // Toggle category selection: if already selected, clear to show all
      if (selectedCategoryId === catId) {
        dispatch(setSelectedCategory(null));
      } else {
        dispatch(setSelectedCategory(catId));
      }
    },
    [selectedCategoryId, dispatch],
  );

  const handleTaskToggle = useCallback(
    (taskId: string) => {
      dispatch(toggleTaskSelection(taskId));
    },
    [dispatch],
  );

  const handleClearSearch = useCallback(() => {
    dispatch(setSearchQuery(''));
  }, [dispatch]);

  const handleProceed = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    router.push('/(main)/task-confirmation');
  }, [selectedTaskIds.length, router]);

  const selectedCount = selectedTaskIds.length;
  const isSearchActive = searchQuery.trim().length > 0;
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  // 5. Header Component for FlatList
  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Intro text */}
      <View style={styles.introSection}>
        <Text style={styles.headline}>What do you need help with?</Text>
        <Text style={styles.subtitle}>
          Select one or more services to build your customized lifestyle package.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <SearchInput
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
          placeholder="AC leaking, cook for weekends..."
        />
      </View>

      {/* Helpful Instructions */}
      <View style={styles.instructionBanner}>
        <Feather name="info" size={16} color={colors.primary} />
        <Text style={styles.instructionText}>
          Tap any service card to select it. When ready, tap Continue below to review and finalize.
        </Text>
      </View>

      {/* Categories Horizontal Carousel */}
      <View style={styles.categorySection}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>POPULAR WITH FAMILIES LIKE YOURS</Text>
          {selectedCategoryId && !isSearchActive && (
            <TouchableOpacity
              onPress={() => dispatch(setSelectedCategory(null))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearFilterText}>Show All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id && !isSearchActive;
            return (
              <View key={category.id} style={styles.categoryCardWrapper}>
                <CategoryCard
                  name={category.name}
                  icon={category.icon as keyof typeof Feather.glyphMap}
                  taskCount={category.taskCount}
                  selected={isSelected}
                  onPress={() => handleCategoryPress(category.id)}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Filter Title */}
      <View style={styles.filterStatusRow}>
        <Text style={styles.taskSectionTitle}>
          {isSearchActive
            ? `Search Results (${filteredTasks.length})`
            : activeCategory
            ? `${activeCategory.name} (${filteredTasks.length})`
            : `All Services (${filteredTasks.length})`}
        </Text>

        {selectedCount > 0 && (
          <TouchableOpacity
            onPress={() => dispatch(clearSelections())}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearSelectionsText}>Clear selection</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // 6. Loading and Error Guards
  if (isLoading && tasks.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Discover Tasks" />
        <LoadingState message="Loading available services..." />
      </SafeAreaView>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Discover Tasks" />
        <ErrorState
          message={error}
          onRetry={async () => {
            dispatch(setTasksLoading(true));
            try {
              const [cats, taskList] = await Promise.all([
                getCategories(),
                getTasks(),
              ]);
              dispatch(setCategories(cats));
              dispatch(setTasks(taskList));
            } catch {
              dispatch(setTasksError('Failed to reload services.'));
            } finally {
              dispatch(setTasksLoading(false));
            }
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title={`${greeting}, ${displayName}`}
        showBack
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('/(main)/home');
          }
        }}
        rightAction={
          <View style={styles.headerRightRow}>
            {selectedCount > 0 && (
              <View style={styles.selectedCountBadge}>
                <Text style={styles.selectedCountBadgeText}>{selectedCount}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => router.push('/(main)/profile')}
              style={styles.personIconButton}
              accessibilityLabel="View and edit profile"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="user" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        }
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedTaskIds.includes(item.id);
          return (
            <TaskCard
              name={item.name}
              description={item.description}
              selected={isSelected}
              onPress={() => handleTaskToggle(item.id)}
              categoryName={
                !selectedCategoryId || isSearchActive
                  ? categoryMap.get(item.categoryId)
                  : undefined
              }
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="No services found"
            subtitle={
              isSearchActive
                ? `No tasks matched "${searchQuery}". Try a different keyword.`
                : 'No services available in this category.'
            }
            actionLabel={isSearchActive ? 'Clear Search' : 'View All Categories'}
            onAction={
              isSearchActive
                ? handleClearSearch
                : () => dispatch(setSelectedCategory(null))
            }
          />
        }
      />

      {/* Fixed Bottom Action CTA */}
      <BottomAction>
        <Button
          label={
            selectedCount === 0
              ? 'Select Services to Continue'
              : `Continue (${selectedCount} selected)`
          }
          onPress={handleProceed}
          disabled={selectedCount === 0}
          fullWidth
          size="lg"
          icon="arrow-right"
          iconPosition="right"
        />
      </BottomAction>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  listHeader: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  introSection: {
    marginBottom: spacing.lg,
  },
  headline: {
    ...typography.h2,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  searchSection: {
    marginBottom: spacing.xl,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  clearFilterText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  categoryScroll: {
    gap: spacing.md,
    paddingRight: spacing.screenHorizontal,
  },
  categoryCardWrapper: {
    width: 156,
  },
  filterStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  taskSectionTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  clearSelectionsText: {
    ...typography.captionMedium,
    color: colors.error,
  },
  selectedCountBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  selectedCountBadgeText: {
    ...typography.micro,
    color: colors.white,
    fontWeight: '700',
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  personIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.highlightMint,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  instructionText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
});
