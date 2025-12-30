/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Result of successful function call
 */
export async function withRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 2000,
    maxDelay = 16000,
    backoffFactor = 2,
    onRetry = null
  } = options;

  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (isNonRetryableError(error)) {
        throw error;
      }

      // Last attempt, throw error
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, maxRetries, delay, error);
      } else {
        console.log(`⏳ Retry ${attempt + 1}/${maxRetries} after ${delay}ms... (${error.message})`);
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Check if error should not be retried
 */
function isNonRetryableError(error) {
  // Don't retry on authentication errors
  if (error.status === 401 || error.status === 403) {
    return true;
  }

  // Don't retry on invalid request errors
  if (error.status === 400) {
    return true;
  }

  // Retry on rate limits and server errors
  return false;
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  withRetry
};
