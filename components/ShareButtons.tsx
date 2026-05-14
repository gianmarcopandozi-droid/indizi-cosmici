'use client';

import type { MouseEvent } from 'react';

type Props = {
  shareId: string;
  siteUrl: string;
};

export default function ShareButtons({ shareId, siteUrl }: Props) {
  const shareUrl = `${siteUrl.replace(/\/$/, '')}/sg/${shareId}`;
  const waText = `Ho creato il mio Spirito Guida ✨ Crea il tuo: ${shareUrl}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(waText)}`;
  const wallpaperHref = `/wallpaper/${shareId}`;

  async function trackShare(channel: 'whatsapp') {
    try {
      await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ shareId, channel })
      });
    } catch {
      /* fire-and-forget */
    }
  }

  function handleWhatsApp(ev: MouseEvent<HTMLAnchorElement>) {
    ev.preventDefault();
    void trackShare('whatsapp');
    window.location.href = waHref;
  }

  return (
    <div className="mt-8 flex w-full max-w-md flex-col gap-3">
      <a
        href={`/dedica?ref=${encodeURIComponent(shareId)}`}
        className="block w-full rounded-lg px-6 py-4 text-center font-semibold text-notte-profonda"
        style={{
          background: 'linear-gradient(180deg, #E9C188 0%, #D7A86E 100%)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontSize: 13,
          boxShadow: '0 8px 24px rgba(215, 168, 110, 0.25)'
        }}
      >
        🎁 Crea un altro da regalare
      </a>

      <a
        href={waHref}
        onClick={handleWhatsApp}
        rel="noopener noreferrer"
        className="block w-full rounded-lg px-6 py-4 text-center font-semibold text-white"
        style={{
          background: '#25d366',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontSize: 13
        }}
      >
        💚 Condividi su WhatsApp
      </a>

      <a
        href={wallpaperHref}
        download
        className="block w-full rounded-lg border border-panna-stellare/40 px-6 py-4 text-center text-panna-stellare hover:bg-white/5"
        style={{
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontSize: 12,
          fontWeight: 600
        }}
      >
        ⬇ Salva in galleria il tuo sfondo
      </a>
    </div>
  );
}
