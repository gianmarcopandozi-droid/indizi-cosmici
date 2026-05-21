/**
 * Gateway per asset visuali. Restituisce sempre un percorso valido:
 * - se l'asset master (.jpg/.png/.svg) esiste in public/assets/, lo usa
 * - altrimenti fallback al placeholder procedurale
 *
 * Questo permette di sostituire un asset master senza toccare il codice.
 */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { Segno } from './zodiac';
import { ANIMALI_DISPONIBILI } from './animali';

const ROOT = join(process.cwd(), 'public');

function exists(rel: string): boolean {
  try { return existsSync(join(ROOT, rel)); } catch { return false; }
}

const ANIMALE_EXTS: Array<[string, string]> = [
  ['png', 'image/png'],
  ['jpg', 'image/jpeg'],
  ['jpeg', 'image/jpeg'],
  ['webp', 'image/webp']
];

/**
 * Ritorna l'illustrazione animale del segno come data URI (per <img> in Satori),
 * oppure null se non esiste alcun file. Solo immagini raster vere — nessun SVG finto.
 */
export function getAnimaleDataUri(segno: Segno): string | null {
  for (const [ext, mime] of ANIMALE_EXTS) {
    const rel = `assets/animali/${segno}.${ext}`;
    if (exists(rel)) {
      try {
        const buf = readFileSync(join(ROOT, rel));
        return `data:${mime};base64,${buf.toString('base64')}`;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Animale da usare per un segno: il suo se disponibile, altrimenti un fallback
 * tra i 3 pronti (deterministico per segno). Ritorna { dataUri, segnoUsato } o null.
 */
export function getAnimaleConFallback(
  segno: Segno
): { dataUri: string; segnoUsato: Segno } | null {
  const diretto = getAnimaleDataUri(segno);
  if (diretto) return { dataUri: diretto, segnoUsato: segno };
  if (ANIMALI_DISPONIBILI.length === 0) return null;
  // fallback deterministico: hash semplice del nome segno → indice
  let h = 0;
  for (let i = 0; i < segno.length; i++) h = (h * 31 + segno.charCodeAt(i)) >>> 0;
  const pick = ANIMALI_DISPONIBILI[h % ANIMALI_DISPONIBILI.length];
  const fb = getAnimaleDataUri(pick);
  return fb ? { dataUri: fb, segnoUsato: pick } : null;
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
