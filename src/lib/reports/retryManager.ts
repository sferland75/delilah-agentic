export interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  timeout: number;
}

export const defaultRetryOptions: RetryOptions = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000,    // 10 seconds
  backoffFactor: 2,
  timeout: 30000      // 30 seconds
};

export class RetryError extends Error {
  constructor(
    message: string,
    public attempts: number,
    public lastError: Error
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const retryOptions = { ...defaultRetryOptions, ...options };
  let lastError: Error | null = null;
  let delay = retryOptions.initialDelay;

  for (let attempt = 1; attempt <= retryOptions.maxAttempts; attempt++) {
    try {
      // Add timeout to the operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Operation timed out'));
        }, retryOptions.timeout);
      });

      // Race between the operation and timeout
      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]);

      return result;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === retryOptions.maxAttempts) {
        throw new RetryError(
          `Failed after ${attempt} attempts`,
          attempt,
          lastError
        );
      }

      // Calculate next delay with exponential backoff
      delay = Math.min(
        delay * retryOptions.backoffFactor,
        retryOptions.maxDelay
      );

      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  // This should never happen due to the throw above
  throw new Error('Unexpected retry failure');
}