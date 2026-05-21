import { ImageResponse } from '@vercel/og';
import { getAnonClient, } from '@/lib/supabase-server';
import { SEGNO_GLIFI, SEGNO_LABEL, COSTELLAZIONI, type Segno, SEGNI } from '@/lib/zodiac';
import { renderWallpaperPNG } from '@/lib/wallpaper-svg';
import { getAnimaleDataUri } from '@/lib/assets';
import { ANIMALE_LABEL } from '@/lib/animali';

// Service role NON serve qui: read-only spirit_guides ha policy anon.
// Node runtime per disporre di sharp come fallback.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const W = 1080;
const H = 1920;

interface SgRow {
  nome_visualizzato: string;
  segno: string;
  mantra: string;
  dedicato_a: string | null;
}

async function fetchSpiritGuide(shareId: string): Promise<SgRow | null> {
  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from('spirit_guides')
      .select('nome_visualizzato, segno, mantra, dedicato_a')
      .eq('share_id', shareId)
      .maybeSingle();
    if (error || !data) return null;
    return data as SgRow;
  } catch (err) {
    console.error('[wallpaper] fetchSpiritGuide error:', err);
    return null;
  }
}

function isValidSegno(s: string): s is Segno {
  return (SEGNI as string[]).includes(s);
}

/** PRNG deterministico per posizionare le stelle a partire dallo shareId */
function rngFromSeed(seed: string): () => number {
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

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await ctx.params;
  if (!shareId || shareId.length < 4) {
    return new Response('Not found', { status: 404 });
  }

  const sg = await fetchSpiritGuide(shareId);
  if (!sg || !isValidSegno(sg.segno)) {
    return new Response('Spirit guide not found', { status: 404 });
  }

  const opts = {
    nome: sg.nome_visualizzato,
    segno: sg.segno as Segno,
    mantra: sg.mantra,
    dedicato_a: sg.dedicato_a ?? undefined
  };

  const animaleUri = getAnimaleDataUri(opts.segno);

  // Tentativo Satori — layout animale se asset disponibile, altrimenti glifo
  try {
    const img = animaleUri
      ? await renderAnimale(opts, animaleUri)
      : await renderGlifo(opts);
    return img;
  } catch (err) {
    console.warn('[wallpaper] Satori fallito, fallback sharp:', err);
  }

  // Fallback sharp SVG → PNG
  try {
    const buf = await renderWallpaperPNG(opts, '1080x1920');
    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=3600, s-maxage=86400'
      }
    });
  } catch (err) {
    console.error('[wallpaper] anche sharp fallito:', err);
    return new Response('Render error', { status: 500 });
  }
}

async function renderAnimale(
  opts: { nome: string; segno: Segno; mantra: string; dedicato_a?: string },
  dataUri: string
): Promise<Response> {
  const { nome, segno, mantra, dedicato_a } = opts;
  const segnoLabel = SEGNO_LABEL[segno].toUpperCase();
  const animaleLabel = ANIMALE_LABEL[segno];

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          position: 'relative',
          background: '#18122B',
          fontFamily: 'serif'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={dataUri}
          alt=""
          width={W}
          height={H}
          style={{ position: 'absolute', top: 0, left: 0, width: W, height: H, objectFit: 'cover' }}
        />

        {/* Gradiente alto: attenua le corna nella zona ora/notch del lock screen */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: W,
            height: 480,
            display: 'flex',
            background: 'linear-gradient(180deg, rgba(24,18,43,0.82) 0%, rgba(24,18,43,0) 100%)'
          }}
        />

        {/* Gradiente basso: leggibilità del testo */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: W,
            height: 1000,
            display: 'flex',
            background:
              'linear-gradient(0deg, rgba(24,18,43,0.97) 0%, rgba(24,18,43,0.88) 32%, rgba(24,18,43,0) 100%)'
          }}
        />

        {/* Tag */}
        <div style={{ position: 'absolute', top: 1180, width: W, display: 'flex', justifyContent: 'center', color: '#D7A86E', fontSize: 18, letterSpacing: 8, fontFamily: 'sans-serif' }}>
          · IL TUO SPIRITO GUIDA ·
        </div>

        {/* Nome */}
        <div style={{ position: 'absolute', top: 1218, width: W, display: 'flex', justifyContent: 'center', color: '#FFF6E8', fontSize: 96, fontFamily: 'serif' }}>
          {nome}
        </div>

        {/* Segno */}
        <div style={{ position: 'absolute', top: 1352, width: W, display: 'flex', justifyContent: 'center', color: '#D7A86E', fontSize: 22, letterSpacing: 7, fontFamily: 'sans-serif' }}>
          {segnoLabel}
        </div>

        {/* Animale label */}
        <div style={{ position: 'absolute', top: 1392, width: W, display: 'flex', justifyContent: 'center', color: '#F1D8C9', fontSize: 26, fontStyle: 'italic', fontFamily: 'serif' }}>
          {animaleLabel}
        </div>

        {dedicato_a ? (
          <div style={{ position: 'absolute', top: 1438, width: W, display: 'flex', justifyContent: 'center', color: '#F1D8C9', fontSize: 16, letterSpacing: 4, fontFamily: 'sans-serif' }}>
            DEDICATO A {dedicato_a.toUpperCase()}
          </div>
        ) : null}

        {/* Divider */}
        <div style={{ position: 'absolute', top: dedicato_a ? 1486 : 1456, left: W / 2 - 20, width: 40, height: 2, background: '#D7A86E', opacity: 0.6, display: 'flex' }} />

        {/* Mantra */}
        <div style={{ position: 'absolute', top: dedicato_a ? 1516 : 1490, left: 110, width: W - 220, display: 'flex', justifyContent: 'center', textAlign: 'center', color: '#FFF6E8', fontSize: 38, fontStyle: 'italic', fontFamily: 'serif', lineHeight: 1.4 }}>
          « {mantra} »
        </div>

        {/* Footer (sopra il margine inferiore safe) */}
        <div style={{ position: 'absolute', bottom: 120, width: W, display: 'flex', justifyContent: 'center', color: '#D7A86E', fontSize: 16, letterSpacing: 10, fontFamily: 'sans-serif' }}>
          · INDIZI COSMICI ·
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' }
    }
  );
}

