import { createHash } from 'crypto';

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT;
  if (!salt) return null;
  return createHash('sha256').update(ip + salt).digest('hex');
}

export function extractIp(req: Request): string | null {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}
