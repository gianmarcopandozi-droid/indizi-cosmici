import type { Metadata } from 'next';
import Link from 'next/link';
import UnsubscribeButton from './UnsubscribeButton';

export const metadata: Metadata = {
  title: 'Indizi Cosmici · Disiscriviti',
  description: 'Disiscriviti dalla newsletter di Indizi Cosmici in un click.'
};

type SearchParams = Promise<{ token?: string; ok?: string }>;

export default async function UnsubscribePage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const { token, ok } = await searchParams;

  if (ok === '1') {
    return (
      <main className="min-h-screen bg-notte-profonda text-panna-stellare flex items-center justify-center px-6 py-[40px]">
        <section className="max-w-2xl mx-auto text-center">
          <p className="inline-block font-body text-xs tracking-[0.35em] uppercase text-rosa-polvere border border-rosa-polvere/30 rounded-full px-4 py-1.5 mb-8">
            ✦ disiscritto ✦
          </p>
          <h1 className="font-display italic text-5xl md:text-6xl text-panna-stellare leading-tight mb-6">
            Disiscritto
          </h1>
          <p className="font-body text-lg text-rosa-polvere leading-relaxed mb-10 max-w-xl mx-auto">
            Mi dispiace vederti andare. Se cambi idea, puoi sempre{' '}
            <Link
              href="/"
              className="text-oro-caldo underline hover:text-panna-stellare transition-colors"
            >
              creare un nuovo Spirito Guida
            </Link>
            .
          </p>
        </section>
      </main>
    );
  }

  if (token) {
    return (
      <main className="min-h-screen bg-notte-profonda text-panna-stellare flex items-center justify-center px-6 py-[40px]">
        <section className="max-w-2xl mx-auto text-center">
          <p className="font-body text-xs tracking-[0.35em] uppercase text-oro-caldo mb-8">
            ✦ Indizi Cosmici ✦
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-panna-stellare leading-tight mb-6">
            Vuoi davvero non ricevere piu gli Indizi della settimana?
          </h1>
          <p className="font-body text-base text-rosa-polvere/90 leading-relaxed mb-10 max-w-lg mx-auto">
            Bastera un click. Potrai sempre tornare creando un nuovo Spirito Guida.
          </p>
          <UnsubscribeButton token={token} />
          <div className="mt-10">
            <Link
              href="/"
              className="font-body text-sm tracking-[0.2em] uppercase text-rosa-polvere/70 hover:text-panna-stellare transition-colors"
            >
              ← Annulla, torna alla home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-notte-profonda text-panna-stellare flex items-center justify-center px-6 py-[40px]">
      <section className="max-w-2xl mx-auto text-center">
        <p className="font-body text-xs tracking-[0.35em] uppercase text-oro-caldo mb-8">
          ✦ Indizi Cosmici ✦
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-panna-stellare leading-tight mb-6">
          Disiscriviti
        </h1>
        <p className="font-body text-lg text-rosa-polvere leading-relaxed mb-10 max-w-xl mx-auto">
          Per disiscriverti, usa il link in fondo a una delle email che ricevi.
        </p>
        <Link
          href="/"
          className="font-body text-sm tracking-[0.2em] uppercase text-oro-caldo hover:text-panna-stellare transition-colors border-b border-oro-caldo/40 hover:border-panna-stellare pb-1"
        >
          Torna alla home
        </Link>
      </section>
    </main>
  );
}
