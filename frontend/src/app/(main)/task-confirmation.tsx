/**
 * Request Details Screen ("Tell us a little more")
 *
 * Implements the general request detail flow:
 * - Back button & category badge
 * - "Tell us a little more" heading & "One or two lines is enough..." subtitle
 * - Multiline description input
 * - Conditional Date [DD/MM/YYYY] & Time (24h) [HH:MM] inputs when urgency is "scheduled"
 * - Sticky "Leave it with us" bottom button
 * - Celebratory completion state upon submission
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  BackHandler,
  KeyboardAvoidingView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, radius, shadows } from '@/theme';
import type { ServiceRequest } from '@/types';
import {
  useAppDispatch,
  useAppSelector,
  setDescription,
  setScheduledDate,
  setScheduledTime,
  resetRequest,
} from '@/store';
import { saveSelectedTaskIds } from '@/utils/storage';
import { useCreateRequestMutation } from '@/services/requestsApi';


export default function TaskConfirmationScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const [createRequest] = useCreateRequestMutation();

  const {
    categories,
    selectedCategoryId,
    completeCategoryAssistance,
    selectedHelpTypeIds,
    selectedActivityIds,
    selectedTiming,
    description: reduxDescription,
    scheduledDate: reduxDate,
    scheduledTime: reduxTime,
  } = useAppSelector((state) => state.tasks);

  // Find active category
  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0];

  // Local form state initialized from Redux (preserves back navigation!)
  const [localDesc, setLocalDesc] = useState(reduxDescription);
  const [localDate, setLocalDate] = useState(reduxDate || '05/10/2026');
  const [localTime, setLocalTime] = useState(reduxTime || '14:30');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleBack = useCallback(() => {
    router.replace('/(main)/task-timing');
  }, [router]);

  useEffect(() => {
    const onBackPress = () => {
      if (!isSubmitted) {
        handleBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => subscription.remove();
  }, [handleBack, isSubmitted]);

  const isScheduled = selectedTiming === 'scheduled';


  // Gather selected activity names for preview tags
  const selectedActivityNames: string[] = [];
  if (completeCategoryAssistance) {
    selectedActivityNames.push(
      activeCategory?.completeAssistanceTitle ||
        `Complete ${activeCategory?.name} assistance`
    );
  }
  activeCategory?.helpTypes?.forEach((ht) => {
    if (selectedHelpTypeIds.includes(ht.id)) {
      selectedActivityNames.push(ht.name);
    }
    ht.activities.forEach((act) => {
      if (selectedActivityIds.includes(act.id)) {
        selectedActivityNames.push(act.name);
      }
    });
  });

  const handleDescChange = (text: string) => {
    setLocalDesc(text);
    dispatch(setDescription(text));
  };

  const handleDateChange = (text: string) => {
    setLocalDate(text);
    dispatch(setScheduledDate(text));
  };

  const handleTimeChange = (text: string) => {
    setLocalTime(text);
    dispatch(setScheduledTime(text));
  };

  const handleSubmit = async () => {
    dispatch(setDescription(localDesc));
    if (isScheduled) {
      dispatch(setScheduledDate(localDate));
      dispatch(setScheduledTime(localTime));
    }

    // Persist to storage
    await saveSelectedTaskIds(selectedActivityIds);

    // Save formal Service Request
    // Save formal Service Request via API
    try {
      const activitiesList = selectedActivityNames.length > 0
        ? selectedActivityNames
        : [activeCategory?.name || 'Complete Assistance'];

      await createRequest({
        categoryName: activeCategory?.name || 'Concierge Service',
        categoryIcon: (activeCategory?.icon as string) || 'check-circle',
        activities: activitiesList,
        timing: selectedTiming,
        scheduledDate: isScheduled ? localDate : undefined,
        scheduledTime: isScheduled ? localTime : undefined,
        notes: localDesc.trim() || undefined,
      }).unwrap();
    } catch (e) {
      console.warn('Failed to save service request to API:', e);
    }

    // Show celebratory completion screen
    setIsSubmitted(true);
  };

  const handleFinishToHome = () => {
    dispatch(resetRequest());
    router.replace('/(main)/home');
  };

  const handleFinishToRequests = () => {
    dispatch(resetRequest());
    router.replace('/(main)/requests');
  };

  // Completion Screen
  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Feather name="check" size={40} color={colors.white} />
            </View>
          </View>

          <Text style={styles.successTitle}>Leave it with us!</Text>
          <Text style={styles.successSubtitle}>
            Your Lifestyle Manager <Text style={styles.boldText}>Pilot LM</Text>{' '}
            has received your request for{' '}
            <Text style={styles.boldText}>{activeCategory?.name}</Text>. We are
            organizing everything and will keep you updated with proof when it
            matters.
          </Text>

          {/* Request Recap Card */}
          <View style={styles.recapCard}>
            <View style={styles.recapRow}>
              <Text style={styles.recapLabel}>Timing</Text>
              <Text style={styles.recapValue}>
                {selectedTiming === 'same_day'
                  ? 'Same day'
                  : selectedTiming === 'express'
                  ? 'Express'
                  : selectedTiming === 'scheduled'
                  ? `Scheduled (${localDate} at ${localTime})`
                  : 'Standard'}
              </Text>
            </View>

            {localDesc.trim().length > 0 && (
              <View style={[styles.recapRow, { borderTopWidth: 1, borderTopColor: colors.surfaceElevated, paddingTop: 10 }]}>
                <Text style={styles.recapLabel}>Notes</Text>
                <Text style={styles.recapValue} numberOfLines={2}>
                  {localDesc}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.successActionButtons}>
            <TouchableOpacity
              style={styles.doneButton}
              activeOpacity={0.85}
              onPress={handleFinishToRequests}
            >
              <Feather name="clipboard" size={18} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.doneButtonText}>View in Requests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeSecondaryButton}
              activeOpacity={0.8}
              onPress={handleFinishToHome}
            >
              <Text style={styles.homeSecondaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={true}
          >
            {/* Top Bar: < Back link */}
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

            {/* Category Badge */}
            <View style={styles.badgeWrapper}>
              <View style={styles.categoryBadge}>
                <Feather
                  name={activeCategory?.icon as keyof typeof Feather.glyphMap}
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.categoryBadgeText}>
                  {activeCategory?.name}
                </Text>
              </View>
            </View>

            {/* Selected Activities Chips (if any selected) */}
            {selectedActivityNames.length > 0 && (
              <View style={styles.chipsScroll}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsContent}
                >
                  {selectedActivityNames.map((name, idx) => (
                    <View key={idx} style={styles.selectionChip}>
                      <Feather name="check" size={12} color={colors.primary} />
                      <Text style={styles.selectionChipText}>{name}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Heading & Subtitle */}
            <Text style={styles.heading}>Tell us a little more</Text>
            <Text style={styles.subtitle}>
              One or two lines is enough. We'll take it from there.
            </Text>

            {/* Multiline Description Text Area */}
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textAreaInput}
                placeholder="e.g. AC in the guest room is leaking onto the floor"
                placeholderTextColor={colors.textTertiary}
                value={localDesc}
                onChangeText={handleDescChange}
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 150);
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Conditional Scheduled Date & Time Fields */}
            {isScheduled && (
              <View style={styles.scheduledSection}>
                {/* Date Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="calendar"
                      size={18}
                      color={colors.textSecondary}
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor={colors.textTertiary}
                      value={localDate}
                      onChangeText={handleDateChange}
                      onFocus={() => {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 150);
                      }}
                    />
                  </View>
                </View>

                {/* Time Input (24h) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Time (24h)</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="clock"
                      size={18}
                      color={colors.textSecondary}
                      style={styles.fieldIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="HH:MM"
                      placeholderTextColor={colors.textTertiary}
                      value={localTime}
                      onChangeText={handleTimeChange}
                      onFocus={() => {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 150);
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Sticky Leave it with us CTA Bar */}
          <View style={styles.stickyBottomBar}>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.85}
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel="Leave it with us"
            >
              <Text style={styles.submitButtonText}>Leave it with us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 160,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  badgeWrapper: {
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.highlightMint,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  chipsScroll: {
    marginBottom: 16,
  },
  chipsContent: {
    gap: 8,
  },
  selectionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  selectionChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
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
    marginBottom: 20,
  },
  textAreaContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    marginBottom: 24,
    ...shadows.sm,
  },
  textAreaInput: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    flex: 1,
  },
  scheduledSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
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
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  submitButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  // Success Celebration View
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIconOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 320,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recapCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
    gap: 10,
    marginBottom: 32,
    ...shadows.sm,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recapLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recapValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    maxWidth: '70%',
    textAlign: 'right',
  },
  successActionButtons: {
    width: '100%',
    gap: 12,
  },
  doneButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  doneButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  homeSecondaryButton: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeSecondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});

