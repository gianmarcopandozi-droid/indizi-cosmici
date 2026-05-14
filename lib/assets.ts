/**
 * Gateway per asset visuali. Restituisce sempre un percorso valido:
 * - se l'asset master (.jpg/.png/.svg) esiste in public/assets/, lo usa
 * - altrimenti fallback al placeholder procedurale
 *
 * Questo permette di sostituire un asset master senza toccare il codice.
 */
import { existsSync } from 'fs';
import { join } from 'path';
import type { Segno } from './zodiac';

const ROOT = join(process.cwd(), 'public');

function exists(rel: string): boolean {
  try { return existsSync(join(ROOT, rel)); } catch { return false; }
}

export function getBackground(): string {
  if (exists('assets/backgrounds/notte-base.jpg')) return '/assets/backgrounds/notte-base.jpg';
  if (exists('assets/backgrounds/notte-cinematic.jpg')) return '/assets/backgrounds/notte-cinematic.jpg';
  return ''; // segnala "usa gradient procedurale"
}

export function getGlifoAsset(segno: Segno): string {
  const rel = `assets/glifi/${segno}.svg`;
  if (exists(rel)) return `/${rel}`;
  return ''; // segnala "usa Unicode placeholder"
}

export function getTexture(name: 'grain' | 'stelle-overlay'): string {
  const rel = `assets/textures/${name}.png`;
  if (exists(rel)) return `/${rel}`;
  return '';
}

export function getQuoteBackground(index: 1 | 2 | 3 | 4): string {
  const rel = `assets/quote-backgrounds/quote-${index}.jpg`;
  if (exists(rel)) return `/${rel}`;
  return '';
}
