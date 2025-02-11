import { ClaudeReportGenerator } from '../claudeReportGenerator';
import claudeClient from '../../../lib/claude';
import { CacheManager } from '../cacheManager';

// Mock the claude client and cache
jest.mock('../../../lib/claude');
jest.mock('../cacheManager');

describe('ClaudeReportGenerator', () => {
  let generator: ClaudeReportGenerator;
  const mockClaudeResponse = {
    content: 'Generated content',
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (claudeClient.chat as jest.Mock).mockResolvedValue(mockClaudeResponse);
    generator = new ClaudeReportGenerator();
  });

  it('generates narrative using Claude API', async () => {
    const result = await generator.generateNarrative(
      'demographics',
      'Test content',
      { personal: 'Client info' }
    );

    expect(result).toBe('Generated content');
    expect(claudeClient.chat).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.any(Array),
        model: expect.any(String),
        temperature: expect.any(Number)
      })
    );
  });

  it('uses cache for repeated requests', async () => {
    const mockCache = new CacheManager();
    const cacheKey = JSON.stringify({
      system: expect.any(String),
      human: expect.any(String)
    });

    // First call - should miss cache
    await generator.generateNarrative(
      'demographics',
      'Test content',
      { personal: 'Client info' }
    );

    // Second call - should hit cache
    await generator.generateNarrative(
      'demographics',
      'Test content',
      { personal: 'Client info' }
    );

    expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
    expect(claudeClient.chat).toHaveBeenCalledTimes(1);
  });

  it('handles API errors gracefully', async () => {
    (claudeClient.chat as jest.Mock).mockRejectedValue(new Error('API Error'));

    await expect(
      generator.generateNarrative(
        'demographics',
        'Test content',
        { personal: 'Client info' }
      )
    ).rejects.toThrow('API Error');
  });

  it('handles malformed API responses', async () => {
    (claudeClient.chat as jest.Mock).mockResolvedValue({
      error: 'Invalid response'
    });

    await expect(
      generator.generateNarrative(
        'demographics',
        'Test content',
        { personal: 'Client info' }
      )
    ).rejects.toThrow('Invalid response');
  });

  it('retries failed requests', async () => {
    (claudeClient.chat as jest.Mock)
      .mockRejectedValueOnce(new Error('Temporary error'))
      .mockResolvedValueOnce(mockClaudeResponse);

    const result = await generator.generateNarrative(
      'demographics',
      'Test content',
      { personal: 'Client info' }
    );

    expect(result).toBe('Generated content');
    expect(claudeClient.chat).toHaveBeenCalledTimes(2);
  });

  it('respects rate limits', async () => {
    const startTime = Date.now();
    
    // Make multiple requests in quick succession
    await Promise.all([
      generator.generateNarrative('demographics', 'Test 1', {}),
      generator.generateNarrative('demographics', 'Test 2', {}),
      generator.generateNarrative('demographics', 'Test 3', {})
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should take at least 2 seconds due to rate limiting
    expect(duration).toBeGreaterThanOrEqual(2000);
  });

  it('pre-warms cache with examples', async () => {
    const examples = {
      demographics: 'Example demographics content',
      medical: 'Example medical content'
    };

    await generator.preWarmCache(examples);
    
    expect(mockCache.set).toHaveBeenCalledTimes(2);
  });

  it('clears cache on demand', () => {
    generator.clearCache();
    expect(mockCache.clear).toHaveBeenCalled();
  });

  it('validates prompts before sending', async () => {
    await expect(
      generator.generateNarrative(
        'invalid_section',
        'Test content',
        {}
      )
    ).rejects.toThrow('Invalid section type');
  });
});