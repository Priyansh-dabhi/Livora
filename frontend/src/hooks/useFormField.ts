/**
 * useFormField Hook
 *
 * Manages a single form field's value, error state, and validation.
 */

import { useState, useCallback } from 'react';

interface UseFormFieldOptions {
  /** Initial value */
  initialValue?: string;
  /** Validation function — returns error message or null */
  validate?: (value: string) => string | null;
}

interface UseFormFieldReturn {
  value: string;
  error: string | null;
  touched: boolean;
  setValue: (value: string) => void;
  setError: (error: string | null) => void;
  onBlur: () => void;
  reset: () => void;
  /** Runs validation and returns whether the field is valid */
  runValidation: () => boolean;
}

export function useFormField(
  options: UseFormFieldOptions = {},
): UseFormFieldReturn {
  const { initialValue = '', validate } = options;

  const [value, setValueState] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const setValue = useCallback(
    (newValue: string) => {
      setValueState(newValue);
      // Clear error when user starts typing (if field was touched)
      if (touched && error) {
        setError(null);
      }
    },
    [touched, error],
  );

  const onBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      setError(validate(value));
    }
  }, [validate, value]);

  const runValidation = useCallback((): boolean => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setError(validationError);
      return validationError === null;
    }
    return true;
  }, [validate, value]);

  const reset = useCallback(() => {
    setValueState(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    setValue,
    setError,
    onBlur,
    reset,
    runValidation,
  };
}
