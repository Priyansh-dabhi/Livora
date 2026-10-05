/**
 * Profile Details Setup Screen
 *
 * First-login onboarding: collects Name, Indian Mobile (+91),
 * detailed Address, and optional Business Name.
 */

import React, { useState } from 'react';
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
  BottomAction,
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
  setProfileError,
  markProfileComplete,
  completeOnboarding,
  logout,
} from '@/store';
import { useUpdateProfileMutation } from '@/services/userApi';
import {
  saveProfileData,
  saveOnboardingComplete,
  saveSession,
  clearSession,
} from '@/utils/storage';

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { isLoading: isProfileLoading } = useAppSelector((state) => state.profile);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const isLoading = isProfileLoading || isUpdating;

  const [formError, setFormError] = useState<string | null>(null);

  const nameField = useFormField({
    initialValue: user?.name || '',
    validate: (val) => {
      if (!val.trim()) return 'Full name is required';
      if (!isValidName(val)) return 'Please enter a valid name (at least 2 letters, alphabetic only)';
      return null;
    },
  });

  const mobileField = useFormField({
    initialValue: user?.phone || '',
    validate: (val) => {
      const cleaned = val.replace(/\s/g, '');
      if (!cleaned) return 'Mobile number is required';
      if (!isValidIndianMobile(cleaned)) {
        return 'Enter a valid 10-digit Indian mobile number (starts with 6-9)';
      }
      return null;
    },
  });

  const addressField = useFormField({
    initialValue: '',
    validate: (val) => {
      if (!val.trim()) return 'Address is required';
      if (!isValidAddress(val)) {
        return 'Please enter a complete address (minimum 5 characters)';
      }
      return null;
    },
  });

  const businessField = useFormField({
    initialValue: '',
  });

  const handleSignOutPrompt = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your profile setup can be resumed later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await clearSession();
            dispatch(logout());
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  };

  const handleSaveProfile = async () => {
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

      const result = await updateProfile(payload).unwrap();
      const savedProfile = result.data;

      // 1. Update Redux store
      dispatch(setProfile(savedProfile));
      dispatch(markProfileComplete());
      dispatch(completeOnboarding());

      // 2. Persist to storage
      await saveProfileData(savedProfile);
      await saveOnboardingComplete(true);

      if (token && user) {
        await saveSession(token, {
          ...user,
          name: savedProfile.name,
          phone: savedProfile.mobileNumber,
          isProfileComplete: true,
        });
      }

      // 3. Navigate to Home dashboard
      router.replace('/(main)/home');
    } catch (err: unknown) {
      const message =
        (err as any)?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
      dispatch(setProfileError(message));
      setFormError(message);
    } finally {
      dispatch(setProfileLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Profile Details"
        subtitle="Personal Details"
        rightAction={
          <TouchableOpacity
            onPress={handleSignOutPrompt}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="log-out" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        }
      />

      <KeyboardAwareWrapper contentContainerStyle={styles.container}>
        {/* Header Visual & Intro */}
        <View style={styles.introContainer}>
          <View style={styles.avatarBadge}>
            <Feather name="user-check" size={28} color={colors.primary} />
          </View>
          <Text style={styles.heading}>Tell us about yourself</Text>
          <Text style={styles.subheading}>
            Add your primary contact and location details to help us customize your household tasks.
          </Text>
        </View>

        {/* Error Banner */}
        {formError && (
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={18} color={colors.error} />
            <Text style={styles.errorBannerText}>{formError}</Text>
          </View>
        )}

        {/* Form Inputs */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <Input
            label="Full Name *"
            placeholder="e.g. Aarav Sharma"
            value={nameField.value}
            onChangeText={nameField.setValue}
            onBlur={nameField.onBlur}
            error={nameField.error}
            leftIcon="user"
            autoCapitalize="words"
            returnKeyType="next"
          />

          {/* Mobile Number with +91 non-editable prefix */}
          <Input
            label="Mobile Number *"
            placeholder="98765 43210"
            value={mobileField.value}
            onChangeText={(text) => {
              // Strip non-digits and cap at 10 digits
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

          {/* Delivery / Household Address */}
          <Input
            label="Home / Delivery Address *"
            placeholder="House / Flat No., Apartment, Street, Landmark, City & PIN"
            value={addressField.value}
            onChangeText={addressField.setValue}
            onBlur={addressField.onBlur}
            error={addressField.error}
            leftIcon="map-pin"
            multiline
            numberOfLines={3}
            returnKeyType="next"
          />

          {/* Business / Company Name (Optional) */}
          <Input
            label="Business Name (Optional)"
            placeholder="e.g. Acme Corp"
            value={businessField.value}
            onChangeText={businessField.setValue}
            leftIcon="briefcase"
            returnKeyType="done"
            onSubmitEditing={handleSaveProfile}
          />
        </View>
      </KeyboardAwareWrapper>

      {/* Fixed Bottom Action CTA */}
      <BottomAction>
        <Button
          label="Save & Continue"
          onPress={handleSaveProfile}
          loading={isLoading}
          fullWidth
          size="lg"
          icon="arrow-right"
          iconPosition="right"
        />
      </BottomAction>
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
    paddingBottom: spacing.xxl,
  },
  introContainer: {
    marginBottom: spacing.xl,
  },
  avatarBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorBannerText: {
    ...typography.caption,
    color: colors.error,
    flex: 1,
  },
  formSection: {
    marginBottom: spacing.md,
  },
});