async function renderGlifo(opts: {
  nome: string;
  segno: Segno;
  mantra: string;
  dedicato_a?: string;
}): Promise<Response> {
  const { nome, segno, mantra, dedicato_a } = opts;
  const glifo = SEGNO_GLIFI[segno];
  const segnoLabel = SEGNO_LABEL[segno].toUpperCase();

  const seed = `${nome}::${segno}`;
  const rng = rngFromSeed(seed);
  const stars = Array.from({ length: 40 }, () => ({
    left: Math.floor(rng() * W),
    top: Math.floor(rng() * H * 0.65),
    size: 1 + rng() * 3,
    opacity: 0.4 + rng() * 0.55
  }));

  // Costellazione attorno al glifo
  const glifoCx = W / 2;
  const glifoCy = H * 0.28;
  const glifoR = 130;
  const costell = COSTELLAZIONI[segno].map((p) => ({
    left: glifoCx + (p.x - 0.5) * glifoR * 2.4 - p.r,
    top: glifoCy + (p.y - 0.5) * glifoR * 2.4 - p.r,
    size: p.r * 2
  }));

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background:
            'linear-gradient(180deg, #18122B 0%, #2A1E4A 50%, #5D2C5A 100%)',
          position: 'relative',
          fontFamily: 'serif'
        }}
      >
        {/* Stelle */}
        {stars.map((s, i) => (
          <div
            key={`star-${i}`}
            style={{
              position: 'absolute',
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: '#FFF6E8',
              opacity: s.opacity
            }}
          />
        ))}

        {/* Cerchio glifo */}
        <div
          style={{
            position: 'absolute',
            left: glifoCx - glifoR,
            top: glifoCy - glifoR,
            width: glifoR * 2,
            height: glifoR * 2,
            borderRadius: '50%',
            border: '2px solid #D7A86E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              fontSize: 140,
              color: '#D7A86E',
              lineHeight: 1,
              display: 'flex'
            }}
          >
            {glifo}
          </div>
        </div>

        {/* Costellazione */}
        {costell.map((c, i) => (
          <div
            key={`cs-${i}`}
            style={{
              position: 'absolute',
              left: c.left,
              top: c.top,
              width: c.size,
              height: c.size,
              borderRadius: '50%',
              background: '#D7A86E',
              opacity: 0.9
            }}
          />
        ))}

        {/* Nome */}
        <div
          style={{
            position: 'absolute',
            top: H * 0.48,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            color: '#FFF6E8',
            fontSize: 92,
            fontFamily: 'serif'
          }}
        >
          {nome}
        </div>

        {/* Linea segno */}
        <div
          style={{
            position: 'absolute',
            top: H * 0.48 + 110,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            color: '#D7A86E',
            fontSize: 20,
            letterSpacing: 6,
            fontFamily: 'sans-serif'
          }}
        >
          {segnoLabel}
        </div>

        {dedicato_a ? (
          <div
            style={{
              position: 'absolute',
              top: H * 0.48 + 150,
              width: W,
              display: 'flex',
              justifyContent: 'center',
              color: '#F1D8C9',
              fontSize: 16,
              letterSpacing: 5,
              fontFamily: 'sans-serif'
            }}
          >
            DEDICATO A {dedicato_a.toUpperCase()}
          </div>
        ) : null}

        {/* Divider */}
        <div
          style={{
            position: 'absolute',
            top: H * 0.66,
            left: W / 2 - 20,
            width: 40,
            height: 2,
            background: '#D7A86E',
            opacity: 0.6
          }}
        />

        {/* Mantra */}
        <div
          style={{
            position: 'absolute',
            top: H * 0.69,
            width: W - 200,
            left: 100,
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#FFF6E8',
            fontSize: 38,
            fontStyle: 'italic',
            fontFamily: 'serif',
            lineHeight: 1.4
          }}
        >
          « {mantra} »
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            color: '#D7A86E',
            fontSize: 16,
            letterSpacing: 10,
            fontFamily: 'sans-serif'
          }}
        >
          ★ INDIZI COSMICI ★
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: {
        'cache-control': 'public, max-age=3600, s-maxage=86400'
      }
    }
  );
}
