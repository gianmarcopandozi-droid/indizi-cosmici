# Stato V1 — Indizi Cosmici

**Data deploy**: 14 maggio 2026 · 03:15 IT
**Commit**: `e998794` (su `main`)
**Repo**: https://github.com/gianmarcopandozi-droid/indizi-cosmici
**URL Vercel pre-DNS**: https://indizi-cosmici.vercel.app (HTTP 200 verificato)
**URL finale post-DNS**: https://indizicosmici.it

---

## ✅ Cosa funziona (testato in build)

### Codice
- Build Next.js 15 verde (16 routes compilate)
- TypeScript strict pulito (zero `any`)
- ESLint pulito
- Middleware basic auth attivo
- Tutti gli endpoint compilano, dipendenze installate

### Pagine pubbliche
- `/` — Landing page con form (nome, gg/mm, email + 2 checkbox)
- `/grazie?id=…` — thank-you con preview + 3 CTA (regala / WhatsApp / salva)
- `/sg/[shareId]` — share page pubblica con OG dinamica
- `/dedica` — form mode regalo (campo `dedicato_a` aggiuntivo)
- `/privacy` — informativa GDPR italiana 12 sezioni
- `/termini` — termini d'uso 8 sezioni + disclaimer simbolico
- `/unsubscribe?token=…` — disiscrizione newsletter
- `/grazie-newsletter` — conferma double opt-in

### Pagina admin
- `/admin` — basic auth, dashboard 6 metriche (lead totali / oggi / opt-in newsletter / confermati / share events / distribuzione segni)
- 404 se `ADMIN_USER`/`ADMIN_PASS` env mancanti

### API routes
- `POST /api/spirit-guide` — form submit (zod validation, calcolo segno, mantra, UPSERT subscribers, INSERT consent_log, INSERT spirit_guides, send email transazionale con wallpaper allegato, doppia email conferma se opt-in newsletter)
- `POST /api/share` — tracking share events (whatsapp / copy_link / telegram / other)
- `GET /api/confirm/[token]` — double opt-in confirm
- `GET /api/unsubscribe/[token]` — unsubscribe newsletter

### Image generation
- `GET /wallpaper/[shareId]` — PNG 1080×1920 via Satori (fallback automatico a sharp SVG→PNG se Satori falla)
- `GET /og/[shareId]` — PNG 1200×630 OG card per WhatsApp/FB preview

### Email
- Wrapper `lib/email/index.ts` provider-agnostic (Resend oggi, Brevo domani con swap di file)
- Template react-email `spirit-guide.tsx` (transazionale immediata, con allegato wallpaper)
- Template react-email `newsletter-confirm.tsx` (double opt-in)
- **Dev mode automatico**: se `RESEND_API_KEY` mancante, scrive `tmp/emails/*.html`

### Contenuti pronti
- `content/mantras.json` — 60 mantra (5 × 12 segni), selezione deterministica per shareId
- `content/30-giorni/calendario.md` — calendario editoriale 30 giorni IG+FB
- `content/30-giorni/caroselli/` — 10 caroselli completi (slide + caption + hashtag)
- `content/30-giorni/reel-brief/` — 5 reel brief completi (voiceover, beat-by-beat, stock keywords)
- `content/30-giorni/post-segni/` — 12 post showcase (uno per segno, caption + slide structure + mantra pool)
- `content/30-giorni/quote-cards/` — 4 quote cards (le 4 frasi pillar)

### Documentazione
- `README.md` — overview + setup
- `docs/DNS-SETUP.md` — record DNS Register.it → Vercel + Resend (copia-incolla)
- `docs/ASSET-INTEGRATION.md` — come integrare gli asset visual master da ChatGPT (4 prompt pronti)
- `supabase/migrations/v1_initial_schema.sql` — schema completo da eseguire manualmente

### Fallback runtime
- RESEND mancante → dev mode su `tmp/emails/`
- PLAUSIBLE mancante → niente script analytics, nessun errore
- Satori glitch 1080×1920 → automatic switch a sharp
- Asset master mancanti → placeholder procedurali (gradient + Unicode glifo + SVG stelle)
- ADMIN_* mancanti → `/admin` ritorna 404 (no crash)

---

## ⚠️ Cosa manca / da fare manualmente (passi obbligatori per andare live)

### 1. Schema Supabase (5 min)
Il Supabase MCP è andato in timeout durante l'esecuzione. Lo schema è pronto come file SQL:

→ Apri https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds/sql/new
→ Copia tutto il contenuto di `supabase/migrations/v1_initial_schema.sql`
→ Run

Crea 4 tabelle (`subscribers`, `consent_log`, `spirit_guides`, `share_events`) + indici + RLS + policy.

### 2. Env vars su Vercel (10 min)
Da Vercel dashboard → progetto `indizi-cosmici` → Settings → Environment Variables, aggiungi (env: Production):

