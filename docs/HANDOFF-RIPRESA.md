# Indizi Cosmici — Handoff ripresa (22 maggio 2026)

Punto di ripresa dopo sessione lunga. Stato, decisioni, lezioni tecniche, TODO.

---

## ✅ COSA FUNZIONA (testato)

- **Funnel E2E verde** su `https://indizi-cosmici.vercel.app`: form → DB Supabase → wallpaper → OG → share tracking. Verificato con `scripts/verify-e2e.sh`.
- **Schema Supabase applicato** (progetto `jlrvxarbthgubvjvcjds`): 4 tabelle con RLS — `subscribers`, `consent_log`, `spirit_guides`, `share_events`.
- **Wallpaper con animale guida** (concept approvato): cervo costellazione come sfondo + testo nel terzo basso. Direzione visual V1 **APPROVATA**. Output jpeg ~168KB.
- **OG card** orizzontale dedicata (animale a destra + testo a sinistra, non crop) ~51KB.
- **Email Brevo**: dominio `indizicosmici.it` **autenticato** (DKIM brevo1/brevo2 + DMARC propagati e verificati). Mittente `noreply@indizicosmici.it` firmato → email pulite in inbox.
- **Env Vercel** configurate: SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, IP_HASH_SALT, ADMIN_USER, ADMIN_PASS, BREVO_API_KEY, EMAIL_FROM (`noreply@indizicosmici.it`), NEXT_PUBLIC_SITE_URL (`https://indizi-cosmici.vercel.app`).

## ⏳ DA VERIFICARE alla ripresa
- **Arrivo email test** `m47uhmgk` (inviata post-autenticazione dominio): controllare inbox Gmail per "✦ Gianmarco, ecco il tuo Spirito Guida" → deve essere in **inbox** (non spam) con **allegato cervo**. + log Brevo "Delivered".

---

## DECISIONI STRATEGICHE (ferme)

- **Concept**: "Crea il tuo Spirito Guida" = animale guida costellazione (cervo, civetta, volpe…) personalizzato con nome + segno + mantra. Framing: *"un piccolo segno da portare con te o da dedicare a chi ami"*.
- **Mood**: Notte Mistica calda (palette `#18122B / #2A1E4A / #5D2C5A / #D7A86E / #F1D8C9 / #FFF6E8`, Cormorant + Manrope).
- **Target**: 35-65, IT. **2 motori traffico**: IG/FB organico + **WhatsApp viral loop** (dedica).
- **Strategia contenuti**: 3 format (Dedica / Specchio / Segno). I veri A/B = **Dedica vs Specchio**; Segno = serie di supporto.
- **Tracking per format**: link `?src=dedica` / `?src=specchio` / `?src=segno` (il codice già salva `subscribers.source`). Manca solo la tabella admin "Lead per sorgente" (~15 righe).
- **KPI 30gg**: base 300-700 · buono 1.000-1.500 · ottimo 3.000+.
- **NO claim**: predizione/destino/guarigione. Disclaimer ovunque.

---

## LEZIONI TECNICHE (non ripetere errori)

- **Satori (@vercel/og) NON decodifica WebP** nelle `<img>`. Usare **JPEG o PNG** per gli animali. (Causa di un 500 risolto.)
- **Animali: nome file = SEGNO**, non animale: `toro.jpg` (cervo), `gemelli.jpg` (volpe), `vergine.jpg` (civetta). Vedi mapping `lib/animali.ts`.
- **Workflow nuovo animale**: salva `{segno}.jpg` in `public/assets/animali/` → ottimizza `sharp resize 1080×1920 cover + jpeg q82-90` → commit → push. Si attiva da solo (`lib/assets.ts` gateway). Fallback al glifo per i segni senza file.
- **Satori layout**: ogni testo = `div` con `display:flex` (no blocchi flex-column con figli multipli → falliscono). Output Satori = PNG pesante → ricomprimere in JPEG con sharp nel route.
- **Wallpaper safe area lock screen**: gradiente scuro forte in alto (zona ora/notch), testo nel terzo basso, footer a 120px dal fondo.
- **Supabase free = 2 progetti attivi PER UTENTE** (cross-org). `cga-hub` + `videogioco` + `indizi-cosmici` = 3 → impossibile tutti attivi gratis. Serve Pro ($25) o migrazione (Vercel Postgres/Neon) per il lancio.
- **Brevo**: per email pulite serve **dominio autenticato** (DKIM), non basta il sender Gmail (= spam/respinta per DMARC). Fatto: dominio `indizicosmici.it` autenticato.
- **DNS `indizicosmici.it` è su Register.it** (nameserver ns1/ns2.register.it). Record A 76.76.21.21 → Vercel già presente.

---

## 🔴 PROMEMORIA IMPORTANTI

- **`cga-hub` Supabase è IN PAUSA** (pausato per attivare indizi-cosmici). Strategy manager CGA + slide IG offline finché è in pausa. **Riattivarlo quando torni su CGA** — ma sei a 2 slot: per averli entrambi attivi serve Pro o migrazione.
- **ADMIN_PASS** è nel file temporaneo `/tmp/ic-adminpass.txt` (si cancella al riavvio Mac). **Salvalo nel password manager** — serve per `/admin`.
- **NEXT_PUBLIC_SITE_URL** = `https://indizi-cosmici.vercel.app` per ora. Cambiare a `https://indizicosmici.it` quando il dominio LP custom è pronto su Vercel (www.indizicosmici.it +4 già collegati).

---

## TODO RIPRESA (ordine)

1. **Verifica email test** in inbox (`m47uhmgk`) — conferma deliverability pulita
2. **Genera altri 11 animali** coerenti (stesso tool/stile delle 3 reference). Mancano: gemelli (volpe), vergine (civetta), ariete (falco), cancro (balena), leone, bilancia (cigno), scorpione (serpente), sagittario (cavallo), capricorno (stambecco), acquario (farfalla), pesci (delfino). Prompt template in `docs/ASSET-INTEGRATION.md`.
3. **Tabella admin "Lead per sorgente"** (~15 righe, ora che il funnel è verde)
4. **DNS LP custom**: `indizicosmici.it` → il sito Vercel (verificare se già attivo) → poi `NEXT_PUBLIC_SITE_URL` = `https://indizicosmici.it`
5. **Contenuti**: già in `content/30-giorni/` (calendario + 10 caroselli + 5 reel + 12 post segni + 4 quote). Produrre asset grafici.
6. **Lancio**: bio IG/FB + primi 3 post pilota + monitoring lead reale.

---

## ALTRI 2 BINARI (fuori Indizi Cosmici)

- **Bot videogioco**: ✅ RIPRISTINATO. Era giù per outage Railway (Google Cloud) → n8n non agganciava Postgres → risolto con redeploy Postgres poi n8n. Funzionante.
- **Document Intake V0**: prep tecnico completo in `~/Desktop/SISTEMA/handoff/document-intake-v0-prep.md`. n8n ora è su → eseguibile quando vuoi (con backup workflow + regression test come da piano). `note_progetti` esiste già su Supabase videogioco.

---

## COMMIT CHIAVE (repo gianmarcopandozi-droid/indizi-cosmici, branch main)
V1 funnel, Brevo, animale wallpaper/OG, gradiente safe-area + jpeg. Tutto su GitHub.
