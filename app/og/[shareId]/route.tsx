import { ImageResponse } from '@vercel/og';
import { getAnonClient } from '@/lib/supabase-server';
import { SEGNO_GLIFI, SEGNO_LABEL, COSTELLAZIONI, type Segno, SEGNI } from '@/lib/zodiac';
import { renderWallpaperPNG } from '@/lib/wallpaper-svg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const W = 1200;
const H = 630;

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
    console.error('[og] fetchSpiritGuide error:', err);
    return null;
  }
}

function isValidSegno(s: string): s is Segno {
  return (SEGNI as string[]).includes(s);
}

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

  // Tentativo Satori
  try {
    return await renderSatoriOg(opts);
  } catch (err) {
    console.warn('[og] Satori fallito, fallback sharp:', err);
  }

  try {
    const buf = await renderWallpaperPNG(opts, '1200x630');
    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=3600, s-maxage=86400'
      }
    });
  } catch (err) {
    console.error('[og] anche sharp fallito:', err);
    return new Response('Render error', { status: 500 });
  }
}

async function renderSatoriOg(opts: {
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
  const stars = Array.from({ length: 24 }, () => ({
    left: Math.floor(rng() * W),
    top: Math.floor(rng() * H * 0.7),
    size: 1 + rng() * 2.5,
    opacity: 0.4 + rng() * 0.55
  }));

  // Glifo a sinistra, testo a destra
  const glifoCx = W * 0.22;
  const glifoCy = H * 0.5;
  const glifoR = 110;
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
          background:
            'linear-gradient(135deg, #18122B 0%, #2A1E4A 55%, #5D2C5A 100%)',
          position: 'relative',
          fontFamily: 'serif'
        }}
      >
        {stars.map((s, i) => (
          <div
            key={`s-${i}`}
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

        {/* Cerchio glifo sx */}
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
          <div style={{ fontSize: 120, color: '#D7A86E', lineHeight: 1, display: 'flex' }}>
            {glifo}
          </div>
        </div>

        {/* Costellazione */}
        {costell.map((c, i) => (
          <div
            key={`oc-${i}`}
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

        {/* Block testo dx */}
        <div
          style={{
            position: 'absolute',
            left: W * 0.42,
            top: 90,
            width: W * 0.5,
            display: 'flex',
            flexDirection: 'column',
            color: '#FFF6E8'
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: '#D7A86E',
              letterSpacing: 6,
              fontFamily: 'sans-serif',
              marginBottom: 12
            }}
          >
            ✦ INDIZI COSMICI ✦
          </div>
          <div
            style={{
              fontSize: 64,
              fontFamily: 'serif',
              color: '#FFF6E8',
              lineHeight: 1.05,
              marginBottom: 8
            }}
          >
            {nome}
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#D7A86E',
              letterSpacing: 5,
              fontFamily: 'sans-serif',
              marginBottom: 8
            }}
          >
            {segnoLabel}
          </div>
          {dedicato_a ? (
            <div
              style={{
                fontSize: 13,
                color: '#F1D8C9',
                letterSpacing: 4,
                fontFamily: 'sans-serif',
                marginBottom: 16
              }}
            >
              DEDICATO A {dedicato_a.toUpperCase()}
            </div>
          ) : null}
          <div style={{ width: 30, height: 2, background: '#D7A86E', opacity: 0.6, marginTop: 16, marginBottom: 18 }} />
          <div
            style={{
              fontSize: 28,
              fontStyle: 'italic',
              fontFamily: 'serif',
              color: '#FFF6E8',
              lineHeight: 1.35
            }}
          >
            « {mantra} »
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            color: '#D7A86E',
            fontSize: 12,
            letterSpacing: 8,
            fontFamily: 'sans-serif'
          }}
        >
          indizicosmici.it
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
