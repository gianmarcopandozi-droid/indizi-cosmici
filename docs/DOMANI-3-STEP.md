# Domani — 3 step E2E (no DNS, no contenuti, no ads)

Obiettivo: andare da "build verde" a "funnel verificato end-to-end" sul dominio Vercel `indizi-cosmici.vercel.app`. **Niente DNS custom, niente programmazione post, niente ads** finché questo non passa.

Tempo stimato totale: 25-40 min.

---

## STEP 1 — Schema Supabase (5 min)

Il Supabase MCP è andato in timeout durante l'esecuzione automatica, quindi va fatto a mano. È una sola operazione.

1. Apri (lo apro io con `open`):
   `https://supabase.com/dashboard/project/jlrvxarbthgubvjvcjds/sql/new`

2. Copia tutto il contenuto di `supabase/migrations/v1_initial_schema.sql` e incollalo nell'editor

3. Click "Run"

4. Verifica: in Table Editor devi vedere 4 tabelle nuove (`subscribers`, `consent_log`, `spirit_guides`, `share_events`), tutte vuote, tutte con RLS attiva (lucchetto verde)

---

## STEP 2 — Env vars Vercel (10 min)

Apri: `https://vercel.com/dashboard` → progetto `indizi-cosmici` → **Settings → Environment Variables**. Aggiungi le seguenti, environment **Production + Preview**:

### Obbligatorie (senza queste il funnel non parte)

```
NEXT_PUBLIC_SUPABASE_URL = https://jlrvxarbthgubvjvcjds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = <dal pannello Supabase → API → "anon public">
SUPABASE_SERVICE_ROLE_KEY = <dal pannello Supabase → API → "service_role" — TIENILA SEGRETA>
IP_HASH_SALT = <esegui in terminale: openssl rand -hex 32 — incolla l'output>
NEXT_PUBLIC_SITE_URL = https://indizi-cosmici.vercel.app
```

### Opzionali (dev mode senza)

```
RESEND_API_KEY = <vuoto = email scritte su tmp/emails/ nel server (vedi function logs)>
EMAIL_FROM = Indizi Cosmici <onboarding@resend.dev>    # default se RESEND domain non verificato
ADMIN_USER = <scelto da te, es. gianmarco>
ADMIN_PASS = <scelto forte, almeno 16 char>
NEXT_PUBLIC_PLAUSIBLE_DOMAIN =                          # vuoto per ora
```

### Trigger redeploy

Dopo aver salvato le env: **Deployments → ultimo build → "..." menu → Redeploy** (oppure push qualsiasi commit). Aspetta ~2 min finché lo status diventa Ready.

---

## STEP 3 — Test funnel end-to-end (10-15 min)

### 3a. Automatico (1 minuto)

Esegui in terminale:

```bash
cd ~/Desktop/SISTEMA/indizi-cosmici
BASE_URL=https://indizi-cosmici.vercel.app bash scripts/verify-e2e.sh
```

Lo script verifica 8 punti:
1. LP raggiungibile
2. Pagine statiche (privacy, termini, grazie-newsletter)
3. Form submit (POST /api/spirit-guide) → riceve `shareId`
4. Wallpaper PNG 1080×1920 generato e scaricabile
5. OG card 1200×630
6. Share page con `og:image` corretto
7. Tracking share event
8. Istruzioni manuali per WhatsApp preview

### 3b. Manuale tu in prima persona (10 min)

1. Apri **da telefono** (non desktop, per il test reale): `https://indizi-cosmici.vercel.app`
2. Compila form con i tuoi dati reali + email vera
3. Spunta sia checkbox 1 (obbligatoria) che checkbox 2 (newsletter)
4. Click "Crea il mio Spirito Guida"
5. **Verifica `/grazie?id=...`**: vedi preview del tuo wallpaper? I 3 CTA appaiono?
6. **Apri email** (gmail/altro): è arrivata? Allegato PNG presente? L'immagine corrisponde al tuo nome+segno?
7. **Salva il PNG** dalla email, impostalo come sfondo telefono → controlla che sia leggibile a risoluzione reale
8. **Click "Condividi WhatsApp"** dalla thank-you → si apre WhatsApp con prefill?
9. **Manda il link a te stesso** su WhatsApp → arriva la card preview con l'immagine? (Può richiedere 2-3 sec, WhatsApp cacha le OG)
10. **Verifica DB**: Supabase dashboard → table editor → 4 tabelle popolate?

---

## Cosa NON fare ancora (anti-perfezionismo)

- ❌ **DNS custom** `indizicosmici.it` → finché il funnel non gira al 100% su `.vercel.app`
- ❌ **Programmare i 30 post** → inutile prima di avere conferma che il link in bio funziona
- ❌ **Ads Meta** → assolutamente no, prima vediamo conversion rate organico
- ❌ **Asset master ChatGPT** → quando li hai, drop in `public/assets/` — niente codice da toccare
- ❌ **Sistemare animazioni / micro-interazioni / shader** → V2

---

## Se qualcosa rompe

| Sintomo | Causa probabile | Fix |
|---|---|---|
| Form submit ritorna 500 | Schema SQL non applicato | Step 1 |
| Form submit ritorna 500 + log "Supabase env mancante" | Env vars Vercel mancanti | Step 2 + redeploy |
| Email non arriva | `RESEND_API_KEY` vuota | Per V1 OK, l'email è scritta nei function logs Vercel. Per email vere: aggiungi key |
| Email arriva in SPAM | Dominio Resend non verificato | Vai su resend.com/domains, verifica `indizicosmici.it` (richiede DNS Register fatto prima) |
| Wallpaper PNG = 0 byte o crash | Satori fallisce, sharp fallback non disponibile (build edge?) | Controlla function logs su Vercel, condividili e fixiamo |
| OG card WhatsApp non appare | Cache WA. Riprova con opengraph.xyz | Normale, attendi |

---

## Quando i 3 step passano

→ Solo allora ha senso: DNS custom, primi 3 post IG/FB pilota, monitoring lead reale.

Il valore non è nella perfezione tecnica. Il valore è in **hook + reel forti che generano save/share/curiosità** che alimentino il funnel. Quello è il vero collo di bottiglia.
