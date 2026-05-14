# Indizi Cosmici

Landing page + lead capture funnel per il lead magnet **Spirito Guida** — un piccolo segno cosmico personalizzato (nome + segno + costellazione + mantra) da portare con sé o dedicare a chi si ama.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **DB**: Supabase (`indizi-cosmici`, org gporg)
- **Email**: Resend (transazionale) — wrapper provider-agnostic
- **Image gen**: `@vercel/og` (Satori) primario, `sharp` SVG→PNG fallback
- **Hosting**: Vercel
- **Analytics**: Plausible (opzionale)

## Setup locale

```bash
cp .env.local.example .env.local   # compila le chiavi
npm install
npm run dev
```

Vai su [http://localhost:3000](http://localhost:3000).

## Variabili d'ambiente

Vedi `.env.local.example`. Solo Supabase è strettamente richiesto. Resend, Plausible, ADMIN_* sono opzionali — l'app degrada con dev-mode (email su `tmp/emails/`, niente analytics, admin 404).

## Struttura

```
app/
├── page.tsx                    # LP
├── grazie/                     # thank-you + 3 CTA dedica
├── sg/[shareId]/               # share page con OG dinamica
├── wallpaper/[shareId]/        # PNG 1080×1920 generato runtime
├── og/[shareId]/               # PNG 1200×630 OG card
└── api/                        # spirit-guide, share, confirm, unsubscribe

components/                     # SpiritGuideCard, Form, ecc.
lib/                            # supabase, email wrapper, zodiac, mantras
content/                        # MDX privacy/termini + 30-giorni content pack
emails/                         # react-email templates
public/assets/                  # asset visual master da ChatGPT
docs/                           # DNS-SETUP, ASSET-INTEGRATION
```

## Funnel

```
LP → form → POST /api/spirit-guide
   → insert subscribers + consent_log + spirit_guides
   → email transazionale con wallpaper
   → /grazie?id=<shareId>
   → CTA WhatsApp → /sg/[shareId] con OG card
```

## Stato V1

Vedi `docs/STATO-V1.md` (generato a fine deploy).
