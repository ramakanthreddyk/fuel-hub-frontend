import { Response } from 'express';

export function successResponse(
  res: Response,
  data: any,
  message?: string,
  status = 200
) {
  const payload: any = { success: true, data };
  if (message) payload.message = message;
  return res.status(status).json(payload);
}
