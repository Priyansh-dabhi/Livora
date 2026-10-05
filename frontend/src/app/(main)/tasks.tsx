/**
 * Task / Service Selection Screen
 *
 * Implements 3-level data hierarchy:
 * 1. Category (selected on entry)
 * 2. "Complete Category Assistance" top-level option
 * 3. Help Types (card with preview summary + expand/collapse)
 *    -> Expanded: "Select all (N)", dynamic "X of N" count, individual activity checkboxes
 *
 * Sticky "Continue" button allows proceeding with category only or any combination of selections.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, radius, shadows } from '@/theme';
import {
  useAppDispatch,
  useAppSelector,
  setSelectedCategory,
  toggleCompleteAssistance,
  toggleHelpType,
  toggleActivity,
  selectAllActivitiesForHelpType,
  deselectAllActivitiesForHelpType,
} from '@/store';
import type { ServiceCategory, HelpType, DetailedActivity } from '@/types';

export default function TasksScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    categories,
    selectedCategoryId,
    completeCategoryAssistance,
    selectedHelpTypeIds,
    selectedActivityIds,
  } = useAppSelector((state) => state.tasks);

  // Active expanded category: use selectedCategoryId from Redux (can be null when all closed)
  const activeCategoryId = selectedCategoryId;
  const activeCategory = activeCategoryId
    ? categories.find((c: ServiceCategory) => c.id === activeCategoryId)
    : null;
  const isCategoryComingSoon = !!activeCategory?.isComingSoon;
  const isContinueDisabled = !activeCategoryId || isCategoryComingSoon;

  const handleBack = useCallback(() => {
    router.replace('/(main)/home');
  }, [router]);

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => subscription.remove();
  }, [handleBack]);

  // Set of expanded help type IDs for accordion toggle (auto-expand any that have selected activities)
  const [expandedHelpTypeIds, setExpandedHelpTypeIds] = useState<string[]>(() => {
    const initial: string[] = [];
    if (activeCategory) {
      activeCategory.helpTypes.forEach((ht: HelpType) => {
        if (
          ht.activities.some((act: DetailedActivity) =>
            selectedActivityIds.includes(act.id)
          ) ||
          selectedHelpTypeIds.includes(ht.id)
        ) {
          initial.push(ht.id);
        }
      });
    }
    return initial;
  });


  const handleToggleCategory = (catId: string) => {
    if (activeCategoryId === catId) {
      dispatch(setSelectedCategory(null));
    } else {
      dispatch(setSelectedCategory(catId));
    }
  };

  const handleToggleExpandHelpType = (helpTypeId: string) => {
    setExpandedHelpTypeIds((prev) =>
      prev.includes(helpTypeId)
        ? prev.filter((id) => id !== helpTypeId)
        : [...prev, helpTypeId]
    );
  };

  const handleSelectAllHelpType = (helpType: HelpType) => {
    const activityIds = helpType.activities.map((a: DetailedActivity) => a.id);
    const allSelected = activityIds.every((id: string) =>
      selectedActivityIds.includes(id)
    );

    if (allSelected) {
      dispatch(
        deselectAllActivitiesForHelpType({
          helpTypeId: helpType.id,
          activityIds,
        })
      );
    } else {
      dispatch(
        selectAllActivitiesForHelpType({
          helpTypeId: helpType.id,
          activityIds,
        })
      );
    }
  };

  // Calculate total selected count
  const totalSelectedCount =
    (completeCategoryAssistance ? 1 : 0) +
    selectedHelpTypeIds.length +
    selectedActivityIds.length;

  const handleContinue = () => {
    if (!activeCategoryId) {
      Alert.alert(
        'Please Select a Service',
        'Please tap and select a service category before continuing.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (isCategoryComingSoon) {
      Alert.alert(
        'Coming Soon',
        `${activeCategory?.name || 'This service'} is coming soon. Requests cannot be submitted for this service yet.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (!completeCategoryAssistance && (selectedActivityIds.length + selectedHelpTypeIds.length > 1)) {
      router.push('/(main)/task-multi-details');
    } else {
      router.push('/(main)/task-timing');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar: < Back link and profile icon */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="chevron-left" size={20} color={colors.primary} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

          </View>

          {/* Heading & Subtitle */}
          <Text style={styles.heading}>What do you need help with?</Text>
          <Text style={styles.subtitle}>
            Pick a category, then choose a service. You can add details next.
          </Text>

          {/* Accordion List of Categories */}
          <View style={styles.categoryList}>
            {categories.map((category: ServiceCategory) => {
              const isCategoryExpanded = activeCategoryId === category.id;

              if (!isCategoryExpanded) {
                // Collapsed category card
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryCardCollapsed}
                    activeOpacity={0.8}
                    onPress={() => handleToggleCategory(category.id)}
                  >
                    <View style={styles.categoryIconSquareCollapsed}>
                      <Feather
                        name={category.icon as keyof typeof Feather.glyphMap}
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.categoryHeaderTexts}>
                      <View style={styles.titleWithBadgeRow}>
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                        <View style={styles.badgeAndChevronRow}>
                          {category.isComingSoon && (
                            <View style={styles.comingSoonBadge}>
                              <Text style={styles.comingSoonBadgeText}>
                                Coming soon
                              </Text>
                            </View>
                          )}
                          <Feather
                            name="chevron-down"
                            size={18}
                            color={colors.textSecondary}
                          />
                        </View>
                      </View>
                      <Text style={styles.categoryDesc} numberOfLines={2}>
                        {category.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }

              // Active / Expanded Category Card
              return (
                <View key={category.id} style={styles.categoryCardExpanded}>
                  {/* Left Golden Accent Stripe */}
                  <View style={styles.accentStripe} />

                  {/* Header / Clickable Area */}
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    activeOpacity={0.8}
                    onPress={() => handleToggleCategory(category.id)}
                  >
                    <View style={styles.categoryIconSquareExpanded}>
                      <Feather
                        name={category.icon as keyof typeof Feather.glyphMap}
                        size={20}
                        color="#FFFFFF"
                      />
                    </View>

                    <View style={styles.categoryHeaderTexts}>
                      <View style={styles.titleWithBadgeRow}>
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                        <View style={styles.badgeAndChevronRow}>
                          {category.isComingSoon && (
                            <View style={styles.comingSoonBadge}>
                              <Text style={styles.comingSoonBadgeText}>
                                Coming soon
                              </Text>
                            </View>
                          )}
                          <Feather
                            name="chevron-up"
                            size={18}
                            color={colors.primary}
                          />
                        </View>
                      </View>
                      <Text style={styles.categoryDesc}>
                        {category.description}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Coming Soon Notice Banner if applicable */}
                  {category.isComingSoon && (
                    <View style={styles.comingSoonBanner}>
                      <Feather
                        name="clock"
                        size={15}
                        color="#92400E"
                        style={styles.comingSoonBannerIcon}
                      />
                      <Text style={styles.comingSoonBannerText}>
                        This service is coming soon. You can explore activities below, but requests cannot be submitted yet.
                      </Text>
                    </View>
                  )}

                  {/* Complete Category Assistance Card (Option Level 2) */}
                  <View style={styles.completeAssistanceContainer}>
                    <TouchableOpacity
                      style={[
                        styles.completeAssistanceCard,
                        completeCategoryAssistance &&
                          styles.completeAssistanceCardActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => dispatch(toggleCompleteAssistance())}
                    >
                      <View
                        style={[
                          styles.customCheckbox,
                          completeCategoryAssistance &&
                            styles.customCheckboxChecked,
                        ]}
                      >
                        {completeCategoryAssistance && (
                          <Feather name="check" size={14} color="#FFFFFF" />
                        )}
                      </View>

                      <View style={styles.completeAssistanceTextCol}>
                        <Text style={styles.completeAssistanceTitle}>
                          {category.completeAssistanceTitle ||
                            `Complete ${category.name} assistance`}
                        </Text>
                        <Text style={styles.completeAssistanceDesc}>
                          {category.completeAssistanceDesc ||
                            'Help across this whole area. You can still pick specific services.'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* WHAT KIND OF HELP? Section */}
                  <View style={styles.helpTypesSection}>
                    <Text style={styles.sectionHeaderLabel}>
                      WHAT KIND OF HELP?
                    </Text>

                    {/* Help Type Cards Stack */}
                    <View style={styles.helpTypesList}>
                      {category.helpTypes.map((helpType: HelpType) => {
                        const isHelpTypeExpanded = expandedHelpTypeIds.includes(
                          helpType.id
                        );
                        const isHelpTypeSelected = selectedHelpTypeIds.includes(
                          helpType.id
                        );

                        // Activities count
                        const totalActivities = helpType.activities.length;
                        const selectedActivitiesCount =
                          helpType.activities.filter((act: DetailedActivity) =>
                            selectedActivityIds.includes(act.id)
                          ).length;
                        const isAllSelected =
                          totalActivities > 0 &&
                          selectedActivitiesCount === totalActivities;
                        const isPartiallySelected =
                          selectedActivitiesCount > 0 && !isAllSelected;

                        return (
                          <View
                            key={helpType.id}
                            style={[
                              styles.helpTypeCard,
                              (isHelpTypeSelected || isHelpTypeExpanded) &&
                                styles.helpTypeCardActive,
                            ]}
                          >
                            {/* Help Type Main Header */}
                            <View style={styles.helpTypeHeaderRow}>
                              {/* Checkbox for Help Type */}
                              <TouchableOpacity
                                style={styles.checkboxTouchable}
                                onPress={() =>
                                  dispatch(toggleHelpType(helpType.id))
                                }
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <View
                                  style={[
                                    styles.customCheckbox,
                                    (isHelpTypeSelected || isAllSelected) &&
                                      styles.customCheckboxChecked,
                                    isPartiallySelected &&
                                      styles.customCheckboxPartial,
                                  ]}
                                >
                                  {(isHelpTypeSelected || isAllSelected) && (
                                    <Feather
                                      name="check"
                                      size={14}
                                      color="#FFFFFF"
                                    />
                                  )}
                                  {isPartiallySelected && (
                                    <View style={styles.partialIndicator} />
                                  )}
                                </View>
                              </TouchableOpacity>

                              {/* Title and Summary (Tapping toggles expand) */}
                              <TouchableOpacity
                                style={styles.helpTypeTitleArea}
                                activeOpacity={0.7}
                                onPress={() =>
                                  handleToggleExpandHelpType(helpType.id)
                                }
                              >
                                <Text style={styles.helpTypeTitle}>
                                  {helpType.name}
                                </Text>
                                {helpType.description && !isHelpTypeExpanded && (
                                  <Text
                                    style={styles.helpTypePreview}
                                    numberOfLines={1}
                                  >
                                    {helpType.description}
                                  </Text>
                                )}
                              </TouchableOpacity>

                              {/* Expand/Collapse Chevron Button */}
                              <TouchableOpacity
                                style={styles.chevronButton}
                                onPress={() =>
                                  handleToggleExpandHelpType(helpType.id)
                                }
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <Feather
                                  name={
                                    isHelpTypeExpanded
                                      ? 'chevron-up'
                                      : 'chevron-down'
                                  }
                                  size={18}
                                  color={colors.textSecondary}
                                />
                              </TouchableOpacity>
                            </View>

                            {/* Detailed Activities List (when expanded) */}
                            {isHelpTypeExpanded && (
                              <View style={styles.expandedActivitiesArea}>
                                <View style={styles.activitiesDivider} />

                                {/* "Select all (N)" Row */}
                                {totalActivities > 1 && (
                                  <TouchableOpacity
                                    style={styles.selectAllRow}
                                    activeOpacity={0.7}
                                    onPress={() =>
                                      handleSelectAllHelpType(helpType)
                                    }
                                  >
                                    <View
                                      style={[
                                        styles.customCheckboxSmall,
                                        isAllSelected &&
                                          styles.customCheckboxChecked,
                                        isPartiallySelected &&
                                          styles.customCheckboxPartial,
                                      ]}
                                    >
                                      {isAllSelected && (
                                        <Feather
                                          name="check"
                                          size={12}
                                          color="#FFFFFF"
                                        />
                                      )}
                                      {isPartiallySelected && (
                                        <View
                                          style={styles.partialIndicatorSmall}
                                        />
                                      )}
                                    </View>

                                    <Text style={styles.selectAllLabel}>
                                      Select all ({totalActivities})
                                    </Text>

                                    <Text style={styles.activityCounter}>
                                      {selectedActivitiesCount} of{' '}
                                      {totalActivities}
                                    </Text>
                                  </TouchableOpacity>
                                )}

                                {/* Individual Activities List */}
                                <View style={styles.activitiesList}>
                                  {helpType.activities.map(
                                    (activity: DetailedActivity) => {
                                      const isActivityChecked =
                                        selectedActivityIds.includes(activity.id);

                                    return (
                                      <TouchableOpacity
                                        key={activity.id}
                                        style={styles.activityItemRow}
                                        activeOpacity={0.7}
                                        onPress={() =>
                                          dispatch(toggleActivity(activity.id))
                                        }
                                      >
                                        <View
                                          style={[
                                            styles.customCheckboxSmall,
                                            isActivityChecked &&
                                              styles.customCheckboxChecked,
                                          ]}
                                        >
                                          {isActivityChecked && (
                                            <Feather
                                              name="check"
                                              size={12}
                                              color="#FFFFFF"
                                            />
                                          )}
                                        </View>

                                        <View style={styles.activityTextCol}>
                                          <Text style={styles.activityName}>
                                            {activity.name}
                                          </Text>
                                          {activity.description && (
                                            <Text
                                              style={styles.activityDescription}
                                            >
                                              {activity.description}
                                            </Text>
                                          )}
                                        </View>
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
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Sticky Continue CTA Bar */}
        <View style={styles.stickyBottomBar}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isContinueDisabled && styles.continueButtonDisabled,
            ]}
            activeOpacity={isContinueDisabled ? 0.9 : 0.85}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel={
              isCategoryComingSoon
                ? 'This service is coming soon'
                : !activeCategoryId
                ? 'Select a service to continue'
                : 'Continue to timing'
            }
          >
            <Text
              style={[
                styles.continueButtonText,
                isContinueDisabled && styles.continueButtonTextDisabled,
              ]}
            >
              {isCategoryComingSoon
                ? 'Coming Soon — Unavailable'
                : !activeCategoryId
                ? 'Select a service to continue'
                : totalSelectedCount > 0
                ? `Continue (${totalSelectedCount} selected)`
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
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110, // room for sticky continue button
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
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  categoryList: {
    gap: 16,
  },
  categoryCardCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  categoryCardExpanded: {
    backgroundColor: colors.highlightMint,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 16,
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: colors.accent,
    zIndex: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    paddingLeft: 18,
    gap: 14,
  },
  categoryIconSquareCollapsed: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconSquareExpanded: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryHeaderTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
    flexShrink: 1,
  },
  titleWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  badgeAndChevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  comingSoonBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  comingSoonBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  comingSoonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  comingSoonBannerIcon: {
    marginRight: 8,
  },
  comingSoonBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
    fontWeight: '500',
  },
  categoryDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  completeAssistanceContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingLeft: 20,
  },
  completeAssistanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  completeAssistanceCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  customCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  customCheckboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  customCheckboxPartial: {
    backgroundColor: colors.highlightMint,
    borderColor: colors.primary,
  },
  partialIndicator: {
    width: 10,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  customCheckboxSmall: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  partialIndicatorSmall: {
    width: 8,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  completeAssistanceTextCol: {
    flex: 1,
  },
  completeAssistanceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  completeAssistanceDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  helpTypesSection: {
    paddingHorizontal: 16,
    paddingLeft: 20,
  },
  sectionHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  helpTypesList: {
    gap: 10,
  },
  helpTypeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  helpTypeCardActive: {
    borderColor: colors.border,
  },
  helpTypeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  checkboxTouchable: {
    paddingVertical: 2,
  },
  helpTypeTitleArea: {
    flex: 1,
  },
  helpTypeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  helpTypePreview: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevronButton: {
    padding: 4,
  },
  expandedActivitiesArea: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  activitiesDivider: {
    height: 1,
    backgroundColor: colors.surfaceElevated,
    marginBottom: 10,
  },
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 10,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectAllLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  activityCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 6,
  },
  activitiesList: {
    gap: 8,
    paddingLeft: 4,
  },
  activityItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    gap: 10,
  },
  activityTextCol: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  activityDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
    lineHeight: 16,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  continueButtonDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonTextDisabled: {
    color: colors.disabledText,
  },
});
