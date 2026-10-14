import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

describe('LoggerUtility', () => {
  it('defaults to informational logging without process metadata', async () => {
    vi.stubEnv('LOG_LEVEL', undefined);
    const { logger } = await import('../../../main/shared/utilities/LoggerUtility.ts');

    expect(logger.isLevelEnabled('info')).toBe(true);
    expect(logger.isLevelEnabled('debug')).toBe(false);
    expect(logger.bindings()).toEqual({});
  });

  it('enables debug logging when configured', async () => {
    vi.stubEnv('LOG_LEVEL', 'debug');
    const { logger } = await import('../../../main/shared/utilities/LoggerUtility.ts');

    expect(logger.isLevelEnabled('debug')).toBe(true);
  });
});
