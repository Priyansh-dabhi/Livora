/**
 * First-Launch Welcome / Onboarding Carousel Screen
 *
 * Displays a premium 5-slide interactive carousel introducing Livora.
 * Shows only on the user's very first launch. Once completed or skipped,
 * persists the seen flag in AsyncStorage and navigates to Login.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, typography, radius, shadows } from '@/theme';
import { useAppDispatch, markWelcomeSeen } from '@/store';
import { saveWelcomeSeen } from '@/utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  highlight: string;
}

const SLIDES: Slide[] = [
  {
    id: 'welcome',
    icon: 'star',
    title: 'Welcome to Livora',
    subtitle:
      'Your personal lifestyle manager — concierge service tailored for modern Indian households.',
    highlight: 'Dedicated Assistance',
  },
  {
    id: 'managed',
    icon: 'home',
    title: 'Your Home, Managed',
    subtitle:
      'From errands and deep cleaning to specialist doctor visits — delegate everything to your dedicated LM.',
    highlight: 'Complete Household Care',
  },
  {
    id: 'timing',
    icon: 'clock',
    title: 'Any Time, Any Day',
    subtitle:
      'Standard, same-day, or scheduled delivery — choose the exact timing that works for your routine.',
    highlight: 'Flexible Scheduling',
  },
  {
    id: 'trusted',
    icon: 'shield',
    title: 'Trusted & Reliable',
    subtitle:
      'Vetted professionals, background-checked and trusted by high-performing families across the city.',
    highlight: 'Verified & Insured',
  },
  {
    id: 'ready',
    icon: 'feather',
    title: 'Ready to Begin?',
    subtitle:
      'Set up your household profile in just 2 minutes and get your first concierge task handled today.',
    highlight: 'Instant Onboarding',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isLastSlide = activeIndex === SLIDES.length - 1;

  // Finish welcome flow and persist permanently
  const handleFinish = async () => {
    try {
      await saveWelcomeSeen();
      dispatch(markWelcomeSeen());
      router.replace('/(auth)/login');
    } catch (err) {
      console.warn('Failed to save welcome seen flag:', err);
      dispatch(markWelcomeSeen());
      router.replace('/(auth)/login');
    }
  };

  const handleNext = () => {
    if (isLastSlide) {
      handleFinish();
    } else {
      const nextIndex = activeIndex + 1;
      scrollRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < SLIDES.length) {
      setActiveIndex(index);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Row: Brand badge & Skip link */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Feather name="feather" size={18} color={colors.primary} />
          </View>
          <Text style={styles.brandTitle}>Livora</Text>
        </View>

        {!isLastSlide ? (
          <TouchableOpacity
            onPress={handleFinish}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.skipButton}
            accessibilityRole="button"
            accessibilityLabel="Skip welcome intro"
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Main Swipeable Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.carouselContainer}
        contentContainerStyle={styles.carouselContent}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            {/* Hero Icon Graphic */}
            <View style={styles.heroOuterCircle}>
              <View style={styles.heroMiddleCircle}>
                <View style={styles.heroInnerCircle}>
                  <Feather
                    name={slide.icon}
                    size={46}
                    color={colors.primary}
                  />
                </View>
              </View>
            </View>

            {/* Pill Highlight Badge */}
            <View style={styles.highlightBadge}>
              <Text style={styles.highlightText}>{slide.highlight}</Text>
            </View>

            {/* Slide Title */}
            <Text style={styles.slideTitle}>{slide.title}</Text>

            {/* Slide Subtitle */}
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls Area */}
      <View style={styles.bottomControls}>
        {/* Animated Dot Indicators */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* Action Button: Next or Get Started */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={isLastSlide ? 'Get Started' : 'Next slide'}
        >
          <Text style={styles.actionButtonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
          <Feather
            name={isLastSlide ? 'arrow-right' : 'chevron-right'}
            size={18}
            color="#FFFFFF"
            style={styles.actionButtonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  carouselContainer: {
    flex: 1,
  },
  carouselContent: {
    alignItems: 'center',
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  heroOuterCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(232, 245, 238, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroMiddleCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(232, 245, 238, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInnerCircle: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    ...shadows.sm,
  },
  highlightBadge: {
    backgroundColor: colors.highlightMint,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: 16,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  slideSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 320,
  },
  bottomControls: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 26,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 14,
    gap: 8,
    ...shadows.sm,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  actionButtonIcon: {
    marginTop: 1,
  },
});
