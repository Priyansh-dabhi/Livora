/**
 * Task Confirmation Screen
 *
 * Review selected services before finalizing. Allows removing tasks,
 * navigating back to add more, and confirming to save and land on Home.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import {
  Header,
  BottomAction,
  Button,
  Badge,
  EmptyState,
  LoadingState,
  Input,
} from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import {
  useAppDispatch,
  useAppSelector,
  removeTaskSelection,
  setCategories,
  setTasks,
  setTasksLoading,
} from '@/store';
import {
  getCategories,
  getTasks,
  saveSelectedTasks,
} from '@/services/mockTaskService';
import { saveSelectedTaskIds } from '@/utils/storage';
import type { Task } from '@/types';

const TIMING_OPTIONS = [
  { id: 'standard', title: 'Standard', desc: '2-3 days', icon: 'calendar' },
  { id: 'same_day', title: 'Same Day', desc: 'Delivered today', icon: 'zap' },
  { id: 'express', title: 'Express', desc: '2-4 hrs', icon: 'clock' },
  { id: 'scheduled', title: 'Scheduled', desc: 'Pick your slot', icon: 'check-square' },
] as const;

export default function TaskConfirmationScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    categories,
    tasks,
    selectedTaskIds,
    selectedTiming: reduxTiming,
    isLoading,
  } = useAppSelector((state) => state.tasks);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedTiming, setSelectedTiming] = useState<string>(
    reduxTiming || 'standard'
  );
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Fetch categories and tasks if not already loaded in Redux
  useEffect(() => {
    async function ensureData() {
      if (categories.length > 0 && tasks.length > 0) return;

      dispatch(setTasksLoading(true));
      try {
        const [cats, taskList] = await Promise.all([
          getCategories(),
          getTasks(),
        ]);
        dispatch(setCategories(cats));
        dispatch(setTasks(taskList));
      } finally {
        dispatch(setTasksLoading(false));
      }
    }

    ensureData();
  }, [categories.length, tasks.length, dispatch]);

  // Fast category lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // List of selected Task objects
  const selectedTasks = useMemo(() => {
    return tasks.filter((task) => selectedTaskIds.includes(task.id));
  }, [tasks, selectedTaskIds]);

  const handleRemoveTask = (taskId: string) => {
    dispatch(removeTaskSelection(taskId));
  };

  const handleConfirm = async () => {
    if (selectedTaskIds.length === 0) return;

    setIsSubmitting(true);
    try {
      // 1. Call mock API service
      await saveSelectedTasks(selectedTaskIds);

      // 2. Persist to AsyncStorage
      await saveSelectedTaskIds(selectedTaskIds);

      setSuccessMessage('Your services have been confirmed!');

      // 3. Navigate to Home
      setTimeout(() => {
        router.replace('/(main)/home');
      }, 600);
    } catch (err: unknown) {
      console.warn('Failed to save selected tasks:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Confirmation" showBack />
        <LoadingState message="Loading your selections..." />
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Summary Banner */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <View style={styles.summaryIconWrapper}>
            <Feather name="check-circle" size={24} color={colors.primary} />
          </View>
          <View style={styles.summaryTextWrapper}>
            <Text style={styles.summaryTitle}>Review Your Services</Text>
            <Text style={styles.summarySubtitle}>
              {selectedTasks.length === 1
                ? '1 service selected for your household'
                : `${selectedTasks.length} services selected for your household`}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryBottomRow}>
          <Text style={styles.addMorePrompt}>Want to include more?</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.addMoreButton}
            accessibilityRole="button"
            accessibilityLabel="Add more services"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="plus" size={14} color={colors.primary} />
            <Text style={styles.addMoreText}>Add Services</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Banner */}
      {successMessage && (
        <View style={styles.successBanner}>
          <Feather name="check" size={16} color={colors.success} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {selectedTasks.length > 0 && (
        <Text style={styles.sectionHeader}>Selected Services</Text>
      )}
    </View>
  );

  const renderFooter = () => {
    if (selectedTasks.length === 0) return null;

    return (
      <View style={styles.footerContainer}>
        {/* Section: When do you need this? */}
        <Text style={styles.sectionHeader}>When do you need these services?</Text>
        <View style={styles.timingGrid}>
          {TIMING_OPTIONS.map((opt) => {
            const isSelected = selectedTiming === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.timingCard,
                  isSelected && styles.timingCardSelected,
                ]}
                onPress={() => setSelectedTiming(opt.id)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${opt.title}, ${opt.desc}`}
              >
                <View
                  style={[
                    styles.timingIconWrapper,
                    isSelected && styles.timingIconWrapperSelected,
                  ]}
                >
                  <Feather
                    name={opt.icon as keyof typeof Feather.glyphMap}
                    size={16}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.timingTitle,
                    isSelected && styles.timingTitleSelected,
                  ]}
                >
                  {opt.title}
                </Text>
                <Text style={styles.timingDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section: Tell us a little more */}
        <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
          Tell us a little more (Optional)
        </Text>
        <Input
          placeholder="Any special instructions or preferences for your concierge..."
          value={specialNotes}
          onChangeText={setSpecialNotes}
          multiline
          numberOfLines={3}
          leftIcon="message-square"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Review Selections"
        subtitle="Step 2 of 2"
        showBack
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/(main)/profile')}
            style={styles.personIconButton}
            accessibilityLabel="View profile and account"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="user" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={selectedTasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Task }) => {
          const categoryName = categoryMap.get(item.categoryId) || 'General';
          return (
            <View style={styles.taskCard}>
              <View style={styles.taskCardContent}>
                <View style={styles.taskCardHeader}>
                  <Badge label={categoryName} variant="primary" />
                  <TouchableOpacity
                    onPress={() => handleRemoveTask(item.id)}
                    style={styles.removeButton}
                    accessibilityLabel={`Remove ${item.name}`}
                    accessibilityRole="button"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="x" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.taskName}>{item.name}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="shopping-bag"
            title="No services selected"
            subtitle="You have removed all services. Go back to browse and select services for your home."
            actionLabel="Browse Services"
            onAction={() => router.back()}
          />
        }
      />

      {/* Fixed Bottom CTA */}
      <BottomAction>
        <Button
          label={
            selectedTasks.length === 0
              ? 'Select Services to Confirm'
              : `Confirm & Finalize (${selectedTasks.length})`
          }
          onPress={handleConfirm}
          loading={isSubmitting}
          disabled={selectedTasks.length === 0}
          fullWidth
          size="lg"
          icon="check"
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
    paddingBottom: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextWrapper: {
    flex: 1,
  },
  summaryTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  summarySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  summaryBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addMorePrompt: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  addMoreText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  successText: {
    ...typography.caption,
    color: colors.success,
  },
  sectionHeader: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  taskCardContent: {
    flex: 1,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskName: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  taskDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footerContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  timingCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  timingCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.highlightMint,
  },
  timingIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  timingIconWrapperSelected: {
    backgroundColor: colors.white,
  },
  timingTitle: {
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
  timingTitleSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  timingDesc: {
    ...typography.micro,
    color: colors.textSecondary,
    marginTop: 2,
  },
  personIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
});
