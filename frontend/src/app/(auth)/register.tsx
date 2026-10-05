/**
 * Register Screen
 *
 * User registration with email, password validation checklist,
 * password confirmation, and redirection to OTP verification.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
  isValidEmail,
  isValidPassword,
} from '@/utils/validation';
import { extractErrorMessage } from '@/utils';
import {
  useAppDispatch,
  registerSuccess,
} from '@/store';
import { useRegisterMutation } from '@/services/authApi';

interface PasswordRule {
  label: string;
  test: (val: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: 'At least 8 characters', test: (val) => val.length >= 8 },
  { label: 'One uppercase letter', test: (val) => /[A-Z]/.test(val) },
  { label: 'One lowercase letter', test: (val) => /[a-z]/.test(val) },
  { label: 'One number (0-9)', test: (val) => /\d/.test(val) },
];

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formError, setFormError] = useState<string | null>(null);

  const emailField = useFormField({
    initialValue: '',
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
      if (!isValidPassword(val)) return 'Password does not meet requirements';
      return null;
    },
  });

  const confirmPasswordField = useFormField({
    initialValue: '',
    validate: (val) => {
      if (!val) return 'Please confirm your password';
      if (val !== passwordField.value) return 'Passwords do not match';
      return null;
    },
  });

  const handleRegister = async () => {
    setFormError(null);

    const isEmailValid = emailField.runValidation();
    const isPasswordValid = passwordField.runValidation();
    const isConfirmValid = confirmPasswordField.runValidation();

    if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
      return;
    }

    try {
      const result = await register({
        email: emailField.value.trim(),
        password: passwordField.value,
        confirmPassword: confirmPasswordField.value,
      }).unwrap();

      const user = {
        id: result.data.id,
        email: result.data.email,
        createdAt: (result.data as any).createdAt || new Date().toISOString(),
        isVerified: false,
        isProfileComplete: false,
      };

      dispatch(registerSuccess({ user }));

      // Navigate to email verification screen with registered email
      router.push({
        pathname: '/(auth)/verify-email',
        params: { email: user.email },
      });
    } catch (err: any) {
      console.error('[Register Error]:', err);
      const message = extractErrorMessage(err, 'Registration failed');
      setFormError(message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        showBack
        onBack={() => router.back()}
        title="Livora"
      />
      <KeyboardAwareWrapper contentContainerStyle={styles.container}>
        {/* Title and Subtitle */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join Livora to discover and delegate lifestyle services effortlessly.
          </Text>
        </View>

        {/* Error Banner */}
        {formError && (
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={18} color={colors.error} />
            <Text style={styles.errorBannerText}>{formError}</Text>
          </View>
        )}

        {/* Inputs */}
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
            placeholder="Create a strong password"
            value={passwordField.value}
            onChangeText={(text) => {
              passwordField.setValue(text);
              if (confirmPasswordField.touched) {
                confirmPasswordField.runValidation();
              }
            }}
            onBlur={passwordField.onBlur}
            error={passwordField.error}
            leftIcon="lock"
            secureTextEntry
            returnKeyType="next"
          />

          {/* Live Password Rules Indicator */}
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesHeader}>Password requirements:</Text>
            {PASSWORD_RULES.map((rule, idx) => {
              const passed = rule.test(passwordField.value);
              return (
                <View key={idx} style={styles.ruleRow}>
                  <Feather
                    name={passed ? 'check-circle' : 'circle'}
                    size={14}
                    color={passed ? colors.success : colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.ruleLabel,
                      passed && styles.ruleLabelPassed,
                    ]}
                  >
                    {rule.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPasswordField.value}
            onChangeText={confirmPasswordField.setValue}
            onBlur={confirmPasswordField.onBlur}
            error={confirmPasswordField.error}
            leftIcon="lock"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          {/* Terms text */}
          <Text style={styles.termsText}>
            By creating an account, you agree to Livora's{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <Button
            label="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.submitButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="link"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.footerLink}> Sign in</Text>
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
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  headerContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
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
  rulesContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  rulesHeader: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  ruleLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ruleLabelPassed: {
    color: colors.success,
  },
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  termsLink: {
    color: colors.primary,
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
