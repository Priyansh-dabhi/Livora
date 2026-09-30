/**
 * Edit Profile & Account Screen
 *
 * Displays user's Lifestyle Manager details, household configuration,
 * wallet status, editable personal details, and a prominent Sign Out action,
 * styled to match the Livora reference design system.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import {
  Input,
  Button,
  Header,
  KeyboardAwareWrapper,
} from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
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
import { saveProfile as mockSaveProfile } from '@/services/mockProfileService';
import { saveProfileData, clearSession } from '@/utils/storage';

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentProfile = useAppSelector((state) => state.profile.profile);
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.profile.isLoading);

  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const nameField = useFormField({
    initialValue: currentProfile?.name || 'Priyansh Dabhi',
    validate: (val) => {
      if (!val.trim()) return 'Full name is required';
      if (!isValidName(val)) return 'Please enter a valid name (at least 2 letters)';
      return null;
    },
  });

  const mobileField = useFormField({
    initialValue: currentProfile?.mobileNumber || '',
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
    initialValue:
      currentProfile?.address ||
      'Chhani Road, Vadodara\nSociety: Omkara Residency\nFlat / unit: D-301',
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

  const handleSave = async () => {
    setFormError(null);

    const isNameValid = nameField.runValidation();
    const isMobileValid = mobileField.runValidation();
    const isAddressValid = addressField.runValidation();

    if (!isNameValid || !isMobileValid || !isAddressValid) {
      return;
    }

    dispatch(setProfileLoading(true));

    try {
      const payload = {
        name: nameField.value.trim(),
        mobileNumber: mobileField.value.trim().replace(/\s/g, ''),
        address: addressField.value.trim(),
        businessName: businessField.value.trim() || undefined,
      };

      const updatedProfile = await mockSaveProfile(payload);

      dispatch(setProfile(updatedProfile));
      await saveProfileData(updatedProfile);
      setIsEditing(false);

      Alert.alert('Profile Updated', 'Your profile details have been successfully saved.', [
        { text: 'OK' },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      setFormError(msg);
    } finally {
      dispatch(setProfileLoading(false));
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Account"
        showBack
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('/(main)/home');
          }
        }}
      />

      <KeyboardAwareWrapper contentContainerStyle={styles.container}>
        {/* Card 1: Your LM */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>Your LM</Text>
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
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardTitle}>Pilot LM</Text>
          <Text style={styles.cardCity}>Mumbai</Text>

          <View style={styles.divider} />

          <Text style={styles.cardUserName}>
            {currentProfile?.name || 'Priyansh Dabhi'}
          </Text>
          <Text style={styles.cardUserAddress}>
            {currentProfile?.address ||
              'Chhani Road, Vadodara\nSociety: Omkara Residency\nFlat / unit: D-301'}
          </Text>

          {currentProfile?.businessName ? (
            <Text style={styles.cardUserBusiness}>
              {currentProfile.businessName}
            </Text>
          ) : null}
        </View>

        {/* Card 2: Household */}
        <TouchableOpacity
          style={styles.householdCard}
          onPress={() =>
            Alert.alert(
              'Household',
              'Family members your Lifestyle Manager should know about. Contact your LM to add or update family members.',
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

        {/* Card 3: Wallet */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Wallet</Text>
          <Text style={styles.cardTitle}>Coming soon</Text>
          <Text style={styles.walletDescription}>
            Wallet top-up isn't turned on yet. Your Lifestyle Manager can still handle
            requests and send you the bill directly in the meantime.
          </Text>
        </View>

        {/* Edit Form (Expanded when user taps Edit Profile) */}
        {isEditing && (
          <View style={styles.editCard}>
            <Text style={styles.editCardTitle}>Edit Profile Information</Text>
            <Text style={styles.editCardSubtitle}>
              Update your contact info and delivery address for your Lifestyle Manager.
            </Text>

            {formError && (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            )}

            <Input
              label="Full Name *"
              placeholder="e.g. Priyansh Dabhi"
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

            <Button
              label="Save Changes"
              onPress={handleSave}
              loading={isLoading}
              fullWidth
              size="md"
              icon="check"
              iconPosition="right"
              style={styles.saveBtn}
            />
          </View>
        )}

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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  editToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.highlightMint,
  },
  editToggleText: {
    ...typography.captionMedium,
    color: colors.primary,
    fontWeight: '600',
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
  cardUserBusiness: {
    ...typography.captionMedium,
    color: colors.primary,
    marginTop: spacing.xs,
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
  editCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
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
    marginBottom: spacing.md,
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
  saveBtn: {
    marginTop: spacing.sm,
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
