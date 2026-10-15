import { AsyncLocalStorage } from 'node:async_hooks';
import pino, { type Logger } from 'pino';

type LogContext = Readonly<Record<string, string>>;

const logContextStorage = new AsyncLocalStorage<LogContext>();

const rootLogger = pino(
  {
    level: process.env['LOG_LEVEL']?.toLowerCase() ?? 'info',
    messageKey: 'message',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      bindings: () => ({}),
      level: (label) => ({ level: label.toUpperCase() })
    },
    mixin: () => ({ ...logContextStorage.getStore() })
  },
  pino.destination({ dest: 1, sync: true })
);

export function getLogger(loggerName: string): Logger {
  return rootLogger.child({ loggerName });
}

export function runWithLogContext<T>(context: LogContext, work: () => T): T {
  return logContextStorage.run(context, work);
}
