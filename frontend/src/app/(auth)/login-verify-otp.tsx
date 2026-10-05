/**
 * Login Verify OTP Screen
 *
 * Handles user login step 2: Verifying the OTP and saving session.
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
  loginSuccess,
  setProfile,
  setSelectedTaskIds,
} from '@/store';
import {
  useVerifyLoginOtpMutation,
  useRequestLoginOtpMutation,
} from '@/services/authApi';
import {
  saveSession,
  saveProfileData,
  getProfileData,
  getSelectedTaskIds,
} from '@/utils/storage';
import {
  OTP_VALIDITY_SECONDS,
  OTP_RESEND_COOLDOWN_SECONDS,
  MAX_OTP_ATTEMPTS,
} from '@/constants';
import { formatCountdown, extractErrorMessage } from '@/utils';

export default function LoginVerifyOtpScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email || '';

  const [otp, setOtp] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_OTP_ATTEMPTS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const [verifyLoginOtp, { isLoading: isVerifying }] = useVerifyLoginOtpMutation();
  const [requestOtp, { isLoading: isResending }] = useRequestLoginOtpMutation();

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

      try {
        const response = await verifyLoginOtp({
          email,
          otp: code,
        }).unwrap();

        // 1. Save Token + User
        const userObj = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          phone: response.data.user.phone,
          isVerified: response.data.user.isVerified ?? true,
          isProfileComplete: response.data.user.isProfileComplete ?? Boolean(response.data.user.name),
          createdAt: response.data.user.createdAt ?? new Date().toISOString(),
        };
        await saveSession(response.data.token, userObj);

        // 2. Dispatch to Redux
        dispatch(loginSuccess({ user: userObj, token: response.data.token }));

        // 3. Hydrate profile from backend if user already has completed profile
        if (response.data.user.name && response.data.user.phone) {
          const profileFromUser = {
            id: response.data.user.id,
            userId: response.data.user.id,
            name: response.data.user.name,
            mobileNumber: response.data.user.phone,
            address: (response.data.user as any).address || '',
            businessName: (response.data.user as any).businessName || undefined,
            createdAt: response.data.user.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          dispatch(setProfile(profileFromUser));
          await saveProfileData(profileFromUser);
        } else {
          // Hydrate local state if available (from past usage)
          const storedProfile = await getProfileData();
          if (storedProfile) {
            dispatch(setProfile(storedProfile));
          }
        }

        const storedTasks = await getSelectedTaskIds();
        if (storedTasks.length > 0) {
          dispatch(setSelectedTaskIds(storedTasks));
        }

        // 4. Redirect: new users fill profile details, returning users go to Home
        if (!userObj.isProfileComplete && !response.data.user.name) {
          router.replace('/(onboarding)/profile-details');
        } else {
          router.replace('/(main)/home');
        }
      } catch (err: any) {
        console.error('[Verify Login OTP Error]:', err);
        const message = extractErrorMessage(err, 'Verification failed');
        const newAttempts = attemptsRemaining - 1;
        setAttemptsRemaining(newAttempts);
        setHasError(true);

        if (newAttempts <= 0) {
          setErrorMessage('Maximum attempts reached. Please request a new code.');
        } else {
          setErrorMessage(`${message} (${newAttempts} attempt${newAttempts === 1 ? '' : 's'} remaining)`);
        }
      }
    },
    [otp, isExpired, attemptsRemaining, email, dispatch, router, verifyLoginOtp],
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
      await requestOtp({ email }).unwrap();
      setAttemptsRemaining(MAX_OTP_ATTEMPTS);
      validityCountdown.start(OTP_VALIDITY_SECONDS);
      resendCooldown.start(OTP_RESEND_COOLDOWN_SECONDS);
      setSuccessNotice('A new login code has been sent.');
    } catch (err: any) {
      console.error('[Resend Login OTP Error]:', err);
      const message = extractErrorMessage(err, 'Could not resend code');
      Alert.alert('Resend Failed', message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        showBack
        onBack={() => router.back()}
        title="Login Code"
      />
      <KeyboardAwareWrapper contentContainerStyle={styles.container}>
        {/* Visual Badge */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Feather name="lock" size={32} color={colors.primary} />
          </View>
        </View>

        {/* Title and Email */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Check your inbox</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit login code to
          </Text>
          <View style={styles.emailChip}>
            <Text style={styles.emailText}>{email}</Text>
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
            disabled={isBlocked || isVerifying}
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

        {/* Development Master OTP Hint */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.demoHint}
            onPress={() => handleOtpChange('123456')}
            activeOpacity={0.7}
          >
            <Feather name="zap" size={14} color={colors.primary} />
            <Text style={styles.demoHintText}>
              Dev Mode: Tap to fill <Text style={styles.demoBold}>123456</Text> (or check backend terminal)
            </Text>
          </TouchableOpacity>
        )}

        {/* Submit Button */}
        <Button
          label="Verify Code & Sign In"
          onPress={() => handleVerify()}
          loading={isVerifying}
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
  verifyButton: {
    width: '100%',
    marginBottom: spacing.xl,
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
