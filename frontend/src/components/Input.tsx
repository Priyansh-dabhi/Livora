/**
 * Input Component
 *
 * Styled text input with label, error display, icons, and accessibility.
 */

import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '@/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string | null;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  /** If true, renders a multiline input with taller height */
  multiline?: boolean;
  /** Non-editable prefix displayed at the start of the input (e.g. "+91") */
  prefix?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    secureTextEntry,
    multiline = false,
    prefix,
    ...textInputProps
  },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const isSecure = secureTextEntry && !isSecureVisible;
  const showPasswordToggle = secureTextEntry;
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          multiline && styles.inputMultiline,
        ]}
      >
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={18}
            color={hasError ? colors.error : isFocused ? colors.primary : colors.textTertiary}
            style={[styles.leftIcon, multiline && styles.leftIconMultiline]}
          />
        )}

        {prefix && (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>{prefix}</Text>
            <View style={styles.prefixDivider} />
          </View>
        )}

        <TextInput
          ref={ref}
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            prefix ? styles.inputWithPrefix : null,
            (rightIcon || showPasswordToggle) ? styles.inputWithRightIcon : null,
            multiline && styles.textAreaInput,
          ]}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.primary}
          secureTextEntry={isSecure}
          multiline={multiline}
          numberOfLines={multiline ? (textInputProps.numberOfLines ?? 3) : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          accessibilityLabel={label ?? textInputProps.placeholder}
          {...textInputProps}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            style={styles.rightIconButton}
            accessibilityLabel={isSecureVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather
              name={isSecureVisible ? 'eye-off' : 'eye'}
              size={18}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather
              name={rightIcon}
              size={18}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={12} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  inputFocused: {
    borderColor: colors.borderFocused,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  inputMultiline: {
    minHeight: 100,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    ...typography.input,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'android' ? 10 : spacing.md,
  },
  textAreaInput: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithPrefix: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
  },
  prefixText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  prefixDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  leftIcon: {
    marginLeft: spacing.lg,
  },
  leftIconMultiline: {
    marginTop: Platform.OS === 'android' ? 17 : 16,
  },
  rightIconButton: {
    padding: spacing.md,
    marginRight: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginLeft: spacing.xs,
  },
});
