import type { Segno } from './zodiac';

/**
 * Mapping segno → animale guida (label italiana per il wallpaper).
 * I file immagine vivono in public/assets/animali/{segno}.png (o .jpg/.webp).
 * Solo alcuni segni hanno l'asset pronto; gli altri usano fallback (vedi lib/assets.ts).
 */
export const ANIMALE_LABEL: Record<Segno, string> = {
  ariete: 'Aquila',
  toro: 'Cervo',
  gemelli: 'Volpe',
  cancro: 'Cane',
  leone: 'Leone',
  vergine: 'Civetta',
  bilancia: 'Colibrì',
  scorpione: 'Serpente',
  sagittario: 'Lupo',
  capricorno: 'Orso',
  acquario: 'Farfalla',
  pesci: 'Gatto'
};

/** Segni per cui esiste l'illustrazione raster (set completo dei 12). */
export const ANIMALI_DISPONIBILI: Segno[] = [
  'ariete',
  'toro',
  'gemelli',
  'cancro',
  'leone',
  'vergine',
  'bilancia',
  'scorpione',
  'sagittario',
  'capricorno',
  'acquario',
  'pesci'
];
