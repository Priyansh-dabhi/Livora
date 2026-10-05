/**
 * Helper to extract user-friendly error messages from RTK Query / fetch errors
 */
export function extractErrorMessage(
  err: any,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (!err) return fallback;

  // Network / Connection failure
  if (err.status === 'FETCH_ERROR') {
    return 'Cannot connect to server. Please verify backend is running and your device is connected to the same network.';
  }

  // Timeout failure
  if (err.status === 'TIMEOUT_ERROR') {
    return 'The server took too long to respond. Please check your connection and try again.';
  }

  // Backend ApiError response: { success: false, message: '...', errors?: [...] }
  if (err.data) {
    if (typeof err.data.message === 'string' && err.data.message.trim()) {
      return err.data.message;
    }
    if (Array.isArray(err.data.errors) && err.data.errors.length > 0) {
      const first = err.data.errors[0];
      if (typeof first === 'string') return first;
      if (typeof first?.message === 'string') return first.message;
    }
  }

  if (typeof err.error === 'string' && err.error.trim()) {
    return err.error;
  }

  if (typeof err.message === 'string' && err.message.trim()) {
    return err.message;
  }

  return fallback;
}
