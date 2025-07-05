import { createCreditor } from '../src/services/creditor.service';

describe('creditor.service.createCreditor', () => {
  test('returns new id', async () => {
    const db = { query: jest.fn().mockResolvedValue({ rows: [{ id: 'c1' }] }) } as any;
    const id = await createCreditor(db, 'tenant1', { partyName: 'A' } as any);
    expect(id).toBe('c1');
  });
});
