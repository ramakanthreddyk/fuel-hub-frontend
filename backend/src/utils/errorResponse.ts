import { Response } from 'express';

export function errorResponse(
  res: Response,
  status = 400,
  message = 'Bad Request',
  details?: { field: string; message: string }[]
) {
  const payload: any = { success: false, message };
  if (details) payload.details = details;
  return res.status(status).json(payload);
}
