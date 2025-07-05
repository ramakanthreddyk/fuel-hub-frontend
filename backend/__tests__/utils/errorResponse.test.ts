import { errorResponse } from '../../src/utils/errorResponse';

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any;

describe('errorResponse helper', () => {
  test('returns standardized structure', () => {
    errorResponse(res, 401, 'Unauthorized');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorized' });
  });
});
