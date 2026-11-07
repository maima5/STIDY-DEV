import { Response } from 'express';

// Format sukses : { success: true, message?, data, meta? }
// Format error  : { success: false, error: { code, message, details? } }  (lihat errorHandler)
export const ok = (res: Response, data: unknown = null, message?: string, meta?: unknown) =>
  res.status(200).json({ success: true, message, data, meta });

export const created = (res: Response, data: unknown = null, message?: string) =>
  res.status(201).json({ success: true, message, data });
