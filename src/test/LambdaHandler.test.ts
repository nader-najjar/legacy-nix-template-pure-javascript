import type { Context } from 'aws-lambda';
import { describe, expect, it, vi } from 'vitest';
import { handler } from '../main/LambdaHandler.ts';

const { execute } = vi.hoisted(() => ({
  execute: vi.fn<(args: readonly string[]) => Promise<void>>()
}));

vi.mock('../main/composition/ContainerFactory.ts', () => ({
  createContainer: vi.fn(() => ({ get: vi.fn(() => ({ execute })) }))
}));

const context = { awsRequestId: 'request-123' } as Context;

describe('LambdaHandler', () => {
  it('passes the event as JSON to the shared executor', async () => {
    const event = { exampleStringField: 'test' };
    execute.mockResolvedValue();

    await handler(event, context);

    expect(execute).toHaveBeenCalledExactlyOnceWith([JSON.stringify(event)]);
  });

  it('propagates failures so Lambda can apply its retry policy', async () => {
    const error = new Error('execution failed');
    execute.mockRejectedValue(error);

    await expect(handler({}, context)).rejects.toBe(error);
  });
});
