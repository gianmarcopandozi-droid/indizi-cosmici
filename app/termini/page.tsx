import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Indizi Cosmici · Termini d’uso',
  description:
    'Termini d’uso di Indizi Cosmici: cos’e il servizio, cosa non e, limiti di responsabilita.'
};

export default function TerminiPage() {
  return (
    <main className="min-h-screen bg-viola-caldo text-panna-stellare">
      <article className="max-w-3xl mx-auto px-6 py-[40px] md:px-10">
        <header className="mb-10">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-oro-caldo mb-4">
            ✦ Indizi Cosmici ✦
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-panna-stellare leading-tight mb-4">
            Termini d&apos;uso
          </h1>
          <p className="font-body text-base text-rosa-polvere">
            Ultimo aggiornamento: 14 maggio 2026
          </p>
          <p className="font-body text-sm text-rosa-polvere/80 mt-1">
            Versione: v1-2026-05-14
          </p>
        </header>

        <section className="space-y-10 font-body text-base leading-relaxed text-panna-stellare">
          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              1. Cos&apos;e Indizi Cosmici
            </h2>
            <p>
              Un progetto creativo personale che ti permette di creare gratuitamente
              un&apos;immagine simbolica personalizzata (&quot;Spirito Guida&quot;)
              basata sul tuo segno zodiacale, da custodire o dedicare a chi ami.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              2. Uso del servizio
            </h2>
            <p>
              Il servizio e gratuito e disponibile senza registrazione strutturata.
              Compilando il form e creando il tuo Spirito Guida confermi di avere almeno
              16 anni (o di aver ottenuto consenso parentale) e di aver letto la{' '}
              <Link
                href="/privacy"
                className="text-oro-caldo underline hover:text-rosa-polvere transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              3. Cosa NON e Indizi Cosmici
            </h2>
            <p className="mb-3">Molto importante:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Non e</strong> un servizio di predizione del futuro
              </li>
              <li>
                <strong>Non e</strong> una consulenza psicologica, medica o spirituale
                professionale
              </li>
              <li>
                <strong>Non e</strong> una garanzia di destino, protezione, guarigione o
                successo
              </li>
              <li>
                <strong>Non e</strong> una sostituzione di un percorso terapeutico o di
                consulenza qualificata
              </li>
            </ul>
            <p className="mt-3">
              Il contenuto ha valore <strong>simbolico ed emotivo</strong>. Nient&apos;altro.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              4. Proprieta intellettuale
            </h2>
            <p>
              I testi, le grafiche, i mantra e gli elementi visivi sono protetti da
              copyright. L&apos;immagine generata personalizzata e destinata al tuo uso
              personale: puoi condividerla con amici e familiari, ma non rivenderla o
              usarla a scopo commerciale.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              5. Disponibilita del servizio
            </h2>
            <p>
              Facciamo del nostro meglio per mantenere il servizio attivo ma non
              garantiamo disponibilita continua. Possiamo apportare modifiche, sospendere
              o terminare il servizio in qualsiasi momento.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              6. Limitazione di responsabilita
            </h2>
            <p>
              Non siamo responsabili di interpretazioni personali, decisioni o azioni
              intraprese sulla base del contenuto di Indizi Cosmici. Il contenuto e
              simbolico, non prescrittivo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              7. Legge applicabile
            </h2>
            <p>
              Questi termini sono regolati dalla legge italiana. Per controversie, foro
              competente e quello del consumatore.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">8. Contatti</h2>
            <p>
              <a
                href="mailto:ciao@indizicosmici.it"
                className="text-oro-caldo underline hover:text-rosa-polvere transition-colors"
              >
                ciao@indizicosmici.it
              </a>
            </p>
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-oro-caldo/20">
          <Link
            href="/"
            className="font-body text-sm tracking-[0.2em] uppercase text-oro-caldo hover:text-rosa-polvere transition-colors"
          >
            ← Torna alla home
          </Link>
        </footer>
      </article>
    </main>
  );
}
