interface RetryOptions {
  retries?: number;
  delay?: number;
  onError?: (error: Error) => void;
}

export const retry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const { retries = 3, delay = 1000, onError } = options;
  let lastError: Error;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (onError) onError(lastError);
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};