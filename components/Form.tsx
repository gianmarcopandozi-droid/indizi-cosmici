'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MESI_LABEL } from '@/lib/zodiac';

type Mode = 'self' | 'dedica';

type Props = {
  defaultDedicatoA?: string;
  mode?: Mode;
};

type FieldErrors = {
  nome?: string;
  dedicato_a?: string;
  giorno?: string;
  mese?: string;
  email?: string;
  consent?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GIORNI = Array.from({ length: 31 }, (_, i) => i + 1);
const MESI = Array.from({ length: 12 }, (_, i) => i + 1);

const inputClass =
  'w-full rounded-lg border border-oro-caldo/30 bg-white/5 px-4 py-3 text-panna-stellare placeholder:text-rosa-polvere/60 focus:outline-none focus:ring-1 focus:ring-oro-caldo/60';

const labelClass =
  'block text-rosa-polvere/80 mb-2';

const labelStyle = {
  fontSize: 12,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  fontWeight: 600
};

export default function Form({
  defaultDedicatoA = '',
  mode = 'self'
}: Props) {
  const searchParams = useSearchParams();

  const source = useMemo(() => {
    const src = searchParams?.get('src');
    return src && src.length > 0 ? src : 'direct';
  }, [searchParams]);

  const [nome, setNome] = useState('');
  const [dedicatoA, setDedicatoA] = useState(defaultDedicatoA);
  const [giorno, setGiorno] = useState<number | ''>('');
  const [mese, setMese] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [consentDownload, setConsentDownload] = useState(false);
  const [optInNewsletter, setOptInNewsletter] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!nome.trim()) e.nome = 'Inserisci il tuo nome';
    else if (nome.trim().length > 50) e.nome = 'Massimo 50 caratteri';
    if (mode === 'dedica') {
      if (!dedicatoA.trim()) e.dedicato_a = 'Inserisci il nome del destinatario';
      else if (dedicatoA.trim().length > 50) e.dedicato_a = 'Massimo 50 caratteri';
    }
    if (!giorno) e.giorno = 'Seleziona il giorno';
    if (!mese) e.mese = 'Seleziona il mese';
    if (!email.trim()) e.email = 'Inserisci la tua email';
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Email non valida';
    if (!consentDownload)
      e.consent = 'Devi accettare la privacy per ricevere il tuo Spirito Guida';
    return e;
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setSubmitError(null);
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        nome: nome.trim(),
        giorno_nascita: Number(giorno),
        mese_nascita: Number(mese),
        email: email.trim().toLowerCase(),
        opt_in_newsletter: optInNewsletter,
        source,
        ...(mode === 'dedica' && dedicatoA.trim()
          ? { dedicato_a: dedicatoA.trim() }
          : {})
      };
      const res = await fetch('/api/spirit-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Errore di rete');
      }
      const result = (await res.json()) as { shareId?: string };
      if (!result.shareId) throw new Error('Risposta server non valida');
      window.location.href = `/grazie?id=${encodeURIComponent(result.shareId)}`;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Qualcosa è andato storto';
      setSubmitError(msg);
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto mt-10 w-full max-w-md rounded-2xl border border-oro-caldo/30 bg-white/5 p-6 backdrop-blur-md md:p-8"
    >
      {mode === 'dedica' ? (
        <div className="mb-5">
          <label htmlFor="dedicato_a" className={labelClass} style={labelStyle}>
            A chi è dedicato
          </label>
          <input
            id="dedicato_a"
            type="text"
            maxLength={50}
            placeholder="Il nome di chi ami"
            value={dedicatoA}
            onChange={(e) => setDedicatoA(e.target.value)}
            className={inputClass}
            required
          />
          {errors.dedicato_a ? (
            <p className="mt-2 text-sm text-red-300">{errors.dedicato_a}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mb-5">
        <label htmlFor="nome" className={labelClass} style={labelStyle}>
          Il tuo nome
        </label>
        <input
          id="nome"
          type="text"
          maxLength={50}
          placeholder="Come ti chiami"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={inputClass}
          required
        />
        {errors.nome ? (
          <p className="mt-2 text-sm text-red-300">{errors.nome}</p>
        ) : null}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="giorno" className={labelClass} style={labelStyle}>
            Giorno
          </label>
          <select
            id="giorno"
            value={giorno}
            onChange={(e) =>
              setGiorno(e.target.value === '' ? '' : Number(e.target.value))
            }
            className={inputClass}
            required
          >
            <option value="" disabled>
              --
            </option>
            {GIORNI.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {errors.giorno ? (
            <p className="mt-2 text-sm text-red-300">{errors.giorno}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="mese" className={labelClass} style={labelStyle}>
            Mese
          </label>
          <select
            id="mese"
            value={mese}
            onChange={(e) =>
              setMese(e.target.value === '' ? '' : Number(e.target.value))
            }
            className={inputClass}
            required
          >
            <option value="" disabled>
              --
            </option>
            {MESI.map((m) => (
              <option key={m} value={m}>
                {MESI_LABEL[m]}
              </option>
            ))}
          </select>
          {errors.mese ? (
            <p className="mt-2 text-sm text-red-300">{errors.mese}</p>
          ) : null}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="email" className={labelClass} style={labelStyle}>
          La tua email
        </label>
        <input
          id="email"
          type="email"
          placeholder="tua@email.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-red-300">{errors.email}</p>
        ) : null}
      </div>

      <div className="mb-4 flex items-start gap-3">
        <input
          id="consent-download"
          type="checkbox"
          checked={consentDownload}
          onChange={(e) => setConsentDownload(e.target.checked)}
          className="mt-1 h-4 w-4 cursor-pointer accent-oro-caldo"
          required
        />
        <label
          htmlFor="consent-download"
          className="text-sm leading-relaxed text-rosa-polvere/90"
        >
          Ho letto la{' '}
          <Link
            href="/privacy"
            className="text-oro-caldo underline underline-offset-2"
          >
            Privacy
          </Link>{' '}
          e voglio ricevere il mio Spirito Guida (download immediato)
        </label>
      </div>
      {errors.consent ? (
        <p className="mb-3 text-sm text-red-300">{errors.consent}</p>
      ) : null}

      <div className="mb-6 flex items-start gap-3">
        <input
          id="opt-in-newsletter"
          type="checkbox"
          checked={optInNewsletter}
          onChange={(e) => setOptInNewsletter(e.target.checked)}
          className="mt-1 h-4 w-4 cursor-pointer accent-oro-caldo"
        />
        <label
          htmlFor="opt-in-newsletter"
          className="text-sm leading-relaxed text-rosa-polvere/80"
        >
          Voglio ricevere la newsletter settimanale di Indizi Cosmici con
          ispirazioni e simboli
        </label>
      </div>

      {submitError ? (
        <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {submitError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg px-6 py-4 font-semibold text-notte-profonda transition disabled:opacity-60"
        style={{
          background:
            'linear-gradient(180deg, #E9C188 0%, #D7A86E 100%)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontSize: 13,
          boxShadow: '0 8px 24px rgba(215, 168, 110, 0.25)'
        }}
      >
        {submitting
          ? 'Creazione in corso...'
          : 'Crea il mio Spirito Guida ✦'}
      </button>

      {mode === 'self' ? (
        <Link
          href="/dedica"
          className="mt-3 block w-full rounded-lg border border-oro-caldo/50 px-6 py-4 text-center text-panna-stellare transition hover:bg-white/5"
          style={{
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontSize: 12,
            fontWeight: 600
          }}
        >
          🎁 Dedicalo a una persona speciale
        </Link>
      ) : null}

      <p className="mt-6 text-center text-rosa-polvere/50" style={{ fontSize: 11 }}>
        Contenuto a scopo simbolico ed emotivo. Non sostituisce consulenza
        professionale di alcun tipo.
      </p>
    </form>
  );
}
