import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Indizi Cosmici · Privacy Policy',
  description:
    'Informativa privacy GDPR di Indizi Cosmici: quali dati raccogliamo, perche, come puoi cancellarli.'
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-viola-caldo text-panna-stellare">
      <article className="max-w-3xl mx-auto px-6 py-[40px] md:px-10">
        <header className="mb-10">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-oro-caldo mb-4">
            ✦ Indizi Cosmici ✦
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-panna-stellare leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="font-body text-base text-rosa-polvere">
            Ultimo aggiornamento: 17 luglio 2026
          </p>
          <p className="font-body text-sm text-rosa-polvere/80 mt-1">
            Versione: v1-2026-05-14
          </p>
        </header>

        <section className="space-y-10 font-body text-base leading-relaxed text-panna-stellare">
          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              1. Titolare del trattamento
            </h2>
            <p>
              Gianmarco Pandozi (privato, progetto creativo personale). Contatto:{' '}
              <a
                href="mailto:ciao@indizicosmici.it"
                className="text-oro-caldo underline hover:text-rosa-polvere transition-colors"
              >
                ciao@indizicosmici.it
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              2. Quali dati raccogliamo
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome</li>
              <li>Email</li>
              <li>Giorno e mese di nascita (senza anno)</li>
              <li>Hash dell&apos;indirizzo IP (sha256, mai conservato in chiaro)</li>
              <li>User agent del browser</li>
              <li>Eventuale nome di una persona dedicataria</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              3. Perche li raccogliamo (finalita)
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Per generarti e inviarti via email il tuo Spirito Guida personalizzato
              </li>
              <li>
                Per inviarti, solo se hai espresso consenso esplicito, una newsletter
                settimanale con ispirazioni e simboli
              </li>
              <li>
                Per misurare in forma aggregata l&apos;efficacia del progetto (numero
                iscritti per segno zodiacale, condivisioni)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              4. Base giuridica (art. 6 GDPR)
            </h2>
            <p>
              Consenso esplicito (art. 6, comma 1, lett. a). Hai espresso il consenso
              spuntando le caselle apposite al momento della creazione dello Spirito
              Guida.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              5. Conservazione dei dati
            </h2>
            <p>
              Conserveremo i tuoi dati per 24 mesi dall&apos;ultimo opt-in o
              dall&apos;ultima interazione confermata (per i soli iscritti alla
              newsletter). Trascorso questo periodo, i dati verranno cancellati o
              anonimizzati. Puoi richiedere la cancellazione in qualsiasi momento.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              6. Trasferimenti extra-UE
            </h2>
            <p className="mb-3">Utilizziamo questi servizi di terze parti:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Supabase (database) — server in Unione Europea</li>
              <li>
                Brevo (email transazionale) — server in Unione Europea, conforme
                GDPR
              </li>
              <li>Vercel (hosting) — CDN globale, conforme SCC</li>
              <li>
                Plausible (analytics, eventuale) — server in Unione Europea, analytics
                senza cookie e senza profilazione pubblicitaria
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              7. I tuoi diritti (artt. 15-22 GDPR)
            </h2>
            <p className="mb-3">Hai diritto a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Accedere ai tuoi dati (art. 15)</li>
              <li>Chiederne la rettifica (art. 16)</li>
              <li>
                Chiederne la cancellazione (art. 17 — &quot;diritto all&apos;oblio&quot;)
              </li>
              <li>Limitarne il trattamento (art. 18)</li>
              <li>Riceverli in formato portabile (art. 20)</li>
              <li>Opporti al trattamento (art. 21)</li>
              <li>Revocare il consenso in qualsiasi momento</li>
            </ul>
            <p className="mt-3">
              Per esercitare questi diritti scrivici a{' '}
              <a
                href="mailto:ciao@indizicosmici.it"
                className="text-oro-caldo underline hover:text-rosa-polvere transition-colors font-semibold"
              >
                ciao@indizicosmici.it
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">8. Cookie</h2>
            <p>
              Utilizziamo esclusivamente cookie tecnici essenziali per il funzionamento
              del sito. Non usiamo cookie di profilazione pubblicitaria ne di tracciamento
              cross-site. Se attivo, Plausible Analytics raccoglie dati statistici
              aggregati e anonimi senza utilizzare cookie.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              9. Cancellazione e disiscrizione
            </h2>
            <p>
              In ogni email e presente un link di disiscrizione che cancella la tua
              iscrizione alla newsletter con un click. Per cancellare anche i dati di
              base (nome, email, segno), scrivici.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              10. Reclamo all&apos;autorita di controllo
            </h2>
            <p>
              Puoi presentare reclamo al{' '}
              <strong>Garante per la Protezione dei Dati Personali</strong>:{' '}
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-oro-caldo underline hover:text-rosa-polvere transition-colors"
              >
                www.garanteprivacy.it
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              11. Modifiche a questa policy
            </h2>
            <p>
              Eventuali modifiche saranno indicate aggiornando la data in cima a questa
              pagina. Le modifiche sostanziali saranno comunicate via email a chi e
              iscritto alla newsletter.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-oro-caldo mb-3">
              12. Disclaimer simbolico
            </h2>
            <p>
              Il contenuto di Indizi Cosmici e a scopo simbolico, emotivo e di
              intrattenimento. Non sostituisce consulenza professionale di alcun tipo
              (psicologica, medica, finanziaria, spirituale).
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
