/**
 * Livora Home Screen (PadosiPro Replica)
 *
 * Faithfully reproduces the home dashboard UI:
 * - Dynamic greeting with user profile icon
 * - "What do you need help with?" search prompt
 * - "POPULAR WITH FAMILIES LIKE YOURS" category pills
 * - "Browse everything we do →" link
 * - "HOW PADOSIPRO WORKS" 3-step feature explanation
 * - Sticky Lifestyle Manager bar with WhatsApp chat deeplink
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, typography, radius, shadows } from '@/theme';
import {
  useAppDispatch,
  useAppSelector,
  setCategories,
  setTasks,
  setSelectedCategory,
  setSearchQuery,
  toggleActivity,
  toggleHelpType,
} from '@/store';
import { SERVICE_CATEGORIES, ALL_FLATTENED_TASKS } from '@/constants/serviceCatalog';

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.profile);
  const { categories, tasks } = useAppSelector((state) => state.tasks);

  const [localSearch, setLocalSearch] = useState('');

  // Pre-load categories and tasks if empty
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(setCategories(SERVICE_CATEGORIES));
    }
    if (tasks.length === 0) {
      dispatch(setTasks(ALL_FLATTENED_TASKS));
    }
  }, [categories.length, tasks.length, dispatch]);

  const greeting = getTimeOfDayGreeting();
  const firstName =
    profile?.name?.split(' ')[0] ||
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    '';

  // Navigate to all services screen with category opened
  const handleSelectCategory = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
    dispatch(setSearchQuery(''));
    router.push('/(main)/tasks');
  };

  // Contextual search across categories, help types, and detailed activities
  const searchResults = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    if (!q) return [];

    const results: {
      id: string;
      title: string;
      subtitle: string;
      categoryId: string;
      helpTypeId?: string;
      activityId?: string;
    }[] = [];

    SERVICE_CATEGORIES.forEach((cat) => {
      // 1. Match category
      if (
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: `cat-${cat.id}`,
          title: cat.name,
          subtitle: `Category • ${cat.description}`,
          categoryId: cat.id,
        });
      }

      // 2. Match help types and activities
      cat.helpTypes.forEach((ht) => {
        if (
          ht.name.toLowerCase().includes(q) ||
          (ht.description && ht.description.toLowerCase().includes(q))
        ) {
          results.push({
            id: `ht-${ht.id}`,
            title: ht.name,
            subtitle: `${cat.name} • Help Type`,
            categoryId: cat.id,
            helpTypeId: ht.id,
          });
        }

        ht.activities.forEach((act) => {
          if (
            act.name.toLowerCase().includes(q) ||
            (act.description && act.description.toLowerCase().includes(q))
          ) {
            results.push({
              id: `act-${act.id}`,
              title: act.name,
              subtitle: `${cat.name} → ${ht.name}`,
              categoryId: cat.id,
              helpTypeId: ht.id,
              activityId: act.id,
            });
          }
        });
      });
    });

    return results.slice(0, 6);
  }, [localSearch]);

  const handleSelectSearchResult = (result: (typeof searchResults)[0]) => {
    dispatch(setSelectedCategory(result.categoryId));
    if (result.activityId) {
      dispatch(toggleActivity(result.activityId));
    } else if (result.helpTypeId) {
      dispatch(toggleHelpType(result.helpTypeId));
    }
    setLocalSearch('');
    router.push('/(main)/tasks');
  };

  // Navigate to all services screen with search
  const handleSearchSubmit = () => {
    if (searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0]);
    } else {
      dispatch(setSearchQuery(localSearch));
      router.push('/(main)/tasks');
    }
  };

  // WhatsApp Deeplink: opens WhatsApp to chat with Lifestyle Manager (+91 90000 00001)
  const handleOpenWhatsApp = async () => {
    const phoneNumber = '919000000001';
    const message = encodeURIComponent(
      'Hi, I need assistance from my Lifestyle Manager.'
    );
    const deepLink = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    const webLink = `https://wa.me/${phoneNumber}?text=${message}`;

    try {
      const canOpen = await Linking.canOpenURL(deepLink);
      if (canOpen) {
        await Linking.openURL(deepLink);
      } else {
        await Linking.openURL(webLink);
      }
    } catch {
      await Linking.openURL(webLink);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar: Greeting & Profile Avatar */}
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              <Text style={styles.greetingTitle}>
                {greeting}, {firstName}
              </Text>
              {profile?.address ? (
                <View style={styles.locationBadge}>
                  <Feather
                    name="map-pin"
                    size={12}
                    color={colors.primary}
                    style={styles.locationBadgeIcon}
                  />
                  <Text style={styles.locationBadgeText} numberOfLines={1}>
                    {profile.address.split(',')[0].trim()}
                  </Text>
                </View>
              ) : null}
            </View>

          </View>

          {/* Heading */}
          <Text style={styles.mainHeading}>What do you need help with?</Text>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
              <Feather
                name="search"
                size={18}
                color={colors.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="AC leaking, cook for weekends..."
                placeholderTextColor={colors.textTertiary}
                value={localSearch}
                onChangeText={setLocalSearch}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
              {localSearch.length > 0 && (
                <TouchableOpacity
                  onPress={() => setLocalSearch('')}
                  style={styles.clearSearchBtn}
                >
                  <Feather name="x" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Live Search Results Dropdown */}
            {searchResults.length > 0 && (
              <View style={styles.searchResultsBox}>
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.searchResultItem}
                    activeOpacity={0.7}
                    onPress={() => handleSelectSearchResult(item)}
                  >
                    <View style={styles.searchResultIcon}>
                      <Feather
                        name="arrow-up-right"
                        size={16}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.searchResultTexts}>
                      <Text style={styles.searchResultTitle}>{item.title}</Text>
                      <Text style={styles.searchResultSubtitle}>
                        {item.subtitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Section: POPULAR WITH FAMILIES LIKE YOURS */}
          <View style={styles.popularSection}>
            <Text style={styles.sectionHeaderLabel}>
              POPULAR WITH FAMILIES LIKE YOURS
            </Text>

            {/* Pill 1: Errands & Daily Tasks */}
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.7}
                onPress={() => handleSelectCategory('cat-errands')}
              >
                <Feather
                  name="check-square"
                  size={16}
                  color={colors.primary}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Errands & Daily Tasks</Text>
              </TouchableOpacity>
            </View>

            {/* Pill Row 2: Home Services & Travel & Tourism */}
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.7}
                onPress={() => handleSelectCategory('cat-home')}
              >
                <Feather
                  name="home"
                  size={16}
                  color={colors.primary}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Home Services</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.7}
                onPress={() => handleSelectCategory('cat-travel')}
              >
                <Feather
                  name="map-pin"
                  size={16}
                  color={colors.primary}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Travel & Tourism</Text>
                <View style={styles.comingSoonPillTag}>
                  <Text style={styles.comingSoonPillTagText}>Soon</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Pill Row 3: Health & Medical & Senior Care */}
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.7}
                onPress={() => handleSelectCategory('cat-health')}
              >
                <Feather
                  name="heart"
                  size={16}
                  color={colors.primary}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Health & Medical</Text>
                <View style={styles.comingSoonPillTag}>
                  <Text style={styles.comingSoonPillTagText}>Soon</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.7}
                onPress={() => handleSelectCategory('cat-senior')}
              >
                <Feather
                  name="users"
                  size={16}
                  color={colors.primary}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Senior Care</Text>
                <View style={styles.comingSoonPillTag}>
                  <Text style={styles.comingSoonPillTagText}>Soon</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Pill Row 4: Events & Management */}
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={styles.pill}
                activeOpacity={0.7}
                onPress={() => handleSelectCategory('cat-events')}
              >
                <Feather
                  name="calendar"
                  size={16}
                  color={colors.primary}
                  style={styles.pillIcon}
                />
                <Text style={styles.pillText}>Events & Management</Text>
                <View style={styles.comingSoonPillTag}>
                  <Text style={styles.comingSoonPillTagText}>Soon</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Browse everything we do -> */}
            <TouchableOpacity
              style={styles.browseAllLink}
              activeOpacity={0.7}
              onPress={() => {
                dispatch(setSelectedCategory(null));
                dispatch(setSearchQuery(''));
                router.push('/(main)/tasks');
              }}
            >
              <Text style={styles.browseAllText}>Browse everything we do</Text>
              <Feather name="arrow-right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Section: HOW PADOSIPRO WORKS */}
          <View style={styles.howItWorksSection}>
            <Text style={styles.sectionHeaderLabel}>HOW PADOSIPRO WORKS</Text>

            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={styles.stepIconWrapper}>
                <Feather
                  name="message-square"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Tell us what you need</Text>
                <Text style={styles.stepSubtitle}>
                  In your own words. No forms to hunt through.
                </Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={styles.stepIconWrapper}>
                <Feather name="user-plus" size={18} color={colors.primary} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  Your Lifestyle Manager takes it on
                </Text>
                <Text style={styles.stepSubtitle}>
                  One person who knows your family and follows it through.
                </Text>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={styles.stepIconWrapper}>
                <Feather
                  name="check-circle"
                  size={18}
                  color={colors.primary}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>You see it done</Text>
                <Text style={styles.stepSubtitle}>
                  Updates as things actually happen, with proof when it matters.
                </Text>
              </View>
            </View>
          </View>

          {/* Lifestyle Manager Card (At bottom of content, not floating) */}
          <View style={styles.lmCardContainer}>
            <View style={styles.lmCard}>
              <View style={styles.lmInfo}>
                <Text style={styles.lmLabel}>Your Lifestyle Manager</Text>
                <Text style={styles.lmName}>Pilot LM</Text>
              </View>
              <TouchableOpacity
                style={styles.chatButton}
                activeOpacity={0.8}
                onPress={handleOpenWhatsApp}
                accessibilityRole="button"
                accessibilityLabel="Chat with Lifestyle Manager on WhatsApp"
              >
                <Feather
                  name="message-circle"
                  size={18}
                  color={colors.primary}
                  style={styles.chatIcon}
                />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    paddingTop: 12,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 4,
  },
  topBarLeft: {
    flex: 1,
    marginRight: 12,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  locationBadgeIcon: {
    marginTop: Platform.OS === 'android' ? 1 : 0,
  },
  locationBadgeText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  profileIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  searchWrapper: {
    marginBottom: 28,
    position: 'relative',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 6,
  },
  searchResultsBox: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 6,
    ...shadows.md,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceElevated,
  },
  searchResultIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultTexts: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  searchResultSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  popularSection: {
    marginBottom: 32,
  },
  sectionHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pillIcon: {
    marginRight: 8,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  comingSoonPillTag: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  comingSoonPillTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  browseAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 4,
  },
  browseAllText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  howItWorksSection: {
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 14,
  },
  stepIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  lmCardContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  lmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    ...shadows.sm,
  },
  lmInfo: {
    flex: 1,
  },
  lmLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  lmName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  chatIcon: {
    marginTop: 1,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
