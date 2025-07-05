import { createCreditPayment } from '../src/services/creditor.service';

const mockClient = {
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue({
    query: jest.fn(),
    release: jest.fn(),
  }),
} as any;

describe('createCreditPayment', () => {
  test('throws ServiceError when day finalized', async () => {
    mockClient.connect.mockResolvedValueOnce({
      query: jest.fn()
        .mockResolvedValueOnce({ rows: [{ finalized: true }] })
        .mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    });
    await expect(
      createCreditPayment(mockClient, 't1', { creditorId: 'c1', amount: 1 } as any, 'u1')
    ).rejects.toBeInstanceOf(Error);
  });
});
