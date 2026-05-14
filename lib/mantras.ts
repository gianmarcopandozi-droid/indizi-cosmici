import mantras from '@/content/mantras.json';
import type { Segno } from './zodiac';

const POOL = mantras as Record<Segno, string[]>;

/** Seleziona mantra deterministicamente dal pool del segno usando hash dello shareId */
export function selezionaMantra(segno: Segno, shareId: string): string {
  const pool = POOL[segno];
  let hash = 0;
  for (let i = 0; i < shareId.length; i++) {
    hash = ((hash << 5) - hash) + shareId.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % pool.length;
  return pool[idx];
}

export function tuttiMantra(segno: Segno): string[] {
  return POOL[segno];
}
