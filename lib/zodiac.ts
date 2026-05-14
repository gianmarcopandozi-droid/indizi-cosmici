export type Segno =
  | 'ariete' | 'toro' | 'gemelli' | 'cancro'
  | 'leone' | 'vergine' | 'bilancia' | 'scorpione'
  | 'sagittario' | 'capricorno' | 'acquario' | 'pesci';

export const SEGNI: Segno[] = [
  'ariete','toro','gemelli','cancro','leone','vergine',
  'bilancia','scorpione','sagittario','capricorno','acquario','pesci'
];

export const SEGNO_GLIFI: Record<Segno, string> = {
  ariete: '♈', toro: '♉', gemelli: '♊', cancro: '♋',
  leone: '♌', vergine: '♍', bilancia: '♎', scorpione: '♏',
  sagittario: '♐', capricorno: '♑', acquario: '♒', pesci: '♓'
};

export const SEGNO_LABEL: Record<Segno, string> = {
  ariete: 'Ariete', toro: 'Toro', gemelli: 'Gemelli', cancro: 'Cancro',
  leone: 'Leone', vergine: 'Vergine', bilancia: 'Bilancia', scorpione: 'Scorpione',
  sagittario: 'Sagittario', capricorno: 'Capricorno', acquario: 'Acquario', pesci: 'Pesci'
};

export const MESI_LABEL = [
  '', 'gennaio','febbraio','marzo','aprile','maggio','giugno',
  'luglio','agosto','settembre','ottobre','novembre','dicembre'
];

/** Calcola segno zodiacale da giorno + mese (1-based mese) */
export function calcolaSegno(giorno: number, mese: number): Segno {
  const md = mese * 100 + giorno;
  if (md >= 321 && md <= 419) return 'ariete';
  if (md >= 420 && md <= 520) return 'toro';
  if (md >= 521 && md <= 620) return 'gemelli';
  if (md >= 621 && md <= 722) return 'cancro';
  if (md >= 723 && md <= 822) return 'leone';
  if (md >= 823 && md <= 922) return 'vergine';
  if (md >= 923 && md <= 1022) return 'bilancia';
  if (md >= 1023 && md <= 1121) return 'scorpione';
  if (md >= 1122 && md <= 1221) return 'sagittario';
  if (md >= 1222 || md <= 119) return 'capricorno';
  if (md >= 120 && md <= 218) return 'acquario';
  return 'pesci';
}

/** Coordinate normalizzate (0..1) delle stelle della costellazione di ogni segno */
export const COSTELLAZIONI: Record<Segno, Array<{x: number; y: number; r: number}>> = {
  ariete: [{x:.2,y:.3,r:2.5},{x:.4,y:.25,r:2},{x:.55,y:.4,r:3},{x:.7,y:.5,r:2}],
  toro: [{x:.15,y:.5,r:2.5},{x:.3,y:.4,r:3},{x:.5,y:.45,r:2},{x:.65,y:.35,r:2.5},{x:.8,y:.55,r:2}],
  gemelli: [{x:.25,y:.2,r:3},{x:.25,y:.5,r:2},{x:.25,y:.75,r:2.5},{x:.7,y:.2,r:3},{x:.7,y:.5,r:2},{x:.7,y:.75,r:2.5}],
  cancro: [{x:.3,y:.35,r:2},{x:.45,y:.5,r:3},{x:.6,y:.4,r:2.5},{x:.7,y:.6,r:2}],
  leone: [{x:.2,y:.6,r:2.5},{x:.35,y:.5,r:3},{x:.5,y:.4,r:2},{x:.65,y:.5,r:2.5},{x:.8,y:.65,r:3}],
  vergine: [{x:.25,y:.3,r:2},{x:.4,y:.45,r:2.5},{x:.5,y:.6,r:3},{x:.65,y:.5,r:2},{x:.75,y:.7,r:2.5}],
  bilancia: [{x:.3,y:.4,r:2.5},{x:.5,y:.3,r:3},{x:.7,y:.4,r:2.5},{x:.5,y:.65,r:2}],
  scorpione: [{x:.2,y:.3,r:2},{x:.3,y:.45,r:2.5},{x:.45,y:.55,r:3},{x:.6,y:.5,r:2},{x:.75,y:.4,r:2.5},{x:.8,y:.25,r:2}],
  sagittario: [{x:.2,y:.5,r:2.5},{x:.4,y:.4,r:3},{x:.55,y:.55,r:2},{x:.7,y:.35,r:2.5},{x:.85,y:.5,r:2}],
  capricorno: [{x:.25,y:.45,r:2.5},{x:.4,y:.3,r:2},{x:.55,y:.5,r:3},{x:.7,y:.4,r:2.5},{x:.8,y:.6,r:2}],
  acquario: [{x:.2,y:.35,r:2},{x:.35,y:.5,r:2.5},{x:.5,y:.4,r:3},{x:.65,y:.55,r:2},{x:.8,y:.45,r:2.5}],
  pesci: [{x:.2,y:.35,r:2.5},{x:.35,y:.5,r:2},{x:.5,y:.6,r:2.5},{x:.65,y:.5,r:3},{x:.8,y:.35,r:2}]
};
