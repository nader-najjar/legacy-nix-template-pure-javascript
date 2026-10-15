import { logger } from './shared/utilities/LoggerUtility.ts';

/**
 * Manages application lifecycle and graceful shutdown.
 *
 * <p>Shutdown pattern:
 * <ol>
 *   <li>SIGTERM/SIGINT fires the registered shutdown hook, which sets a flag and waits on a latch.</li>
 *   <li>Long-running executors observe {@link isShutdownRequested} at safe boundaries
 *       (e.g., between loop iterations) and stop accepting new work.</li>
 *   <li>Main performs all resource cleanup in its own {@code finally} block, then calls
 *       {@link signalDone} to unblock the hook.</li>
 *   <li>The process exits after Main calls process.exit().</li>
 * </ol>
 *
 * <p>Correctness is guaranteed by idempotency: dying at any point (including SIGKILL,
 * which bypasses hooks entirely) leaves the system in a consistent state. Graceful
 * shutdown only improves efficiency - it is never required for correctness.
 */
export class LifecycleManager {

  private static readonly SHUTDOWN_GRACE_PERIOD_MS = 10_000;
  private static shutdownRequested = false;
  private static doneResolve: (() => void) | undefined;

  private constructor() { }

  /**
   * Registers SIGTERM and SIGINT handlers that signal main to stop and wait for it to finish.
   */
  static registerShutdownHook(): void {
    const handler = async (): Promise<void> => {
      logger.debug('Signal received - signaling main to stop');
      LifecycleManager.shutdownRequested = true;

      const finished = await new Promise<boolean>((resolve) => {
        LifecycleManager.doneResolve = () => resolve(true);
        setTimeout(() => resolve(false), LifecycleManager.SHUTDOWN_GRACE_PERIOD_MS);
      });

      if (!finished) {
        const gracePeriodSeconds = LifecycleManager.SHUTDOWN_GRACE_PERIOD_MS / 1_000;
        logger.warn(`Main did not finish within ${gracePeriodSeconds}s grace period; process will exit`);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => { void handler(); });
    process.on('SIGINT', () => { void handler(); });
  }

  /**
   * Returns true if SIGTERM or SIGINT has been received.
   * Long-running executors should poll this at safe boundaries to stop cleanly.
   */
  static isShutdownRequested(): boolean {
    return LifecycleManager.shutdownRequested;
  }

  /**
   * Signals that main has completed all work and cleanup.
   * Must be called from main's finally block to unblock the shutdown hook.
   */
  static signalDone(): void {
    LifecycleManager.doneResolve?.();
  }

}
