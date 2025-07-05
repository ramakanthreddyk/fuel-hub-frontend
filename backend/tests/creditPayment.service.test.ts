import { createCreditPayment } from '../src/services/creditor.service';
import { isDateFinalized } from '../src/services/reconciliation.service';

jest.mock('../src/services/reconciliation.service', () => ({
  isDateFinalized: jest.fn()
}));

describe('creditPayment.createCreditPayment', () => {
  const db = {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    }),
  } as any;

  test('throws when day finalized', async () => {
    (isDateFinalized as jest.Mock).mockResolvedValue(true);
    await expect(
      createCreditPayment(db, 't1', { creditorId: 'c1', amount: 5 } as any, 'u1')
    ).rejects.toBeInstanceOf(Error);
  });
});
