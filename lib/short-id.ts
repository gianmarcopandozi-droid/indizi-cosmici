import { customAlphabet } from 'nanoid';

const alfabeto = '23456789abcdefghjkmnpqrstuvwxyz';
const generaShareId = customAlphabet(alfabeto, 8);

export function newShareId(): string {
  return generaShareId();
}
