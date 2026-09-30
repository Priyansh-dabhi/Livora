/**
 * Verify Email Screen
 *
 * OTP verification with countdown timer, resend cooldown, attempts limit,
 * demo autofill, and redirection.
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  OtpInput,
  Button,
  Header,
  KeyboardAwareWrapper,
} from '@/components';
import { colors, spacing, typography, radius } from '@/theme';
import { useCountdown } from '@/hooks';
import {
  useAppDispatch,
  useAppSelector,
  verifyEmailSuccess,
  setAuthLoading,
  setAuthError,
} from '@/store';
import {
  verifyOtp as mockVerifyOtp,
  resendOtp as mockResendOtp,
} from '@/services/mockAuthService';
import {
  MOCK_VALID_OTP,
  OTP_VALIDITY_SECONDS,
  OTP_RESEND_COOLDOWN_SECONDS,
  MAX_OTP_ATTEMPTS,
} from '@/constants';
import { formatCountdown } from '@/utils/validation';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ email?: string }>();
  const user = useAppSelector((state) => state.auth.user);
  const targetEmail = params.email || user?.email || 'you@example.com';

  const [otp, setOtp] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_OTP_ATTEMPTS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 10-minute validity countdown
  const validityCountdown = useCountdown();
  // 30-second resend cooldown
  const resendCooldown = useCountdown();

  // Initialize countdowns on mount
  useEffect(() => {
    validityCountdown.start(OTP_VALIDITY_SECONDS);
    resendCooldown.start(OTP_RESEND_COOLDOWN_SECONDS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isExpired = validityCountdown.secondsLeft === 0 && !validityCountdown.isActive;
  const isBlocked = attemptsRemaining <= 0 || isExpired;

  const handleVerify = useCallback(
    async (codeToVerify?: string) => {
      const code = codeToVerify || otp;

      if (code.length !== 6) {
        setErrorMessage('Please enter all 6 digits of the code.');
        setHasError(true);
        return;
      }

      if (isExpired) {
        setErrorMessage('This verification code has expired. Please request a new one.');
        setHasError(true);
        return;
      }

      if (attemptsRemaining <= 0) {
        setErrorMessage('Maximum attempts reached. Please request a new code.');
        setHasError(true);
        return;
      }

      setErrorMessage(null);
      setSuccessNotice(null);
      setHasError(false);
      setIsSubmitting(true);
      dispatch(setAuthLoading(true));

      try {
        await mockVerifyOtp({
          email: targetEmail,
          otp: code,
        });

        dispatch(verifyEmailSuccess());
        setSuccessNotice('Email verified successfully!');

        // Delay slightly for user feedback, then redirect to login
        setTimeout(() => {
          router.replace({
            pathname: '/(auth)/login',
            params: { verifiedEmail: targetEmail },
          });
        }, 800);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Verification failed';
        const newAttempts = attemptsRemaining - 1;
        setAttemptsRemaining(newAttempts);
        setHasError(true);

        if (newAttempts <= 0) {
          setErrorMessage('Maximum attempts reached. Please request a new code.');
        } else {
          setErrorMessage(`${message} (${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining)`);
        }
        dispatch(setAuthError(message));
      } finally {
        setIsSubmitting(false);
        dispatch(setAuthLoading(false));
      }
    },
    [otp, isExpired, attemptsRemaining, targetEmail, dispatch, router],
  );

  const handleOtpChange = (newOtp: string) => {
    setOtp(newOtp);
    if (hasError) {
      setHasError(false);
      setErrorMessage(null);
    }

    // Auto-verify when 6 digits are entered
    if (newOtp.length === 6 && !isBlocked) {
      handleVerify(newOtp);
    }
  };

  const handleResend = async () => {
    if (resendCooldown.isActive) {
      return;
    }

    setErrorMessage(null);
    setHasError(false);
    setOtp('');

    try {
      await mockResendOtp({ email: targetEmail });
      setAttemptsRemaining(MAX_OTP_ATTEMPTS);
      validityCountdown.start(OTP_VALIDITY_SECONDS);
      resendCooldown.start(OTP_RESEND_COOLDOWN_SECONDS);
      setSuccessNotice('A new verification code has been sent.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not resend code';
      Alert.alert('Resend Failed', message);
    }
  };

  const handleAutofillDemoOtp = () => {
    setOtp(MOCK_VALID_OTP);
    handleVerify(MOCK_VALID_OTP);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        showBack
        onBack={() => router.back()}
        title="Email Verification"
      />
      <KeyboardAwareWrapper contentContainerStyle={styles.container}>
        {/* Visual Badge */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Feather name="mail" size={32} color={colors.primary} />
          </View>
        </View>

        {/* Title and Email */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Check your inbox</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to
          </Text>
          <View style={styles.emailChip}>
            <Text style={styles.emailText}>{targetEmail}</Text>
          </View>
        </View>

        {/* Success Notice */}
        {successNotice && (
          <View style={styles.successBanner}>
            <Feather name="check-circle" size={18} color={colors.success} />
            <Text style={styles.successText}>{successNotice}</Text>
          </View>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Feather name="alert-circle" size={18} color={colors.error} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* OTP Input */}
        <View style={styles.otpWrapper}>
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            error={hasError}
            disabled={isBlocked || isSubmitting}
            autoFocus
          />
        </View>

        {/* Validity Countdown */}
        <View style={styles.timerRow}>
          <Feather
            name="clock"
            size={14}
            color={isExpired ? colors.error : colors.textSecondary}
          />
          <Text
            style={[
              styles.timerText,
              isExpired && styles.timerTextExpired,
            ]}
          >
            {isExpired
              ? 'Code has expired'
              : `Code expires in ${formatCountdown(validityCountdown.secondsLeft)}`}
          </Text>
        </View>

        {/* Demo Callout */}
        <TouchableOpacity
          style={styles.demoHint}
          onPress={handleAutofillDemoOtp}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Autofill demo OTP"
        >
          <Feather name="key" size={14} color={colors.primary} />
          <Text style={styles.demoHintText}>
            Demo Code: <Text style={styles.demoBold}>{MOCK_VALID_OTP}</Text> (Tap to autofill)
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <Button
          label="Verify & Continue"
          onPress={() => handleVerify()}
          loading={isSubmitting}
          disabled={otp.length !== 6 || isBlocked}
          fullWidth
          size="lg"
          style={styles.verifyButton}
        />

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendLabel}>Didn't receive the email?</Text>
          {resendCooldown.isActive ? (
            <Text style={styles.resendCooldownText}>
              Resend code in {resendCooldown.secondsLeft}s
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
          )}
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.highlightMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emailChip: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  emailText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    width: '100%',
  },
  successText: {
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
    width: '100%',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    flex: 1,
  },
  otpWrapper: {
    marginVertical: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  timerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  timerTextExpired: {
    color: colors.error,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.highlightMint,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  demoHintText: {
    ...typography.caption,
    color: colors.primary,
  },
  demoBold: {
    fontWeight: '700',
  },
  verifyButton: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  resendContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resendLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  resendCooldownText: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
  },
  resendButtonText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
});
