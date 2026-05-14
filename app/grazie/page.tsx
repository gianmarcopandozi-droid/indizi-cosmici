import { redirect } from 'next/navigation';
import Link from 'next/link';
import StarsBg from '@/components/StarsBg';
import SpiritGuideCard from '@/components/SpiritGuideCard';
import ShareButtons from '@/components/ShareButtons';
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

export default async function GraziePage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sp = await searchParams;
  const id = sp.id;
  if (!id) redirect('/');

  const supabase = getServiceRoleClient();
  const { data: guide } = await supabase
    .from('spirit_guides')
    .select('id, share_id, subscriber_id, nome_visualizzato, segno, mantra, dedicato_a')
    .eq('share_id', id)
    .maybeSingle<SpiritGuideRow>();

  if (!guide) redirect('/');

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indizicosmici.it';

  return (
    <main className="relative min-h-screen text-panna-stellare">
      <section className="relative flex min-h-screen flex-col items-center px-6 py-16 md:px-16 md:py-24">
        <StarsBg seed={`grazie-${guide.share_id}`} />
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
            ✦ è arrivato ✦
          </div>

          <h1
            className="mt-6 font-display text-panna-stellare"
            style={{ fontSize: 'clamp(32px, 5vw, 40px)', lineHeight: 1.1 }}
          >
            Grazie, {guide.nome_visualizzato}!
          </h1>

          <p
            className="mt-4 max-w-md text-panna-stellare/80"
            style={{ fontSize: 17, lineHeight: 1.5 }}
          >
            Il tuo Spirito Guida è pronto. L&apos;abbiamo inviato alla tua email.
          </p>

          <div className="mt-10 w-full max-w-xs">
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
            style={{ fontSize: 'clamp(26px, 4vw, 32px)' }}
          >
            Dedicalo a chi <span className="italic text-oro-caldo">ami</span>
          </h2>
          <p
            className="mt-3 max-w-md text-rosa-polvere/80"
            style={{ fontSize: 16, lineHeight: 1.5 }}
          >
            Un gesto piccolo che resta.
          </p>

          <ShareButtons shareId={guide.share_id} siteUrl={siteUrl} />

          <div className="mt-12 flex flex-col items-center gap-4">
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-panna-stellare/70">
              <Link href="/privacy" className="hover:text-oro-caldo">
                Privacy
              </Link>
              <span className="text-panna-stellare/30">·</span>
              <Link href="/termini" className="hover:text-oro-caldo">
                Termini
              </Link>
              <span className="text-panna-stellare/30">·</span>
              <a
                href="mailto:ciao@indizicosmici.it"
                className="hover:text-oro-caldo"
              >
                Contatti
              </a>
            </nav>
            <p
              className="max-w-xl text-rosa-polvere/40"
              style={{ fontSize: 11, lineHeight: 1.5 }}
            >
              Contenuto a scopo simbolico ed emotivo. Non sostituisce consulenza
              professionale di alcun tipo.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
