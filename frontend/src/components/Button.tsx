/**
 * Button Component
 *
 * Primary CTA component with variants, sizes, loading, and disabled states.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<ButtonVariant, { container: ViewStyle; text: TextStyle; loaderColor: string }> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.textOnPrimary },
    loaderColor: colors.white,
  },
  secondary: {
    container: { backgroundColor: colors.primaryLight },
    text: { color: colors.primary },
    loaderColor: colors.primary,
  },
  outline: {
    container: {
      backgroundColor: colors.transparent,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    text: { color: colors.primary },
    loaderColor: colors.primary,
  },
  ghost: {
    container: { backgroundColor: colors.transparent },
    text: { color: colors.primary },
    loaderColor: colors.primary,
  },
};

const SIZE_STYLES: Record<ButtonSize, { container: ViewStyle; text: TextStyle; iconSize: number }> = {
  sm: {
    container: { height: 40, paddingHorizontal: spacing.lg },
    text: typography.buttonSmall,
    iconSize: 16,
  },
  md: {
    container: { height: 48, paddingHorizontal: spacing.xl },
    text: typography.button,
    iconSize: 18,
  },
  lg: {
    container: { height: 56, paddingHorizontal: spacing.xxl },
    text: typography.button,
    iconSize: 20,
  },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.loaderColor} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Feather
              name={icon}
              size={sizeStyle.iconSize}
              color={isDisabled ? colors.disabledText : (variantStyle.text.color as string)}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              sizeStyle.text,
              variantStyle.text,
              isDisabled && styles.disabledText,
            ]}
          >
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <Feather
              name={icon}
              size={sizeStyle.iconSize}
              color={isDisabled ? colors.disabledText : (variantStyle.text.color as string)}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.disabledText,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
