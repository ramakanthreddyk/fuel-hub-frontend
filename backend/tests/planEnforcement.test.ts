import { beforeCreatePump } from '../src/middleware/planEnforcement';

describe('planEnforcement.beforeCreatePump', () => {
  test('allows pump creation when under limit', async () => {
    const client = {
      query: jest
        .fn()
        .mockResolvedValueOnce({ rows: [{ plan_id: '00000000-0000-0000-0000-000000000002' }] })
        .mockResolvedValueOnce({ rows: [{ count: '3' }] }),
      release: jest.fn(),
    } as any;

    await expect(beforeCreatePump(client, 't1', 's1')).resolves.not.toThrow();
  });

  test('throws error when pump limit reached', async () => {
    const client = {
      query: jest
        .fn()
        .mockResolvedValueOnce({ rows: [{ plan_id: '00000000-0000-0000-0000-000000000002' }] })
        .mockResolvedValueOnce({ rows: [{ count: '8' }] }),
      release: jest.fn(),
    } as any;

    await expect(beforeCreatePump(client, 't1', 's1')).rejects.toThrow('Plan limit exceeded');
  });
});