| Variabile | Valore |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jlrvxarbthgubvjvcjds.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (da dashboard Supabase → API → anon public) |
| `SUPABASE_SERVICE_ROLE_KEY` | (da dashboard Supabase → API → service_role) |
| `RESEND_API_KEY` | (opzionale) da resend.com/api-keys |
| `EMAIL_FROM` | `Indizi Cosmici <ciao@indizicosmici.it>` |
| `IP_HASH_SALT` | generato con `openssl rand -hex 32` |
| `ADMIN_USER` | scelto da te (es. `gianmarco`) |
| `ADMIN_PASS` | scelto da te (forte, almeno 16 char) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | (opzionale, vuoto = niente analytics) |
| `NEXT_PUBLIC_SITE_URL` | `https://indizicosmici.it` |

Dopo aver aggiunto le env → trigger redeploy (Settings → Deployments → "..." menu → Redeploy).

### 3. DNS Register.it → Vercel (5 min utente + 5–60 min propagazione)
Segui `docs/DNS-SETUP.md`. 2 record da aggiungere:
- `A` `@` → `76.76.21.21`
- `CNAME` `www` → `cname.vercel-dns.com.`

Poi da Vercel → Settings → Domains → aggiungi `indizicosmici.it`.

### 4. Resend domain verification (10 min, opzionale per V1)
Se vuoi che le email partano da `@indizicosmici.it` invece di `@resend.dev`:
- resend.com/domains → Add domain `indizicosmici.it`
- Aggiungi i 4 record DNS che Resend ti dà (SPF + 2× DKIM + DMARC) in Register
- Aspetta verifica
- Imposta `EMAIL_FROM` su Vercel con `ciao@indizicosmici.it`

Senza questo, in dev mode le email finiscono in `tmp/emails/` (utile per test).

### 5. Asset visual master da ChatGPT (opzionale per V1)
Vedi `docs/ASSET-INTEGRATION.md`. Quando ChatGPT consegna:
- 12 glifi SVG → `public/assets/glifi/`
- 3 sfondi cinematic → `public/assets/backgrounds/`
- 4 quote backgrounds → `public/assets/quote-backgrounds/`
- 2 textures → `public/assets/textures/`

Push → redeploy automatico. Zero codice da toccare (gateway in `lib/assets.ts`).

---

## 📋 Cosa devo fare io domani

1. **Verifica E2E in prod** (dopo aver eseguito i 4 step manuali sopra): visito LP, compilo form, ricevo email, scarico wallpaper, condivido su WhatsApp, controllo OG card
2. **Bio Instagram/Facebook**: testo + link `indizicosmici.it` (proponi anche bio definitiva)
3. **Programmazione primi 7 post** su Meta Creator Studio dal calendario `content/30-giorni/`
4. **Monitora primo lead**: query Supabase `select * from subscribers order by created_at desc limit 10`
5. **Iterazione contenuti**: se i primi 3 reel non superano 1k impression, riscrittura hook

---

## 🔗 Link operativi

| Risorsa | URL |
|---|---|
| Repo GitHub | https://github.com/gianmarcopandozi-droid/indizi-cosmici |
| Deployment Vercel (pre-DNS) | https://indizi-cosmici.vercel.app |
| Vercel dashboard | https://vercel.com/dashboard (cerca progetto `indizi-cosmici`) |
| Supabase dashboard | https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds |
| Supabase SQL Editor | https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds/sql/new |
| Register.it (dominio) | https://register.it (sezione gestione DNS `indizicosmici.it`) |
| Resend | https://resend.com/domains |

---

## 📂 File creati (riepilogo)

| Categoria | Numero | Esempio |
|---|---|---|
| Config root | 8 | `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.js`, `eslint.config.mjs`, `postcss.config.mjs`, `vercel.json`, `middleware.ts` |
| App pages | 9 | `app/page.tsx`, `app/grazie/`, `app/sg/[shareId]/`, `app/dedica/`, `app/privacy/`, `app/termini/`, `app/unsubscribe/`, `app/grazie-newsletter/`, `app/admin/` |
| API routes | 4 | `app/api/{spirit-guide,share,confirm/[token],unsubscribe/[token]}/route.ts` |
| Image routes | 2 | `app/wallpaper/[shareId]/`, `app/og/[shareId]/` |
| Components | 7 | `Form`, `SpiritGuideCard`, `Glifo`, `StarsBg`, `ReassuranceStrip`, `QuoteCard`, `ShareButtons` |
| Lib | 9 | `supabase-server`, `zodiac`, `mantras`, `short-id`, `hash`, `assets`, `wallpaper-svg`, `email/index`, `email/resend`, `email/devmode` |
| Email templates | 2 | `emails/spirit-guide.tsx`, `emails/newsletter-confirm.tsx` |
| Content | 35 | `mantras.json` + `30-giorni/calendario.md` + 10 caroselli + 5 reel brief + 12 post segni + 4 quote cards + `privacy.md` + `termini.md` |
| Docs | 3 | `DNS-SETUP.md`, `ASSET-INTEGRATION.md`, `STATO-V1.md` |
| Supabase | 1 | `supabase/migrations/v1_initial_schema.sql` |

**Totale**: ~90 file. ~12.000 parole di contenuti redazionali italiani.
