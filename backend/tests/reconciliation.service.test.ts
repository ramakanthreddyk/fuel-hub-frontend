import { isDayFinalized } from '../src/services/reconciliation.service';

describe('reconciliation.service.isDayFinalized', () => {
  test('returns boolean', async () => {
    const db = { query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [{ finalized: true }] }) } as any;
    const res = await isDayFinalized(db, 't1', 's1', new Date());
    expect(res).toBe(true);
  });
});
