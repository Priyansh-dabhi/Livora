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

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, radius, shadows } from '@/theme';
import {
  useAppDispatch,
  useAppSelector,
  setDescription,
  setScheduledDate,
  setScheduledTime,
  resetRequest,
} from '@/store';
import { saveSelectedTaskIds } from '@/utils/storage';

export default function TaskConfirmationScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

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

    // Show celebratory completion screen
    setIsSubmitted(true);
  };

  const handleFinishToHome = () => {
    dispatch(resetRequest());
    router.replace('/(main)/home');
  };

  // Completion Screen
  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Feather name="check" size={40} color="#FFFFFF" />
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
              <View style={[styles.recapRow, { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 }]}>
                <Text style={styles.recapLabel}>Notes</Text>
                <Text style={styles.recapValue} numberOfLines={2}>
                  {localDesc}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            activeOpacity={0.85}
            onPress={handleFinishToHome}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
    paddingBottom: 110,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  selectionChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1D2B',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1D2B',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    marginBottom: 24,
    ...shadows.sm,
  },
  textAreaInput: {
    fontSize: 16,
    color: '#1A1D2B',
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
    color: '#1A1D2B',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#1A1D2B',
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
    borderTopColor: 'rgba(229, 231, 235, 0.6)',
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
    color: '#FFFFFF',
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
    color: '#1A1D2B',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 320,
  },
  boldText: {
    fontWeight: '700',
    color: '#1A1D2B',
  },
  recapCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#6B7280',
  },
  recapValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D2B',
    maxWidth: '70%',
    textAlign: 'right',
  },
  doneButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
