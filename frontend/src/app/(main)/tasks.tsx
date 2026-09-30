/**
 * Services / Task Discovery Screen (PadosiPro Replica)
 *
 * Faithfully reproduces the "What do you need help with?" screen:
 * - "< Back" green navigation link
 * - "What do you need help with?" headline
 * - "Pick a category, then choose a service. You can add details next." subtitle
 * - Accordion category cards with golden-yellow accent stripe when expanded
 * - Category sub-service pills ("WHAT KIND OF HELP?")
 * - Sticky dark green "Continue" CTA button
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, radius, shadows } from '@/theme';
import {
  useAppDispatch,
  useAppSelector,
  setCategories,
  setTasks,
  setSelectedCategory,
  toggleTaskSelection,
  clearSelections,
  setTasksLoading,
} from '@/store';
import { getCategories, getTasks } from '@/services/mockTaskService';
import type { Task, Category } from '@/types';

export default function TasksScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    categories,
    tasks,
    selectedCategoryId,
    selectedTaskIds,
    isLoading,
  } = useAppSelector((state) => state.tasks);

  // Active accordion expanded category ID (defaults to selectedCategoryId or 'cat-errands')
  const [expandedCategoryId, setExpandedCategoryId] = useState<string>(
    selectedCategoryId || 'cat-errands'
  );

  // Load categories and tasks if not yet loaded
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
      } catch (err) {
        console.warn('Failed to load services data:', err);
      } finally {
        dispatch(setTasksLoading(false));
      }
    }
    loadData();
  }, [categories.length, tasks.length, dispatch]);

  // Keep expanded category in sync with Redux if set externally
  useEffect(() => {
    if (selectedCategoryId) {
      setExpandedCategoryId(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  // Toggle category accordion
  const handleToggleCategory = (catId: string) => {
    if (expandedCategoryId === catId) {
      // Toggle close or keep open
      setExpandedCategoryId(catId);
    } else {
      setExpandedCategoryId(catId);
      dispatch(setSelectedCategory(catId));
    }
  };

  // Toggle subservice pill selection
  const handleToggleService = (taskId: string) => {
    dispatch(toggleTaskSelection(taskId));
  };

  // Proceed to confirmation screen
  const handleContinue = () => {
    if (selectedTaskIds.length === 0) {
      // If nothing selected yet, select the first task of the current expanded category
      const currentTasks = tasks.filter((t) => t.categoryId === expandedCategoryId);
      if (currentTasks.length > 0) {
        dispatch(toggleTaskSelection(currentTasks[0].id));
      }
    }
    router.push('/(main)/task-confirmation');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar: < Back link */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="chevron-left" size={20} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(main)/profile')}
              style={styles.profileIconButton}
              accessibilityLabel="View profile"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="user" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Heading & Subtitle */}
          <Text style={styles.heading}>What do you need help with?</Text>
          <Text style={styles.subtitle}>
            Pick a category, then choose a service. You can add details next.
          </Text>

          {/* Accordion List of Categories */}
          <View style={styles.categoryList}>
            {categories.map((category) => {
              const isExpanded = expandedCategoryId === category.id;
              const categoryTasks = tasks.filter(
                (t) => t.categoryId === category.id
              );

              return (
                <View
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    isExpanded ? styles.categoryCardExpanded : styles.categoryCardCollapsed,
                  ]}
                >
                  {/* Left Golden Accent Stripe for Expanded Card */}
                  {isExpanded && <View style={styles.accentStripe} />}

                  {/* Header / Clickable Area to Expand/Collapse */}
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    activeOpacity={0.8}
                    onPress={() => handleToggleCategory(category.id)}
                  >
                    <View
                      style={[
                        styles.categoryIconSquare,
                        isExpanded
                          ? styles.categoryIconSquareExpanded
                          : styles.categoryIconSquareCollapsed,
                      ]}
                    >
                      <Feather
                        name={category.icon as keyof typeof Feather.glyphMap}
                        size={20}
                        color={isExpanded ? '#FFFFFF' : colors.primary}
                      />
                    </View>

                    <View style={styles.categoryHeaderTexts}>
                      <Text style={styles.categoryTitle}>{category.name}</Text>
                      <Text style={styles.categoryDesc}>
                        {category.description}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Expanded Sub-Services Section */}
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.subservicesHeader}>
                        WHAT KIND OF HELP?
                      </Text>

                      <View style={styles.pillsContainer}>
                        {categoryTasks.map((task) => {
                          const isSelected = selectedTaskIds.includes(task.id);
                          return (
                            <TouchableOpacity
                              key={task.id}
                              style={[
                                styles.servicePill,
                                isSelected && styles.servicePillSelected,
                              ]}
                              activeOpacity={0.7}
                              onPress={() => handleToggleService(task.id)}
                            >
                              {isSelected && (
                                <Feather
                                  name="check"
                                  size={14}
                                  color="#FFFFFF"
                                  style={styles.pillCheckIcon}
                                />
                              )}
                              <Text
                                style={[
                                  styles.servicePillText,
                                  isSelected && styles.servicePillTextSelected,
                                ]}
                              >
                                {task.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Sticky Continue CTA Bar */}
        <View style={styles.stickyBottomBar}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.85}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue to details"
          >
            <Text style={styles.continueButtonText}>
              {selectedTaskIds.length > 0
                ? `Continue (${selectedTaskIds.length})`
                : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F7',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100, // room for sticky continue button
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 10,
    marginLeft: -4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 2,
  },
  profileIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1D2B',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  categoryList: {
    gap: 14,
  },
  categoryCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryCardCollapsed: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  categoryCardExpanded: {
    backgroundColor: '#F0FAF5',
    borderColor: colors.primary,
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#E2A93B', // Golden accent stripe from screenshot 4
    zIndex: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    paddingLeft: 18,
    gap: 14,
  },
  categoryIconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconSquareCollapsed: {
    backgroundColor: colors.highlightMint,
  },
  categoryIconSquareExpanded: {
    backgroundColor: colors.primary,
  },
  categoryHeaderTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1D2B',
    marginBottom: 3,
  },
  categoryDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  expandedContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingLeft: 22,
  },
  subservicesHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A6B7A',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 4,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  servicePillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillCheckIcon: {
    marginRight: 6,
  },
  servicePillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1D2B',
  },
  servicePillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF9F7',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
