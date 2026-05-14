import { Suspense } from 'react';
import Link from 'next/link';
import StarsBg from '@/components/StarsBg';
import Form from '@/components/Form';
import Glifo from '@/components/Glifo';
import SpiritGuideCard from '@/components/SpiritGuideCard';
import QuoteCard from '@/components/QuoteCard';
import ReassuranceStrip from '@/components/ReassuranceStrip';
import { SEGNI, SEGNO_LABEL } from '@/lib/zodiac';

const QUOTES: string[] = [
  "A volte l'universo ci invia un piccolo segno.",
  'Non è magia. È attenzione. È ascolto.',
  'Crea il tuo Spirito Guida e portalo con te.',
  'O dedicato a chi ami. Un pensiero che resta.'
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen text-panna-stellare">
      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 md:px-16 md:py-24">
        <StarsBg seed="lp-hero" />
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
            Crea il tuo
            <br />
            <span className="italic text-oro-caldo">Spirito Guida</span>
          </h1>

          <p
            className="mt-6 text-panna-stellare/80"
            style={{ fontSize: 18, lineHeight: 1.5 }}
          >
            Un piccolo segno da portare con te o da dedicare a chi ami.
            <br />È gratis.
          </p>

          <div className="w-full">
            <Suspense fallback={null}>
              <Form />
            </Suspense>
          </div>
        </div>
      </section>

      {/* I 12 SIMBOLI COSMICI */}
      <section className="bg-viola-caldo px-6 py-16 md:px-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2
            className="text-oro-caldo"
            style={{
              fontSize: 14,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            I 12 simboli cosmici
          </h2>
          <p
            className="mx-auto mt-4 max-w-lg text-rosa-polvere/80"
            style={{ fontSize: 16, lineHeight: 1.5 }}
          >
            Ogni data di nascita ha il suo segno. Il tuo Spirito Guida nasce da lì.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6">
            {SEGNI.map((s) => (
              <div key={s} className="flex flex-col items-center gap-3">
                <Glifo segno={s} size={64} />
                <span
                  className="text-panna-stellare/80"
                  style={{
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase'
                  }}
                >
                  {SEGNO_LABEL[s]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COSA RICEVERAI */}
      <section className="bg-notte-profonda px-6 py-16 md:px-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2
            className="text-center font-display text-panna-stellare"
            style={{ fontSize: 'clamp(28px, 4.5vw, 40px)', lineHeight: 1.1 }}
          >
            Cosa <span className="italic text-oro-caldo">riceverai</span>
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Card 1: wallpaper */}
            <div className="flex flex-col items-center rounded-2xl border border-oro-caldo/20 bg-white/5 p-6 text-center">
              <SpiritGuideCard
                nome="Sofia"
                segno="scorpione"
                giorno={3}
                mese={11}
                mantra="Il silenzio sa più cose delle parole."
              />
              <h3
                className="mt-6 font-display text-panna-stellare"
                style={{ fontSize: 22 }}
              >
                Il tuo wallpaper personalizzato
              </h3>
              <p
                className="mt-3 text-rosa-polvere/80"
                style={{ fontSize: 14, lineHeight: 1.5 }}
              >
                Un&apos;immagine 1080×1920 da impostare come sfondo del telefono.
              </p>
            </div>

            {/* Card 2: dedica */}
            <div className="flex flex-col items-center rounded-2xl border border-oro-caldo/20 bg-white/5 p-6 text-center">
              <SpiritGuideCard
                nome="Sofia"
                segno="cancro"
                giorno={14}
                mese={7}
                mantra="Le cose che ami sanno la strada di casa."
                dedicato_a="alla persona che ami"
              />
              <h3
                className="mt-6 font-display text-panna-stellare"
                style={{ fontSize: 22 }}
              >
                Una versione da regalare
              </h3>
              <p
                className="mt-3 text-rosa-polvere/80"
                style={{ fontSize: 14, lineHeight: 1.5 }}
              >
                Un secondo file con la dedica al nome di chi ami.
              </p>
            </div>

            {/* Card 3: newsletter */}
            <div className="flex flex-col items-center rounded-2xl border border-oro-caldo/20 bg-white/5 p-6 text-center">
              <div
                className="flex w-full max-w-[280px] flex-col rounded-2xl border border-oro-caldo/30 bg-notte-profonda/60 p-5 text-left"
                style={{ aspectRatio: '9 / 16' }}
              >
                <div
                  className="text-oro-caldo"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase'
                  }}
                >
                  ✦ Indizi Settimanali
                </div>
                <div
                  className="mt-3 text-panna-stellare/90"
                  style={{ fontSize: 12 }}
                >
                  Da: ciao@indizicosmici.it
                </div>
                <div
                  className="mt-4 font-display italic text-panna-stellare"
                  style={{ fontSize: 22, lineHeight: 1.25 }}
                >
                  &laquo;Un piccolo segno per la tua settimana.&raquo;
                </div>
                <div className="mt-6 h-px bg-oro-caldo/40" />
                <p
                  className="mt-4 text-rosa-polvere/80"
                  style={{ fontSize: 12, lineHeight: 1.5 }}
                >
                  Un&apos;ispirazione breve. Niente spam. Cancellabile in un click.
                </p>
                <div className="mt-auto" />
                <div
                  className="mt-4 inline-flex w-fit rounded-md px-3 py-2 text-notte-profonda"
                  style={{
                    background: '#D7A86E',
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontWeight: 600
                  }}
                >
                  Leggi
                </div>
              </div>
              <h3
                className="mt-6 font-display text-panna-stellare"
                style={{ fontSize: 22 }}
              >
                Indizi settimanali
              </h3>
              <p
                className="mt-3 text-rosa-polvere/80"
                style={{ fontSize: 14, lineHeight: 1.5 }}
              >
                Un piccolo segno via email ogni settimana. Cancellabile in un
                click. (Solo se lo scegli.)
              </p>
            </div>
          </div>
        </div>
      </section>

      <ReassuranceStrip />

      {/* QUOTE GRID */}
      <section
        className="px-6 py-16 md:px-16 md:py-24"
        style={{ background: '#1d1535' }}
      >
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {QUOTES.map((q, i) => (
            <QuoteCard
              key={q}
              quote={q}
              bgIndex={((i % 4) + 1) as 1 | 2 | 3 | 4}
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
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
