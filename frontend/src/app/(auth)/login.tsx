/**
 * Login Screen
 *
 * Handles user login with email and password, validation, demo autofill,
 * unverified user redirection, and session persistence.
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
import {
  useAppDispatch,
  useAppSelector,
  loginSuccess,
  setAuthLoading,
  setAuthError,
  setProfile,
  setSelectedTaskIds,
} from '@/store';
import { login as mockLogin } from '@/services/mockAuthService';
import {
  saveSession,
  getProfileData,
  getSelectedTaskIds,
} from '@/utils/storage';
import { MOCK_USER_CREDENTIALS } from '@/constants';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const params = useLocalSearchParams<{ verifiedEmail?: string; registeredEmail?: string }>();

  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const emailField = useFormField({
    initialValue: params.verifiedEmail || params.registeredEmail || '',
    validate: (val) => {
      if (!val.trim()) return 'Email is required';
      if (!isValidEmail(val)) return 'Please enter a valid email address';
      return null;
    },
  });

  const passwordField = useFormField({
    initialValue: '',
    validate: (val) => {
      if (!val) return 'Password is required';
      return null;
    },
  });

  useEffect(() => {
    if (params.verifiedEmail) {
      setSuccessNotice('Email verified successfully! You can now sign in.');
    }
  }, [params.verifiedEmail]);

  const handleAutofillDemo = () => {
    emailField.setValue(MOCK_USER_CREDENTIALS.email);
    passwordField.setValue(MOCK_USER_CREDENTIALS.password);
    setFormError(null);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Demo Mode',
      `Use the demo account to sign in:\n\nEmail: ${MOCK_USER_CREDENTIALS.email}\nPassword: ${MOCK_USER_CREDENTIALS.password}`,
      [
        { text: 'Autofill Credentials', onPress: handleAutofillDemo },
        { text: 'OK', style: 'cancel' },
      ],
    );
  };

  const handleLogin = async () => {
    setFormError(null);
    setSuccessNotice(null);

    const isEmailValid = emailField.runValidation();
    const isPasswordValid = passwordField.runValidation();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    dispatch(setAuthLoading(true));

    try {
      const response = await mockLogin({
        email: emailField.value.trim(),
        password: passwordField.value,
      });

      // Persist session
      await saveSession(response.token, response.user);
      dispatch(loginSuccess(response));

      // Hydrate stored profile and tasks if available
      const storedProfile = await getProfileData();
      if (storedProfile) {
        dispatch(setProfile(storedProfile));
      }

      const storedTasks = await getSelectedTaskIds();
      if (storedTasks.length > 0) {
        dispatch(setSelectedTaskIds(storedTasks));
      }

      // Route transition based on user state
      if (!response.user.isProfileComplete && !storedProfile) {
        router.replace('/(onboarding)/profile');
      } else if (storedTasks.length > 0) {
        router.replace('/(main)/home');
      } else {
        router.replace('/(main)/tasks');
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Login failed';

      if (errMessage === 'UNVERIFIED') {
        dispatch(setAuthError(null));
        setFormError('UNVERIFIED');
      } else {
        dispatch(setAuthError(errMessage));
        setFormError(errMessage);
      }
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const handleRedirectToVerification = () => {
    router.push({
      pathname: '/(auth)/verify-email',
      params: { email: emailField.value.trim() },
    });
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
            Sign in to manage your household and lifestyle services.
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
        {formError === 'UNVERIFIED' ? (
          <View style={styles.unverifiedBanner}>
            <View style={styles.unverifiedContent}>
              <Feather name="alert-triangle" size={18} color={colors.accent} />
              <View style={styles.unverifiedTextContainer}>
                <Text style={styles.unverifiedTitle}>Email Not Verified</Text>
                <Text style={styles.unverifiedMessage}>
                  Please verify your email address to continue to your account.
                </Text>
              </View>
            </View>
            <Button
              label="Verify Email Now"
              size="sm"
              variant="outline"
              onPress={handleRedirectToVerification}
              style={styles.verifyCtaButton}
            />
          </View>
        ) : formError ? (
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
            returnKeyType="next"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={passwordField.value}
            onChangeText={passwordField.setValue}
            onBlur={passwordField.onBlur}
            error={passwordField.error}
            leftIcon="lock"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <View style={styles.forgotRow}>
            <TouchableOpacity
              onPress={handleForgotPassword}
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            label="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.submitButton}
          />
        </View>

        {/* Demo Quickfill Card */}
        <TouchableOpacity
          style={styles.demoCard}
          onPress={handleAutofillDemo}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Autofill demo account credentials"
        >
          <View style={styles.demoBadge}>
            <Feather name="zap" size={14} color={colors.primary} />
          </View>
          <View style={styles.demoTextContainer}>
            <Text style={styles.demoTitle}>Quick Demo Sign-In</Text>
            <Text style={styles.demoSubtitle}>
              Tap to autofill: {MOCK_USER_CREDENTIALS.email}
            </Text>
          </View>
          <Feather name="arrow-right" size={16} color={colors.primary} />
        </TouchableOpacity>

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
  unverifiedBanner: {
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  unverifiedContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  unverifiedTextContainer: {
    flex: 1,
  },
  unverifiedTitle: {
    ...typography.label,
    color: colors.textPrimary,
  },
  unverifiedMessage: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verifyCtaButton: {
    marginTop: spacing.sm,
    borderColor: colors.accent,
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
    marginTop: -spacing.sm,
  },
  forgotText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlightMint,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  demoBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoTextContainer: {
    flex: 1,
  },
  demoTitle: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  demoSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
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
