import 'reflect-metadata';
import type { Context } from 'aws-lambda';
import { awsClientsModule } from './composition/AWSClientsModule.ts';
import { createContainer } from './composition/ContainerFactory.ts';
import { environmentModule } from './composition/EnvironmentModule.ts';
import { Executor } from './execution/Executor.ts';
import { getLogger, runWithLogContext } from './shared/utilities/LoggerUtility.ts';

const LOGGER = getLogger('LambdaHandler');

const executor = createContainer(environmentModule, awsClientsModule).get(Executor);

export async function handler(event: unknown, context: Context): Promise<void> {
  await runWithLogContext({ awsRequestId: context.awsRequestId }, async () => {
    try {
      await executor.execute([JSON.stringify(event)]);
    } catch (error) {
      LOGGER.error(error, 'Technical exception occurred at software entrypoint level');
      throw error;
    }
  });
}
