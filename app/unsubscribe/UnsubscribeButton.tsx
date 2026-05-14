'use client';

import { useState } from 'react';

type Props = { token: string };

export default function UnsubscribeButton({ token }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/unsubscribe/${encodeURIComponent(token)}`, {
        method: 'GET'
      });
      if (!res.ok && res.status !== 302) {
        throw new Error(`Errore ${res.status}`);
      }
      window.location.href = '/unsubscribe?ok=1';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(`Non e stato possibile disiscriverti (${message}). Riprova tra poco.`);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="font-body text-sm tracking-[0.2em] uppercase bg-oro-caldo text-notte-profonda px-8 py-3 rounded-full hover:bg-panna-stellare transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        {loading ? 'Sto disiscrivendoti…' : 'Si, disiscrivimi'}
      </button>
      {error ? (
        <p className="font-body text-sm text-rosa-polvere" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
