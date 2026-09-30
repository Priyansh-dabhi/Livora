/**
 * Livora Home Screen
 *
 * Main lifestyle dashboard displaying active services, concierge status,
 * quick service search/discovery entry points, and account profile details.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import {
  Badge,
  Button,
  EmptyState,
} from '@/components';
import { colors, spacing, typography, radius, shadows } from '@/theme';
import {
  useAppDispatch,
  useAppSelector,
  logout,
  clearTasksState,
  clearProfile,
  setCategories,
  setTasks,
  setSelectedCategory,
} from '@/store';
import { getCategories, getTasks } from '@/services/mockTaskService';
import { clearSession } from '@/utils/storage';
import type { Task, Category } from '@/types';

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
  const { categories, tasks, selectedTaskIds } = useAppSelector(
    (state) => state.tasks,
  );

  const [showAccountDetails, setShowAccountDetails] = useState(false);

  // Fetch categories and tasks if not already populated in Redux
  useEffect(() => {
    async function loadData() {
      if (categories.length > 0 && tasks.length > 0) return;
      try {
        const [cats, taskList] = await Promise.all([
          getCategories(),
          getTasks(),
        ]);
        dispatch(setCategories(cats));
        dispatch(setTasks(taskList));
      } catch (err) {
        console.warn('Failed to load initial data for Home:', err);
      }
    }

    loadData();
  }, [categories.length, tasks.length, dispatch]);

  // Fast category lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // Active confirmed Task objects
  const activeTasks = useMemo(() => {
    return tasks.filter((t) => selectedTaskIds.includes(t.id));
  }, [tasks, selectedTaskIds]);

  const greeting = getTimeOfDayGreeting();
  const displayName = profile?.name || user?.email?.split('@')[0] || 'Friend';
  const userInitials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const handleCategoryPress = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
    router.push('/(main)/tasks');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from your Livora account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await clearSession();
            dispatch(logout());
            dispatch(clearProfile());
            dispatch(clearTasksState());
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top App Bar */}
      <View style={styles.navBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Feather name="feather" size={20} color={colors.primary} />
          </View>
          <Text style={styles.brandTitle}>Livora</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(main)/edit-profile')}
          style={styles.personIconButton}
          accessibilityLabel="View profile and account settings"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="user" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personalized Welcome Header */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingSub}>{greeting},</Text>
          <Text style={styles.greetingName}>{displayName} 👋</Text>

          {profile?.address && (
            <View style={styles.addressChip}>
              <Feather name="map-pin" size={13} color={colors.primary} />
              <Text style={styles.addressText} numberOfLines={1}>
                {profile.address}
              </Text>
            </View>
          )}
        </View>

        {/* Concierge Status Card */}
        <View style={[styles.conciergeCard, shadows.sm]}>
          <View style={styles.conciergeHeader}>
            <Badge label="Active Lifestyle Plan" variant="accent" />
            <Feather name="shield" size={18} color={colors.primary} />
          </View>
          <Text style={styles.conciergeTitle}>
            Dedicated Concierge Assigned
          </Text>
          <Text style={styles.conciergeSubtitle}>
            Your household services are coordinated seamlessly by Livora's professional care team.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeTasks.length}</Text>
              <Text style={styles.statLabel}>Active Services</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Household</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </View>
          </View>
        </View>

        {/* Quick Search Entry Point */}
        <TouchableOpacity
          style={styles.searchBarLink}
          onPress={() => router.push('/(main)/tasks')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Search or add more services"
        >
          <Feather name="search" size={18} color={colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>
            Need another service? Search or explore...
          </Text>
          <Feather name="arrow-right" size={16} color={colors.primary} />
        </TouchableOpacity>

        {/* Active Confirmed Services List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>
            My Active Services ({activeTasks.length})
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(main)/tasks')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.manageLink}>Edit / Add</Text>
          </TouchableOpacity>
        </View>

        {activeTasks.length > 0 ? (
          <View style={styles.tasksContainer}>
            {activeTasks.map((task: Task) => {
              const categoryName =
                categoryMap.get(task.categoryId) || 'General';
              return (
                <View key={task.id} style={styles.taskCard}>
                  <View style={styles.taskCardTop}>
                    <Badge label={categoryName} variant="primary" />
                    <Badge label="Scheduled" variant="success" />
                  </View>
                  <Text style={styles.taskName}>{task.name}</Text>
                  <Text style={styles.taskDesc}>{task.description}</Text>

                  <View style={styles.conciergeNoteRow}>
                    <Feather
                      name="check-circle"
                      size={12}
                      color={colors.primary}
                    />
                    <Text style={styles.conciergeNoteText}>
                      Managed by Livora Concierge
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <EmptyState
            icon="inbox"
            title="No active services yet"
            subtitle="Choose household errands, home care, or medical tasks to have Livora handle them for you."
            actionLabel="Discover Services"
            onAction={() => router.push('/(main)/tasks')}
          />
        )}

        {/* Explore Categories Carousel */}
        <View style={styles.exploreSection}>
          <Text style={styles.sectionHeading}>Explore Other Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category: Category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryChip}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                <Feather
                  name={category.icon as keyof typeof Feather.glyphMap}
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.categoryChipText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Account Details / Sign Out Section */}
        <View style={styles.accountSection}>
          <TouchableOpacity
            style={styles.accountHeaderRow}
            onPress={() => setShowAccountDetails(!showAccountDetails)}
            activeOpacity={0.7}
          >
            <View style={styles.accountHeaderLeft}>
              <Feather name="user" size={18} color={colors.textPrimary} />
              <Text style={styles.sectionHeading}>Account & Profile</Text>
            </View>
            <Feather
              name={showAccountDetails ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {showAccountDetails && (
            <View style={styles.accountCard}>
              <View style={styles.accountFieldRow}>
                <Text style={styles.accountLabel}>Full Name</Text>
                <Text style={styles.accountValue}>
                  {profile?.name || 'Not provided'}
                </Text>
              </View>

              <View style={styles.accountFieldRow}>
                <Text style={styles.accountLabel}>Email</Text>
                <Text style={styles.accountValue}>
                  {user?.email || 'test@livora.com'}
                </Text>
              </View>

              <View style={styles.accountFieldRow}>
                <Text style={styles.accountLabel}>Mobile</Text>
                <Text style={styles.accountValue}>
                  {profile?.mobileNumber
                    ? `+91 ${profile.mobileNumber}`
                    : 'Not provided'}
                </Text>
              </View>

              {profile?.businessName && (
                <View style={styles.accountFieldRow}>
                  <Text style={styles.accountLabel}>Business</Text>
                  <Text style={styles.accountValue}>
                    {profile.businessName}
                  </Text>
                </View>
              )}

              <View style={styles.accountFieldRow}>
                <Text style={styles.accountLabel}>Address</Text>
                <Text
                  style={[styles.accountValue, styles.accountAddressValue]}
                >
                  {profile?.address || 'Not provided'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => router.push('/(main)/edit-profile')}
                accessibilityRole="button"
                accessibilityLabel="Edit profile"
              >
                <Feather name="edit-2" size={14} color={colors.primary} />
                <Text style={styles.editProfileButtonText}>Edit Profile Details</Text>
              </TouchableOpacity>
            </View>
          )}

          <Button
            label="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            icon="log-out"
            fullWidth
            style={styles.signOutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  personIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.captionMedium,
    color: colors.white,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xxxl,
  },
  greetingSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  greetingSub: {
    ...typography.body,
    color: colors.textSecondary,
  },
  greetingName: {
    ...typography.h1,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  addressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
    maxWidth: '100%',
  },
  addressText: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  conciergeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  conciergeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  conciergeTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  conciergeSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.highlightMint,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.micro,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.primaryLight,
  },
  searchBarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    ...typography.body,
    color: colors.textTertiary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeading: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  manageLink: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  tasksContainer: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  taskCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  taskName: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  taskDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  conciergeNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  conciergeNoteText: {
    ...typography.micro,
    color: colors.primary,
  },
  exploreSection: {
    marginBottom: spacing.xxl,
  },
  categoryScroll: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  categoryChipText: {
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
  accountSection: {
    marginTop: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  accountHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  accountHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  accountCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  accountFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accountLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    width: 80,
  },
  accountValue: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  accountAddressValue: {
    maxWidth: 200,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.highlightMint,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  editProfileButtonText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  signOutButton: {
    marginTop: spacing.xs,
  },
});
