import { describe, expect, it, vi } from 'vitest';
import { Executor } from '../../../main/bootstrap/logic/Executor.ts';
import { logger } from '../../../main/shared/utilities/LoggerUtility.ts';

vi.mock('../../../main/shared/utilities/LoggerUtility.ts', () => {
  return {
    logger: {
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn()
    }
  };
});

describe('Executor', () => {

  it('logs invocation with provided arguments', () => {
    const executor = new Executor();
    const args = ['arg1', 'arg2'];

    executor.execute(args);

    expect(logger.info).toHaveBeenCalledWith({ args }, 'Executor invoked');
  });

});
