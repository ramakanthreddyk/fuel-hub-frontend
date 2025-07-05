import { listNozzleReadings } from '../src/services/nozzleReading.service';

describe('nozzleReading.service.listNozzleReadings', () => {
  test('builds SQL with filters', async () => {
    const db = { query: jest.fn().mockResolvedValue({ rows: [] }) } as any;
    await listNozzleReadings(db, 'tenant1', { nozzleId: 'n1', stationId: 's1' });
    const sql = db.query.mock.calls[0][0] as string;
    expect(sql).toContain('WHERE');
  });
});
