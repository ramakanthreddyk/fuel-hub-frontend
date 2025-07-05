import prisma from '../src/utils/prisma';
import { calculateTankLevel } from '../src/services/fuelInventory.service';

jest.mock('../src/utils/prisma', () => ({
  fuelDelivery: { aggregate: jest.fn() },
  sale: { aggregate: jest.fn() }
}));

describe('fuelInventory.calculateTankLevel', () => {
  test('returns delivered minus sold volume', async () => {
    (prisma.fuelDelivery.aggregate as jest.Mock).mockResolvedValue({ _sum: { volume: 120 } });
    (prisma.sale.aggregate as jest.Mock).mockResolvedValue({ _sum: { volume: 80 } });
    const vol = await calculateTankLevel({} as any, 't1', 's1', 'petrol');
    expect(vol).toBe(40);
  });
});
