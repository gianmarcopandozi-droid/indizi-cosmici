import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StarsBg from '@/components/StarsBg';
import SpiritGuideCard from '@/components/SpiritGuideCard';
import { getServiceRoleClient } from '@/lib/supabase-server';
import { SEGNI, type Segno } from '@/lib/zodiac';

type SpiritGuideRow = {
  id: string;
  share_id: string;
  subscriber_id: string | null;
  nome_visualizzato: string;
  segno: string;
  mantra: string;
  dedicato_a: string | null;
};

type SubscriberRow = {
  giorno_nascita: number;
  mese_nascita: number;
};

function asSegno(s: string): Segno {
  return (SEGNI.includes(s as Segno) ? s : 'ariete') as Segno;
}

async function loadGuide(shareId: string) {
  const supabase = getServiceRoleClient();
  const { data: guide } = await supabase
    .from('spirit_guides')
    .select('id, share_id, subscriber_id, nome_visualizzato, segno, mantra, dedicato_a')
    .eq('share_id', shareId)
    .maybeSingle<SpiritGuideRow>();
  if (!guide) return null;

  let giorno = 1;
  let mese = 1;
  if (guide.subscriber_id) {
    const { data: sub } = await supabase
      .from('subscribers')
      .select('giorno_nascita, mese_nascita')
      .eq('id', guide.subscriber_id)
      .maybeSingle<SubscriberRow>();
    if (sub) {
      giorno = sub.giorno_nascita;
      mese = sub.mese_nascita;
    }
  }
  return { guide, giorno, mese };
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
  const { shareId } = await params;
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://indizicosmici.it';
  const result = await loadGuide(shareId);
  if (!result) {
    return { title: 'Indizi Cosmici' };
  }
  const { guide } = result;
  const title = `Lo Spirito Guida di ${guide.nome_visualizzato}`;
  const description = guide.mantra;
  const ogUrl = `${site.replace(/\/$/, '')}/og/${shareId}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${site.replace(/\/$/, '')}/sg/${shareId}`,
      siteName: 'Indizi Cosmici',
      locale: 'it_IT',
      type: 'website',
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl]
    }
  };
}

export default async function SharePage({
  params
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const result = await loadGuide(shareId);
  if (!result) notFound();
  const { guide, giorno, mese } = result;

  return (
    <main className="relative min-h-screen text-panna-stellare">
      <section className="relative flex min-h-screen flex-col items-center px-6 py-16 md:px-16 md:py-24">
        <StarsBg seed={`sg-${shareId}`} />
        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
          <div
            className="text-oro-caldo"
            style={{
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            ✦ Indizi Cosmici ✦
          </div>

          <p
            className="mt-6 text-panna-stellare/80"
            style={{
              fontSize: 14,
              letterSpacing: '0.16em',
              textTransform: 'uppercase'
            }}
          >
            {guide.nome_visualizzato} ha creato il suo Spirito Guida
          </p>

          <div className="mt-10 w-full max-w-sm">
            <SpiritGuideCard
              nome={guide.nome_visualizzato}
              segno={asSegno(guide.segno)}
              giorno={giorno}
              mese={mese}
              mantra={guide.mantra}
              dedicato_a={guide.dedicato_a ?? undefined}
            />
          </div>

          <div
            className="my-10 h-px w-24"
            style={{ background: '#D7A86E', opacity: 0.5 }}
          />

          <h2
            className="font-display text-panna-stellare"
            style={{ fontSize: 'clamp(36px, 6vw, 52px)', lineHeight: 1.05 }}
          >
            Crea il <span className="italic text-oro-caldo">tuo</span>
          </h2>
          <p
            className="mt-4 max-w-md text-panna-stellare/80"
            style={{ fontSize: 17, lineHeight: 1.5 }}
          >
            Un piccolo segno da portare con te. O da dedicare a chi ami.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-lg px-8 py-4 font-semibold text-notte-profonda"
            style={{
              background:
                'linear-gradient(180deg, #E9C188 0%, #D7A86E 100%)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontSize: 13,
              boxShadow: '0 8px 24px rgba(215, 168, 110, 0.25)'
            }}
          >
            Crea il mio Spirito Guida ✦
          </Link>

          <p
            className="mt-12 max-w-xl text-rosa-polvere/40"
            style={{ fontSize: 11, lineHeight: 1.5 }}
          >
            Contenuto a scopo simbolico ed emotivo. Non sostituisce consulenza
            professionale di alcun tipo.
          </p>
        </div>
      </section>
    </main>
  );
}
