/**
 * Login Screen
 *
 * Handles user login step 1: Requesting an OTP using email.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import {
  Input,
  Button,
  KeyboardAwareWrapper,
} from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { useFormField } from '@/hooks';
import { isValidEmail } from '@/utils/validation';
import { extractErrorMessage } from '@/utils';
import { useRequestLoginOtpMutation } from '@/services/authApi';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ verifiedEmail?: string; registeredEmail?: string }>();

  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const [requestOtp, { isLoading }] = useRequestLoginOtpMutation();

  const emailField = useFormField({
    initialValue: params.verifiedEmail || params.registeredEmail || '',
    validate: (val) => {
      if (!val.trim()) return 'Email is required';
      if (!isValidEmail(val)) return 'Please enter a valid email address';
      return null;
    },
  });

  useEffect(() => {
    if (params.verifiedEmail) {
      setSuccessNotice('Email verified successfully! You can now sign in.');
    }
  }, [params.verifiedEmail]);

  const handleRequestOtp = async () => {
    setFormError(null);
    setSuccessNotice(null);

    if (!emailField.runValidation()) {
      return;
    }

    try {
      await requestOtp({ email: emailField.value.trim() }).unwrap();

      router.push({
        pathname: '/(auth)/login-verify-otp',
        params: { email: emailField.value.trim() },
      });
    } catch (err: any) {
      console.error('[Request Login OTP Error]:', err);
      if (err?.status === 403) {
        router.push({
          pathname: '/(auth)/verify-email',
          params: { email: emailField.value.trim() },
        });
      } else {
        const errMessage = extractErrorMessage(err, 'Could not send login code');
        setFormError(errMessage);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAwareWrapper contentContainerStyle={styles.container}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Feather name="feather" size={28} color={colors.primary} />
          </View>
          <Text style={styles.brandName}>Livora</Text>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>
            Sign in securely with an email verification code. No password required.
          </Text>
        </View>

        {/* Success Notice */}
        {successNotice && (
          <View style={styles.noticeContainer}>
            <Feather name="check-circle" size={18} color={colors.success} />
            <Text style={styles.noticeText}>{successNotice}</Text>
          </View>
        )}

        {/* Error Banners */}
        {formError ? (
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={18} color={colors.error} />
            <Text style={styles.errorBannerText}>{formError}</Text>
          </View>
        ) : null}

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={emailField.value}
            onChangeText={emailField.setValue}
            onBlur={emailField.onBlur}
            error={emailField.error}
            leftIcon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleRequestOtp}
          />

          <Button
            label="Send Login Code"
            onPress={handleRequestOtp}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.submitButton}
          />
        </View>

        {/* Register Footer Link */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            accessibilityRole="link"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.footerLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  brandContainer: {
    marginBottom: spacing.xxl,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandName: {
    ...typography.captionMedium,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  heading: {
    ...typography.h1,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  noticeText: {
    ...typography.caption,
    color: colors.success,
    flex: 1,
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
  formContainer: {
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
