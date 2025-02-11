import { withRetry, RetryError, defaultRetryOptions } from '../retryManager';

describe('RetryManager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('succeeds on first try', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    const result = await withRetry(operation);
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries until success', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');

    const result = await withRetry(operation);
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('fails after max attempts', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Always fails'));

    await expect(withRetry(operation)).rejects.toThrow(RetryError);
    expect(operation).toHaveBeenCalledTimes(defaultRetryOptions.maxAttempts);
  });

  it('respects custom retry options', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Fails'));
    const customOptions = {
      maxAttempts: 2,
      initialDelay: 100,
      maxDelay: 200
    };

    await expect(withRetry(operation, customOptions)).rejects.toThrow(RetryError);
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('implements exponential backoff', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValue('success');

    const retryPromise = withRetry(operation);
    
    // First attempt fails immediately
    await jest.advanceTimersByTime(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt after initial delay
    await jest.advanceTimersByTime(defaultRetryOptions.initialDelay);
    expect(operation).toHaveBeenCalledTimes(2);

    // Third attempt after exponential delay
    await jest.advanceTimersByTime(defaultRetryOptions.initialDelay * defaultRetryOptions.backoffFactor);
    expect(operation).toHaveBeenCalledTimes(3);

    const result = await retryPromise;
    expect(result).toBe('success');
  });

  it('handles timeouts', async () => {
    const slowOperation = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, defaultRetryOptions.timeout + 1000))
    );

    await expect(withRetry(slowOperation)).rejects.toThrow('Operation timed out');
  });

  it('includes error details in RetryError', async () => {
    const originalError = new Error('Original error');
    const operation = jest.fn().mockRejectedValue(originalError);

    try {
      await withRetry(operation);
    } catch (error) {
      expect(error).toBeInstanceOf(RetryError);
      if (error instanceof RetryError) {
        expect(error.attempts).toBe(defaultRetryOptions.maxAttempts);
        expect(error.lastError).toBe(originalError);
      }
    }
  });

  it('applies jitter to retry delays', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValue('success');

    const retryPromise = withRetry(operation);
    
    // First attempt + initial delay + jitter
    await jest.advanceTimersByTime(defaultRetryOptions.initialDelay + 500);
    expect(operation).toHaveBeenCalledTimes(2);

    await retryPromise;
    Math.random['mockRestore']();
  });

  it('respects max delay limit', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockRejectedValueOnce(new Error('Third failure'))
      .mockResolvedValue('success');

    const retryPromise = withRetry(operation);
    
    let totalDelay = 0;
    for (let i = 0; i < 3; i++) {
      await jest.advanceTimersByTime(defaultRetryOptions.maxDelay);
      totalDelay += defaultRetryOptions.maxDelay;
    }

    expect(totalDelay).toBeLessThanOrEqual(defaultRetryOptions.maxDelay * 3);
    
    const result = await retryPromise;
    expect(result).toBe('success');
  });

  it('handles non-Error rejections', async () => {
    const operation = jest.fn().mockRejectedValue('string error');

    await expect(withRetry(operation)).rejects.toThrow(RetryError);
    expect(operation).toHaveBeenCalledTimes(defaultRetryOptions.maxAttempts);
  });
});