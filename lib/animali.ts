import type { Segno } from './zodiac';

/**
 * Mapping segno → animale guida (label italiana per il wallpaper).
 * I file immagine vivono in public/assets/animali/{segno}.png (o .jpg/.webp).
 * Solo alcuni segni hanno l'asset pronto; gli altri usano fallback (vedi lib/assets.ts).
 */
export const ANIMALE_LABEL: Record<Segno, string> = {
  ariete: 'Falco',
  toro: 'Cervo',
  gemelli: 'Volpe',
  cancro: 'Balena',
  leone: 'Leone',
  vergine: 'Civetta',
  bilancia: 'Cigno',
  scorpione: 'Serpente',
  sagittario: 'Cavallo',
  capricorno: 'Stambecco',
  acquario: 'Farfalla',
  pesci: 'Delfino'
};

/** Segni per cui esiste già l'illustrazione raster (V1 test estetico). */
export const ANIMALI_DISPONIBILI: Segno[] = ['toro', 'gemelli', 'vergine'];
