/**
 * Service Timing Screen ("When do you need this?")
 *
 * Exact replica of the PadosiPro timing selection screen:
 * - "< Back" green navigation link
 * - "When do you need this?" headline
 * - "Pick what feels closest. You can always add detail next." subtitle
 * - 4 Timing cards: Standard, Same day, Express, Scheduled
 * - Selected card highlighted with mint background, green border, and golden accent stripe
 * - Sticky dark green "Next" button
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, radius, shadows } from '@/theme';
import { useAppDispatch, useAppSelector, setSelectedTiming } from '@/store';

interface TimingOption {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
}

const TIMING_OPTIONS: TimingOption[] = [
  {
    id: 'standard',
    icon: 'calendar',
    title: 'Standard',
    subtitle: 'Within a few days is fine',
  },
  {
    id: 'same_day',
    icon: 'sun',
    title: 'Same day',
    subtitle: 'Today if possible',
  },
  {
    id: 'express',
    icon: 'zap',
    title: 'Express',
    subtitle: 'As soon as you can',
  },
  {
    id: 'scheduled',
    icon: 'clock',
    title: 'Scheduled',
    subtitle: 'I have a specific time',
  },
];

export default function TaskTimingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentTiming = useAppSelector(
    (state) => state.tasks.selectedTiming || 'standard'
  );
  const [selectedId, setSelectedId] = useState<string>(currentTiming);

  const handleSelectTiming = (id: string) => {
    setSelectedId(id);
    dispatch(setSelectedTiming(id));
  };

  const handleNext = () => {
    dispatch(setSelectedTiming(selectedId));
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
          </View>

          {/* Heading & Subtitle */}
          <Text style={styles.heading}>When do you need this?</Text>
          <Text style={styles.subtitle}>
            Pick what feels closest. You can always add detail next.
          </Text>

          {/* Timing Options Stack */}
          <View style={styles.optionsList}>
            {TIMING_OPTIONS.map((option) => {
              const isSelected = selectedId === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected
                      ? styles.optionCardSelected
                      : styles.optionCardUnselected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleSelectTiming(option.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${option.title}, ${option.subtitle}`}
                >
                  {/* Left Golden Accent Stripe for Selected Card */}
                  {isSelected && <View style={styles.accentStripe} />}

                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    <Feather
                      name={option.icon}
                      size={22}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </View>

                  {/* Texts */}
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.optionTitleSelected,
                      ]}
                    >
                      {option.title}
                    </Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Sticky Next CTA Bar */}
        <View style={styles.stickyBottomBar}>
          <TouchableOpacity
            style={styles.nextButton}
            activeOpacity={0.85}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next"
          >
            <Text style={styles.nextButtonText}>Next</Text>
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
    paddingBottom: 100, // room for sticky next button
  },
  topNavRow: {
    flexDirection: 'row',
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
  optionsList: {
    gap: 14,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  optionCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  optionCardSelected: {
    backgroundColor: '#F0FAF5',
    borderColor: colors.primary,
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#E2A93B', // Golden accent stripe from screenshot
    zIndex: 2,
  },
  iconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1D2B',
    marginBottom: 3,
  },
  optionTitleSelected: {
    color: '#1A1D2B',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
