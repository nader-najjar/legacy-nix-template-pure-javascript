import { injectable } from 'inversify';
import { logger } from '../../shared/utilities/LoggerUtility.ts';

/**
 * Main business logic executor.
 */
@injectable()
export class Executor {

  execute(args: string[]): void {
    logger.info({ args: args }, 'Executor invoked');
  }
}
