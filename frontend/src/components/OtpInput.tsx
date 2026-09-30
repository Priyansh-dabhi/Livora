/**
 * OtpInput Component
 *
 * 6-cell OTP input with auto-focus advancement and paste support.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { colors, spacing, typography, radius } from '@/theme';

const OTP_LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChange,
  error = false,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Split value into individual cells
  const digits = value.split('').slice(0, OTP_LENGTH);

  // Shake animation on error
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error, shakeAnim]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Handle paste (user pastes full OTP)
      if (text.length > 1) {
        const cleaned = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
        onChange(cleaned);
        const nextIndex = Math.min(cleaned.length, OTP_LENGTH - 1);
        inputRefs.current[nextIndex]?.focus();
        return;
      }

      // Single digit input
      const newDigits = [...digits];
      // Pad with empty strings if needed
      while (newDigits.length < OTP_LENGTH) {
        newDigits.push('');
      }
      newDigits[index] = text.replace(/\D/g, '');
      const newOtp = newDigits.join('');
      onChange(newOtp);

      // Auto-advance to next cell
      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, onChange],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
        // Move focus back on backspace with empty cell
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits, onChange],
  );

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}
    >
      {Array.from({ length: OTP_LENGTH }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = !!digits[index];

        return (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[
              styles.cell,
              isFocused && styles.cellFocused,
              hasValue && styles.cellFilled,
              error && styles.cellError,
            ]}
            value={digits[index] ?? ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            keyboardType="number-pad"
            maxLength={index === 0 ? OTP_LENGTH : 1} // Allow paste on first cell
            editable={!disabled}
            autoFocus={autoFocus && index === 0}
            selectTextOnFocus
            accessibilityLabel={`OTP digit ${index + 1} of ${OTP_LENGTH}`}
            accessibilityRole="text"
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  cell: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    textAlign: 'center',
    ...typography.h2,
    color: colors.textPrimary,
  },
  cellFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  cellFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.highlightMint,
  },
  cellError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
});
