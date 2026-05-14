import { Suspense } from 'react';
import Link from 'next/link';
import StarsBg from '@/components/StarsBg';
import Form from '@/components/Form';
import ReassuranceStrip from '@/components/ReassuranceStrip';
import { getServiceRoleClient } from '@/lib/supabase-server';

type SpiritGuideRow = {
  nome_visualizzato: string;
};

async function loadRefName(ref: string | undefined): Promise<string | null> {
  if (!ref) return null;
  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from('spirit_guides')
      .select('nome_visualizzato')
      .eq('share_id', ref)
      .maybeSingle<SpiritGuideRow>();
    return data?.nome_visualizzato ?? null;
  } catch {
    return null;
  }
}

export default async function DedicaPage({
  searchParams
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const sp = await searchParams;
  const refName = await loadRefName(sp.ref);

  return (
    <main className="relative min-h-screen text-panna-stellare">
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 md:px-16 md:py-24">
        <StarsBg seed="dedica" />
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

          <h1
            className="mt-6 font-display text-panna-stellare"
            style={{ fontSize: 'clamp(40px, 7vw, 56px)', lineHeight: 1.05 }}
          >
            Dedica un
            <br />
            <span className="italic text-oro-caldo">Spirito Guida</span>
          </h1>

          <p
            className="mt-6 max-w-lg text-panna-stellare/80"
            style={{ fontSize: 18, lineHeight: 1.5 }}
          >
            A chi vuoi mandare un piccolo segno?
          </p>

          {refName ? (
            <p
              className="mt-3 text-rosa-polvere/80"
              style={{
                fontSize: 13,
                letterSpacing: '0.14em',
                textTransform: 'uppercase'
              }}
            >
              Dedica per gli amici di {refName}
            </p>
          ) : null}

          <div className="w-full">
            <Suspense fallback={null}>
              <Form mode="dedica" />
            </Suspense>
          </div>
        </div>
      </section>

      <ReassuranceStrip />

      <footer className="bg-notte-profonda px-6 py-12 text-center md:px-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-panna-stellare/80">
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
            className="text-rosa-polvere/60"
            style={{ fontSize: 13, letterSpacing: '0.04em' }}
          >
            © 2026 Indizi Cosmici · indizicosmici.it
          </p>
          <p
            className="max-w-xl text-rosa-polvere/40"
            style={{ fontSize: 11, lineHeight: 1.5 }}
          >
            Contenuto a scopo simbolico ed emotivo. Non sostituisce consulenza
            professionale di alcun tipo.
          </p>
        </div>
      </footer>
    </main>
  );
}
