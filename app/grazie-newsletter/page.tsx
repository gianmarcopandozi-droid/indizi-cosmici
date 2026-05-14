import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Indizi Cosmici · Sei dentro',
  description:
    'Hai confermato la tua iscrizione agli Indizi Cosmici. Domenica mattina arriva il primo Indizio.'
};

export default function GrazieNewsletterPage() {
  return (
    <main className="min-h-screen bg-notte-profonda text-panna-stellare flex items-center justify-center px-6 py-[40px]">
      <section className="max-w-2xl mx-auto text-center">
        <p className="inline-block font-body text-xs tracking-[0.35em] uppercase text-oro-caldo border border-oro-caldo/40 rounded-full px-4 py-1.5 mb-8">
          ✦ confermato ✦
        </p>
        <h1 className="font-display italic text-6xl md:text-7xl text-panna-stellare leading-tight mb-6">
          Sei dentro
        </h1>
        <p className="font-body text-lg md:text-xl text-rosa-polvere leading-relaxed mb-10 max-w-xl mx-auto">
          Riceverai il primo Indizio della settimana domenica mattina. Niente spam, mai.
        </p>
        <Link
          href="/"
          className="inline-block font-body text-sm tracking-[0.2em] uppercase text-oro-caldo hover:text-rosa-polvere transition-colors border-b border-oro-caldo/40 hover:border-rosa-polvere pb-1"
        >
          Torna alla home
        </Link>
      </section>
    </main>
  );
}
