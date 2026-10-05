/**
 * Livora Profile & Account Screen
 *
 * Comprehensive profile dashboard displaying all user account details
 * (Full Name, Email, Mobile, Address, Business), Lifestyle Manager concierge status,
 * household management, wallet status, inline profile editing capabilities,
 * and session sign out.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import {
  Input,
  Button,
  Header,
  Badge,
  KeyboardAwareWrapper,
} from '@/components';
import { colors, spacing, typography, radius, shadows } from '@/theme';
import { useFormField } from '@/hooks';
import {
  isValidName,
  isValidIndianMobile,
  isValidAddress,
} from '@/utils/validation';
import {
  useAppDispatch,
  useAppSelector,
  setProfile,
  setProfileLoading,
  logout,
  clearProfile,
  clearTasksState,
} from '@/store';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/userApi';
import { saveProfileData, clearSession } from '@/utils/storage';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentProfile = useAppSelector((state) => state.profile.profile);
  const user = useAppSelector((state) => state.auth.user);

  const { data: profileResponse, refetch: refetchProfile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const isLoading = isUpdatingProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync profile response with Redux store when fetched
  useEffect(() => {
    if (profileResponse?.data) {
      dispatch(setProfile(profileResponse.data));
    }
  }, [profileResponse, dispatch]);

  const nameField = useFormField({
    initialValue: currentProfile?.name || user?.name || '',
    validate: (val) => {
      if (!val.trim()) return 'Full name is required';
      if (!isValidName(val)) return 'Please enter a valid name (at least 2 letters)';
      return null;
    },
  });

  const mobileField = useFormField({
    initialValue: currentProfile?.mobileNumber || user?.phone || '',
    validate: (val) => {
      const cleaned = val.replace(/\s/g, '');
      if (!cleaned) return 'Mobile number is required';
      if (!isValidIndianMobile(cleaned)) {
        return 'Enter a valid 10-digit Indian mobile number';
      }
      return null;
    },
  });

  const addressField = useFormField({
    initialValue: currentProfile?.address || '',
    validate: (val) => {
      if (!val.trim()) return 'Address is required';
      if (!isValidAddress(val)) {
        return 'Please enter a complete address (min 5 characters)';
      }
      return null;
    },
  });

  const businessField = useFormField({
    initialValue: currentProfile?.businessName || '',
  });

  // Keep form values synchronized if currentProfile updates
  useEffect(() => {
    if (currentProfile) {
      if (currentProfile.name) nameField.setValue(currentProfile.name);
      if (currentProfile.mobileNumber) mobileField.setValue(currentProfile.mobileNumber);
      if (currentProfile.address) addressField.setValue(currentProfile.address);
      if (currentProfile.businessName) businessField.setValue(currentProfile.businessName);
    }
  }, [currentProfile]);

  const handleSave = async () => {
    setFormError(null);

    const isNameValid = nameField.runValidation();
    const isMobileValid = mobileField.runValidation();
    const isAddressValid = addressField.runValidation();

    if (!isNameValid || !isMobileValid || !isAddressValid) {
      return;
    }

    try {
      const payload = {
        name: nameField.value.trim(),
        mobileNumber: mobileField.value.trim().replace(/\s/g, ''),
        address: addressField.value.trim(),
        businessName: businessField.value.trim() || undefined,
      };

      const result = await updateProfile(payload).unwrap();
      const updatedProfile = result.data;

      dispatch(setProfile(updatedProfile));
      await saveProfileData(updatedProfile);
      setIsEditing(false);

      Alert.alert('Profile Updated', 'Your profile details have been successfully saved.', [
        { text: 'OK' },
      ]);
    } catch (err: unknown) {
      const msg =
        (err as any)?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to update profile.');
      setFormError(msg);
    }
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

  const displayName = currentProfile?.name || user?.name || nameField.value || user?.email?.split('@')[0] || 'Member';
  const displayEmail = user?.email || (currentProfile as any)?.email || '';
  const displayMobile = currentProfile?.mobileNumber || user?.phone || mobileField.value || 'Not provided';
  const displayAddress =
    currentProfile?.address ||
    addressField.value ||
    'No address provided yet';
  const displayBusiness = currentProfile?.businessName || businessField.value || 'Not provided';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Profile & Account"
        showBack={false}
      />


      <KeyboardAwareWrapper contentContainerStyle={styles.container}>
        {/* User Account Overview Card */}
        <View style={styles.profileOverviewCard}>
          <View style={styles.overviewTopRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials || 'U'}</Text>
            </View>
            <View style={styles.overviewInfo}>
              <Text style={styles.overviewName}>{displayName}</Text>
              <Text style={styles.overviewEmail}>{displayEmail}</Text>
              <View style={styles.badgeWrapper}>
                <Badge label="Active Member" variant="primary" />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editToggleBtn}
              accessibilityRole="button"
              accessibilityLabel={isEditing ? 'Close editor' : 'Edit profile'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather
                name={isEditing ? 'x' : 'edit-2'}
                size={14}
                color={colors.primary}
              />
              <Text style={styles.editToggleText}>
                {isEditing ? 'Close' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Account Detail Fields */}
          <View style={styles.detailsDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{displayName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{displayEmail}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile</Text>
            <Text style={styles.detailValue}>+91 {displayMobile}</Text>
          </View>

          {displayBusiness ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Business</Text>
              <Text style={styles.detailValue}>{displayBusiness}</Text>
            </View>
          ) : null}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={[styles.detailValue, styles.detailAddress]}>
              {displayAddress}
            </Text>
          </View>
        </View>

        {/* Edit Form (Expanded when user taps Edit) */}
        {isEditing && (
          <View style={styles.editCard}>
            <View style={styles.editCardHeaderRow}>
              <View>
                <Text style={styles.editCardTitle}>Update Profile Details</Text>
                <Text style={styles.editCardSubtitle}>
                  Make changes below and tap Save Changes.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {formError && (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            )}

            <Input
              label="Full Name *"
              placeholder="Enter your full name"
              value={nameField.value}
              onChangeText={nameField.setValue}
              onBlur={nameField.onBlur}
              error={nameField.error}
              leftIcon="user"
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Input
              label="Mobile Number *"
              placeholder="98765 43210"
              value={mobileField.value}
              onChangeText={(text) => {
                const digitsOnly = text.replace(/\D/g, '').slice(0, 10);
                mobileField.setValue(digitsOnly);
              }}
              onBlur={mobileField.onBlur}
              error={mobileField.error}
              prefix="+91"
              keyboardType="number-pad"
              maxLength={10}
              returnKeyType="next"
            />

            <Input
              label="Delivery / Household Address *"
              placeholder="House / Flat No., Society, Road, City"
              value={addressField.value}
              onChangeText={addressField.setValue}
              onBlur={addressField.onBlur}
              error={addressField.error}
              leftIcon="map-pin"
              multiline
              numberOfLines={3}
              returnKeyType="next"
            />

            <Input
              label="Business Name (Optional)"
              placeholder="e.g. Acme Corp"
              value={businessField.value}
              onChangeText={businessField.setValue}
              leftIcon="briefcase"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            <View style={styles.editActionRow}>
              <Button
                label="Cancel"
                variant="outline"
                onPress={() => setIsEditing(false)}
                style={styles.cancelBtn}
              />
              <Button
                label="Save Changes"
                onPress={handleSave}
                loading={isLoading}
                icon="check"
                iconPosition="right"
                style={styles.saveBtn}
              />
            </View>
          </View>
        )}

        {/* Card: Your LM (Pilot LM, Mumbai) */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Your LM</Text>
          <Text style={styles.cardTitle}>Pilot LM</Text>
          <Text style={styles.cardCity}>Mumbai</Text>

          <View style={styles.divider} />

          <Text style={styles.cardUserName}>{displayName}</Text>
          <Text style={styles.cardUserAddress}>{displayAddress}</Text>
        </View>

        {/* Card: Household */}
        <TouchableOpacity
          style={styles.householdCard}
          onPress={() =>
            Alert.alert(
              'Household Members',
              'Your Lifestyle Manager coordinates care for everyone in your household. Contact your LM to add or update family members.',
              [{ text: 'OK' }],
            )
          }
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Household family members"
        >
          <View style={styles.householdIconWrapper}>
            <Feather name="users" size={20} color={colors.primary} />
          </View>
          <View style={styles.householdTextWrapper}>
            <Text style={styles.householdTitle}>Household</Text>
            <Text style={styles.householdSubtitle}>
              Family members your LM should know about
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Card: Wallet */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Wallet</Text>
          <Text style={styles.cardTitle}>Coming soon</Text>
          <Text style={styles.walletDescription}>
            Wallet top-up isn't turned on yet. Your Lifestyle Manager can still handle
            requests and send you the bill directly in the meantime.
          </Text>
        </View>

        {/* Prominent Red Outline Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Sign out of your account"
        >
          <Feather name="log-out" size={18} color={colors.error} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </KeyboardAwareWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  profileOverviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  overviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  overviewInfo: {
    flex: 1,
  },
  overviewName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  overviewEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  editToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.highlightMint,
  },
  editToggleText: {
    ...typography.captionMedium,
    color: colors.primary,
    fontWeight: '600',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  detailLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    width: 90,
  },
  detailValue: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  detailAddress: {
    lineHeight: 18,
  },
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  editCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  editCardTitle: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  editCardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    flex: 1,
  },
  editActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 2,
  },
  cardCity: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  cardUserName: {
    ...typography.bodyMedium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardUserAddress: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  householdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  householdIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  householdTextWrapper: {
    flex: 1,
  },
  householdTitle: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  householdSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  walletDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  signOutText: {
    ...typography.bodyMedium,
    color: colors.error,
    fontWeight: '600',
  },
});
