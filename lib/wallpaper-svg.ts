/**
 * Helper per render wallpaper PNG via SVG → sharp.
 * Fallback robusto se Satori 1080×1920 ha glitch o se font fetch fallisce.
 */
import sharp from 'sharp';
import { SEGNO_GLIFI, SEGNO_LABEL, COSTELLAZIONI, type Segno } from './zodiac';

export interface BuildWallpaperOpts {
  nome: string;
  segno: Segno;
  mantra: string;
  dedicato_a?: string;
  glifo?: string; // override opzionale
  width: number;
  height: number;
}

export type Dimension = '1080x1920' | '1200x630' | '1080x1080';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** PRNG deterministico da seed string */
function mulberry32FromString(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface StarSpec {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}

function generateStars(seed: string, w: number, h: number, count = 40): StarSpec[] {
  const rng = mulberry32FromString(seed);
  const stars: StarSpec[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      cx: Math.floor(rng() * w),
      cy: Math.floor(rng() * h * 0.65), // stelle solo nella metà alta + un po'
      r: 0.6 + rng() * 1.8,
      opacity: 0.4 + rng() * 0.55
    });
  }
  return stars;
}

export function buildWallpaperSVG(opts: BuildWallpaperOpts): string {
  const { nome, segno, mantra, dedicato_a, width: w, height: h } = opts;
  const glifo = opts.glifo ?? SEGNO_GLIFI[segno];
  const segnoLabel = SEGNO_LABEL[segno];
  const seed = `${nome}::${segno}`;
  const stars = generateStars(seed, w, h, w >= 1080 ? 48 : 28);

  // Layout proporzionato in base alla dimensione (verticale vs orizzontale)
  const isPortrait = h > w;
  const glifoCircleR = isPortrait ? 130 : 90;
  const glifoCx = isPortrait ? w / 2 : w * 0.25;
  const glifoCy = isPortrait ? h * 0.28 : h * 0.5;
  const glifoFontSize = isPortrait ? 130 : 95;

  // Costellazione attorno al glifo
  const costell = COSTELLAZIONI[segno];
  const costellRadius = glifoCircleR * 2.2;
  const costellStars = costell
    .map((p) => {
      const cx = glifoCx + (p.x - 0.5) * costellRadius;
      const cy = glifoCy + (p.y - 0.5) * costellRadius;
      return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${p.r}" fill="#D7A86E" opacity="0.85"/>`;
    })
    .join('');

  // Text positions (portrait layout default)
  const nomeFontSize = isPortrait ? 92 : 64;
  const nomeY = isPortrait ? h * 0.52 : h * 0.42;
  const sottoY = isPortrait ? nomeY + 36 : nomeY + 28;
  const mantraFontSize = isPortrait ? 36 : 28;
  const mantraY = isPortrait ? h * 0.72 : h * 0.65;
  const footerY = h - (isPortrait ? 80 : 50);
  const dedicaY = isPortrait ? nomeY + 78 : nomeY + 56;

  // Wrap mantra a max ~32 chars per riga (semplice greedy)
  const mantraLines = wrapText(mantra, isPortrait ? 32 : 40);
  const mantraTspans = mantraLines
    .map((line, i) => {
      const dy = i === 0 ? 0 : mantraFontSize * 1.2;
      return `<tspan x="${w / 2}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  // Layout orizzontale (OG card 1200×630): glifo a sx, testo a dx
  const textAnchorX = isPortrait ? w / 2 : w * 0.6;
  const textAnchorAttr = isPortrait ? 'middle' : 'start';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#18122B"/>
      <stop offset="50%" stop-color="#2A1E4A"/>
      <stop offset="100%" stop-color="#5D2C5A"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D7A86E" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#D7A86E" stop-opacity="0"/>
    </radialGradient>
    <style>
      .display{font-family:'Cormorant Garamond','Cormorant',Georgia,'Times New Roman',serif;font-weight:400;fill:#FFF6E8;}
      .display-italic{font-family:'Cormorant Garamond','Cormorant',Georgia,'Times New Roman',serif;font-weight:400;font-style:italic;fill:#FFF6E8;}
      .body{font-family:'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:500;fill:#D7A86E;letter-spacing:0.18em;}
      .body-rosa{font-family:'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:400;fill:#F1D8C9;letter-spacing:0.2em;}
      .footer{font-family:'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:600;fill:#D7A86E;letter-spacing:0.35em;}
      .glifo{font-family:'DejaVu Sans','Apple Symbols','Segoe UI Symbol',sans-serif;fill:#D7A86E;}
    </style>
  </defs>

  <!-- Background gradient -->
  <rect width="${w}" height="${h}" fill="url(#bg)"/>

  <!-- Stars -->
  ${stars
    .map(
      (s) =>
        `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r.toFixed(2)}" fill="#FFF6E8" opacity="${s.opacity.toFixed(2)}"/>`
    )
    .join('')}

  <!-- Glow dietro glifo -->
  <circle cx="${glifoCx}" cy="${glifoCy}" r="${glifoCircleR * 2.5}" fill="url(#glow)"/>

  <!-- Cerchio glifo -->
  <circle cx="${glifoCx}" cy="${glifoCy}" r="${glifoCircleR}" fill="none" stroke="#D7A86E" stroke-width="2" opacity="0.85"/>

  <!-- Costellazione -->
  ${costellStars}

  <!-- Glifo segno -->
  <text x="${glifoCx}" y="${glifoCy + glifoFontSize * 0.35}" text-anchor="middle" class="glifo" font-size="${glifoFontSize}">${escapeXml(glifo)}</text>

  <!-- Nome -->
  <text x="${textAnchorX}" y="${nomeY}" text-anchor="${textAnchorAttr}" class="display" font-size="${nomeFontSize}">${escapeXml(nome)}</text>

  <!-- Linea segno -->
  <text x="${textAnchorX}" y="${sottoY}" text-anchor="${textAnchorAttr}" class="body" font-size="18">${escapeXml(segnoLabel.toUpperCase())}</text>

  ${
    dedicato_a
      ? `<text x="${textAnchorX}" y="${dedicaY}" text-anchor="${textAnchorAttr}" class="body-rosa" font-size="14">DEDICATO A ${escapeXml(dedicato_a.toUpperCase())}</text>`
      : ''
  }

  <!-- Divider -->
  <line x1="${isPortrait ? w / 2 - 15 : textAnchorX}" y1="${mantraY - mantraFontSize - 20}" x2="${isPortrait ? w / 2 + 15 : textAnchorX + 30}" y2="${mantraY - mantraFontSize - 20}" stroke="#D7A86E" stroke-width="1.5" opacity="0.7"/>

  <!-- Mantra -->
  <text x="${isPortrait ? w / 2 : textAnchorX}" y="${mantraY}" text-anchor="${textAnchorAttr}" class="display-italic" font-size="${mantraFontSize}">${mantraTspans}</text>

  <!-- Footer -->
  <text x="${w / 2}" y="${footerY}" text-anchor="middle" class="footer" font-size="14">★ INDIZI COSMICI ★</text>
</svg>`;
}

function wrapText(s: string, maxChars: number): string[] {
  const words = s.split(/\s+/);
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      if (cur) out.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) out.push(cur);
  return out.length > 0 ? out : [s];
}

const DIM_MAP: Record<Dimension, { w: number; h: number }> = {
  '1080x1920': { w: 1080, h: 1920 },
  '1200x630': { w: 1200, h: 630 },
  '1080x1080': { w: 1080, h: 1080 }
};

export async function renderWallpaperPNG(
  opts: Omit<BuildWallpaperOpts, 'width' | 'height'>,
  dimension: Dimension
): Promise<Buffer> {
  const { w, h } = DIM_MAP[dimension];
  const svg = buildWallpaperSVG({ ...opts, width: w, height: h });
  const buf = await sharp(Buffer.from(svg, 'utf-8')).png().toBuffer();
  return buf;
}
