import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import prisma from '../src/utils/prisma';
import { createNozzleHandlers } from '../src/controllers/nozzle.controller';

jest.mock('../src/utils/prisma', () => ({
  nozzle: { create: jest.fn() }
}));

const handlers = createNozzleHandlers({} as any);

const req = {
  user: { tenantId: 't1' },
  body: { pumpId: 'p1', nozzleNumber: 1, fuelType: 'petrol' }
} as any;

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
} as any;

describe('nozzle.controller.create', () => {
  test('returns 409 on duplicate nozzle', async () => {
    const error = new PrismaClientKnownRequestError('Duplicate', 'P2002', '1');
    (prisma.nozzle.create as jest.Mock).mockRejectedValueOnce(error);

    await handlers.create(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Nozzle number already exists for this pump.'
    });
  });
});
