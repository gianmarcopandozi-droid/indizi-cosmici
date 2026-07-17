# Consenso Granulare + Metriche Sprint (Fase 1 IC) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** instrumentare il funnel IC con i 2 consensi marketing granulari (A: offerte partner via IC; B: cessione a terzi), log consenso bloccante/atomico, privacy aggiornata (Brevo), e metriche go/no-go in admin.

**Architecture:** feature verticale sul funnel esistente: DDL (2 colonne + check constraint) → API route (validazione+persistenza+atomicità) → Form (2 checkbox opzionali) → privacy (finalità+provider) → admin (query sprint). Nessun nuovo servizio.

**Tech Stack:** Next.js 15 (App Router), Supabase (service_role via `getServiceRoleClient`), zod, React 19.

## Global Constraints

- Repo: `~/Desktop/SISTEMA/indizi-cosmici`, branch `main` (spec: `docs/superpowers/specs/2026-07-16-ic-validation-sprint-design.md`)
- I 2 checkbox marketing sono **opzionali e NON pre-spuntati**; il download Spirito Guida NON dipende da essi
- `CONSENT_VERSION` bump: `'v1-2026-05-14'` → `'v2-2026-07-17'`
- Wording checkbox/privacy = **BOZZA**: il deploy in produzione è **gated dalla validazione del legale** (decisione Gianmarco)
- DDL su Supabase prod (progetto IC `jlrvxarbthgubvjvcjds`): **solo previa conferma esplicita di Gianmarco**, via SQL Editor (REST anon non può DDL)
- Verifica standard per ogni task: `npm run typecheck && npm run lint` (build completa nel task finale)
- Commit frequenti, messaggi `feat(consent): ...` / `docs(privacy): ...`

---

### Task 1: Migration DDL (file + applicazione gated)

**Files:**
- Create: `supabase/migrations/v2_third_party_consent.sql`

**Interfaces:**
- Produces: colonne `subscribers.opt_in_partner_offers` e `subscribers.opt_in_third_party` (boolean not null default false); `consent_log.consent_type` ammette anche `'partner_marketing'` e `'third_party_marketing'`.

- [ ] **Step 1: Scrivi il file migration**

```sql
-- v2: consensi marketing granulari (Scenario A: offerte partner via IC; Scenario B: cessione a terzi)
-- Spec: docs/superpowers/specs/2026-07-16-ic-validation-sprint-design.md §5.1

alter table public.subscribers
  add column if not exists opt_in_partner_offers boolean not null default false;

alter table public.subscribers
  add column if not exists opt_in_third_party boolean not null default false;

-- consent_type: il constraint v1 ammette solo ('download','newsletter')
alter table public.consent_log
  drop constraint if exists consent_log_consent_type_check;

alter table public.consent_log
  add constraint consent_log_consent_type_check
  check (consent_type in ('download','newsletter','partner_marketing','third_party_marketing'));
```

- [ ] **Step 2: Verifica sintassi in locale (dry-read)**

Run: `cat supabase/migrations/v2_third_party_consent.sql` e confronta i nomi con `v1_initial_schema.sql` (constraint default di Postgres per il check inline su `consent_type` è `consent_log_consent_type_check`).
Expected: nomi coerenti, nessun typo.

- [ ] **Step 3: Applicazione su prod — GATE Gianmarco**

Chiedere conferma esplicita a Gianmarco, poi: aprire Supabase SQL Editor del progetto IC (`jlrvxarbthgubvjvcjds`) e incollare il contenuto del file. In alternativa, se l'MCP Supabase è autenticato sul progetto IC, usare `apply_migration`.
Expected: `ALTER TABLE` × 4 senza errori.

- [ ] **Step 4: Verifica post-DDL**

Run (con `.env.local` del repo IC, service key MAI stampata):
```bash
cd ~/Desktop/SISTEMA/indizi-cosmici && set -a && source .env.local && set +a && \
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/subscribers?select=opt_in_partner_offers,opt_in_third_party&limit=1" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```
Expected: `200` con le 2 colonne (array anche vuoto va bene). NOTA: verificare il nome esatto della var service key in `.env.local` prima di eseguire.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/v2_third_party_consent.sql
git commit -m "feat(consent): migration v2 — colonne opt_in_partner_offers/opt_in_third_party + consent_type esteso"
```

---

### Task 2: API route — schema, persistenza, log bloccante e atomico

**Files:**
- Modify: `app/api/spirit-guide/route.ts` (BodySchema ~L20-28; CONSENT_VERSION L18; payload subscribers ~L76-87; consent rows ~L108-130)

**Interfaces:**
- Consumes: colonne DDL Task 1.
- Produces: API accetta `opt_in_partner_offers?: boolean` e `opt_in_third_party?: boolean` (default false); li persiste su `subscribers`; logga `consent_log` con `consent_type` `'partner_marketing'`/`'third_party_marketing'`; su fallimento log dei consensi marketing → compensating update + 500.

- [ ] **Step 1: Aggiorna CONSENT_VERSION e BodySchema**

In `route.ts` sostituisci:
```ts
const CONSENT_VERSION = 'v1-2026-05-14';
```
con:
```ts
const CONSENT_VERSION = 'v2-2026-07-17';
```
e in `BodySchema` aggiungi dopo `opt_in_newsletter: z.boolean(),`:
```ts
  opt_in_partner_offers: z.boolean().optional().default(false),
  opt_in_third_party: z.boolean().optional().default(false),
```

- [ ] **Step 2: Persisti i 2 flag nel subscriberPayload**

Dopo `opt_in_newsletter: data.opt_in_newsletter` aggiungi:
```ts
      opt_in_partner_offers: data.opt_in_partner_offers,
      opt_in_third_party: data.opt_in_third_party,
```

- [ ] **Step 3: Consent rows + log BLOCCANTE per i consensi marketing**

Sostituisci il blocco consent esistente (da `const consentRows` fino al commento `// non blocco il flusso, ma loggho` incluso) con:

```ts
    const consentRows: Array<Record<string, unknown>> = [
      {
        subscriber_id: subscriber.id,
        consent_type: 'download',
        consent_version: CONSENT_VERSION,
        ip_hash,
        user_agent: ua
      }
    ];
    if (data.opt_in_newsletter) {
      consentRows.push({
        subscriber_id: subscriber.id,
        consent_type: 'newsletter',
        consent_version: CONSENT_VERSION,
        ip_hash,
        user_agent: ua
      });
    }
    if (data.opt_in_partner_offers) {
      consentRows.push({
        subscriber_id: subscriber.id,
        consent_type: 'partner_marketing',
        consent_version: CONSENT_VERSION,
        ip_hash,
        user_agent: ua
      });
    }
    if (data.opt_in_third_party) {
      consentRows.push({
        subscriber_id: subscriber.id,
        consent_type: 'third_party_marketing',
        consent_version: CONSENT_VERSION,
        ip_hash,
        user_agent: ua
      });
    }

    const hasMarketingConsent =
      data.opt_in_newsletter || data.opt_in_partner_offers || data.opt_in_third_party;

    const { error: consentErr } = await supabase.from('consent_log').insert(consentRows);
    if (consentErr) {
      console.error('[spirit-guide] consent_log insert error:', consentErr);
      if (hasMarketingConsent) {
        // Atomicità (spec §5.1.d): senza prova di consenso il lead marketing NON è utilizzabile.
        // Compensating update: azzera i flag marketing appena upsertati.
        const { error: compErr } = await supabase
          .from('subscribers')
          .update({
            opt_in_newsletter: false,
            opt_in_partner_offers: false,
            opt_in_third_party: false
          })
          .eq('id', subscriber.id);
        if (compErr) {
          console.error('[spirit-guide] compensating update FALLITO:', compErr);
        }
        return NextResponse.json(
          { ok: false, error: 'Errore registrazione consenso, riprova' },
          { status: 500 }
        );
      }
      // solo consenso download: non bloccante (il download non è finalità marketing)
    }
```

- [ ] **Step 4: Verifica statica**

Run: `npm run typecheck && npm run lint`
Expected: 0 errori.

- [ ] **Step 5: Commit**

```bash
git add app/api/spirit-guide/route.ts
git commit -m "feat(consent): API — 2 consensi marketing granulari, consent_log bloccante+atomico, CONSENT_VERSION v2"
```

---

### Task 3: Form — 2 checkbox opzionali (wording BOZZA)

**Files:**
- Modify: `components/Form.tsx` (state ~L57; payload ~L91-100; JSX dopo il blocco `opt-in-newsletter` ~L266-283)

**Interfaces:**
- Consumes: API Task 2 (`opt_in_partner_offers`, `opt_in_third_party`).
- Produces: UI con 2 checkbox opzionali non pre-spuntati.

- [ ] **Step 1: State**

Dopo `const [optInNewsletter, setOptInNewsletter] = useState(false);` aggiungi:
```tsx
  const [optInPartnerOffers, setOptInPartnerOffers] = useState(false);
  const [optInThirdParty, setOptInThirdParty] = useState(false);
```

- [ ] **Step 2: Payload**

Dopo `opt_in_newsletter: optInNewsletter,` aggiungi:
```tsx
        opt_in_partner_offers: optInPartnerOffers,
        opt_in_third_party: optInThirdParty,
```

- [ ] **Step 3: JSX — 2 checkbox dopo il blocco newsletter**

Subito dopo il `</div>` del blocco `opt-in-newsletter` (stesso stile) inserisci:

```tsx
      {/* WORDING BOZZA — da validare col legale PRIMA del deploy (spec §5.1.a) */}
      <div className="mb-4 flex items-start gap-3">
        <input
          id="opt-in-partner-offers"
          type="checkbox"
          checked={optInPartnerOffers}
          onChange={(e) => setOptInPartnerOffers(e.target.checked)}
          className="mt-1 h-4 w-4 cursor-pointer accent-oro-caldo"
        />
        <label
          htmlFor="opt-in-partner-offers"
          className="text-sm leading-relaxed text-rosa-polvere/80"
        >
          Voglio ricevere da Indizi Cosmici offerte e novità di partner
          selezionati (invio a cura di Indizi Cosmici)
        </label>
      </div>

      <div className="mb-6 flex items-start gap-3">
        <input
          id="opt-in-third-party"
          type="checkbox"
          checked={optInThirdParty}
          onChange={(e) => setOptInThirdParty(e.target.checked)}
          className="mt-1 h-4 w-4 cursor-pointer accent-oro-caldo"
        />
        <label
          htmlFor="opt-in-third-party"
          className="text-sm leading-relaxed text-rosa-polvere/80"
        >
          Acconsento alla comunicazione dei miei dati (nome, email, segno) a
          partner terzi selezionati, che potranno contattarmi per finalità di
          marketing come autonomi titolari (
          <Link
            href="/privacy"
            className="text-oro-caldo underline underline-offset-2"
          >
            informativa
          </Link>
          )
        </label>
      </div>
```

NOTA: il `mb-6` del blocco newsletter esistente va cambiato in `mb-4` per spaziatura uniforme (i nuovi blocchi chiudono con `mb-6`).

- [ ] **Step 4: Verifica statica**

Run: `npm run typecheck && npm run lint`
Expected: 0 errori.

- [ ] **Step 5: Commit**

```bash
git add components/Form.tsx
git commit -m "feat(consent): form — 2 checkbox marketing granulari opzionali (wording bozza per legale)"
```

---

### Task 4: Privacy — fix Brevo + finalità marketing terzi + data

**Files:**
- Modify: `app/privacy/page.tsx` (sezione 6 Trasferimenti extra-UE, ~L100-115; sezione finalità)
- Modify: `content/privacy.md` (riga 28 area finalità; riga 44 Resend)

**Interfaces:**
- Consumes: wording checkbox Task 3 (coerenza).
- Produces: informativa allineata a codice reale (Brevo) e alle nuove finalità. BOZZA per il legale.

- [ ] **Step 1: Sostituisci Resend→Brevo in entrambi i file**

In `app/privacy/page.tsx`, sostituisci il `<li>` di Resend con:
```tsx
              <li>
                Brevo (email transazionale e marketing) — server in Unione
                Europea, conforme GDPR
              </li>
```
In `content/privacy.md` riga 44, sostituisci:
```
- Resend (email transazionale) — server negli Stati Uniti, conforme Standard Contractual Clauses (SCC)
```
con:
```
- Brevo (email transazionale e marketing) — server in Unione Europea, conforme GDPR
```

- [ ] **Step 2: Aggiungi le 2 nuove finalità (BOZZA legale)**

In `content/privacy.md`, dopo la riga 28 (finalità newsletter) aggiungi:
```
- Per inviarti, solo se hai espresso consenso esplicito e separato, comunicazioni promozionali di partner selezionati (invio effettuato da Indizi Cosmici)
- Per comunicare i tuoi dati (nome, email, segno zodiacale) a partner terzi selezionati che agiscono come autonomi titolari del trattamento, solo se hai espresso consenso esplicito e separato; l'elenco delle categorie di partner è disponibile su richiesta e ogni comunicazione include modalità di revoca
```
In `app/privacy/page.tsx` replica le stesse due voci nella sezione finalità corrispondente (stesso testo, come `<li>`).

- [ ] **Step 3: Aggiorna la data dell'informativa**

In `content/privacy.md` e in `app/privacy/page.tsx`, aggiorna la data in cima al documento a `17 luglio 2026` (cercare la data v1 esistente).

- [ ] **Step 4: Verifica statica**

Run: `npm run typecheck && npm run lint`
Expected: 0 errori.

- [ ] **Step 5: Commit**

```bash
git add app/privacy/page.tsx content/privacy.md
git commit -m "docs(privacy): Brevo al posto di Resend + finalità marketing partner/terzi (bozza per validazione legale)"
```

---

### Task 5: Admin — metriche go/no-go sprint

**Files:**
- Modify: `app/admin/page.tsx` (`loadMetrics()` ~L16-80 e relativa UI)

**Interfaces:**
- Consumes: colonne Task 1.
- Produces: 4 metriche nuove renderizzate: creazioni Spirito Guida (30gg), dedica-rate %, opt-in partner, opt-in terzi (su confermati) — le query esatte dello spec §3.

- [ ] **Step 1: Estendi le query in `loadMetrics()`**

Aggiungi al `Promise.all` esistente:
```ts
    supabase
      .from('spirit_guides')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgoIso),
    supabase
      .from('spirit_guides')
      .select('*', { count: 'exact', head: true })
      .not('dedicato_a', 'is', null)
      .gte('created_at', thirtyDaysAgoIso),
    supabase
      .from('subscribers')
      .select('opt_in_partner_offers, opt_in_third_party, confirmed, opt_in_newsletter')
```
con, prima del `Promise.all`:
```ts
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();
```
e destruttura i 3 nuovi risultati come `sgCountRes, sgDedicaRes, marketingRes`.

- [ ] **Step 2: Calcola le metriche**

Dopo i calcoli esistenti aggiungi:
```ts
  const sgCount30d = sgCountRes.count ?? 0;
  const sgDedica30d = sgDedicaRes.count ?? 0;
  const dedicaPct = sgCount30d > 0 ? Math.round((sgDedica30d / sgCount30d) * 100) : 0;

  const mkData = (marketingRes.data ?? []) as Array<{
    opt_in_partner_offers: boolean;
    opt_in_third_party: boolean;
    confirmed: boolean;
    opt_in_newsletter: boolean;
  }>;
  const newsletterConfirmed = mkData.filter(
    (r) => r.opt_in_newsletter && r.confirmed
  ).length;
  const partnerOptIn = mkData.filter((r) => r.opt_in_partner_offers).length;
  const thirdPartyOptIn = mkData.filter((r) => r.opt_in_third_party).length;
  const thirdPartyOnConfirmed = mkData.filter(
    (r) => r.opt_in_third_party && r.opt_in_newsletter && r.confirmed
  ).length;
```
Includi i nuovi valori nel return di `loadMetrics()` e renderizzali nella UI admin con lo stesso pattern delle card esistenti, etichette: "Spiriti Guida (30gg)", "Dedica rate", "Opt-in partner (A)", "Opt-in terzi (B) — su confermati" (quest'ultima mostra `thirdPartyOnConfirmed` con `thirdPartyOptIn` tra parentesi; è il numero del gate §3.1 dello spec).

- [ ] **Step 3: Verifica statica**

Run: `npm run typecheck && npm run lint`
Expected: 0 errori.

- [ ] **Step 4: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat(admin): metriche go/no-go sprint — creazioni 30gg, dedica-rate, opt-in partner/terzi"
```

---

### Task 6: Smoke test end-to-end locale + build

**Files:**
- Create: `scripts/smoke-consent.mjs`

**Interfaces:**
- Consumes: API Task 2 (dev server locale), DDL Task 1 applicata.
- Produces: verifica automatica del percorso consenso (POST → subscribers → consent_log) con cleanup.

- [ ] **Step 1: Scrivi lo smoke script**

```js
// scripts/smoke-consent.mjs — verifica percorso consenso in locale
// Uso: node scripts/smoke-consent.mjs  (richiede `npm run dev` attivo e .env.local)
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;
if (!SB || !KEY) { console.error('manca URL o service key in .env.local'); process.exit(1); }

const email = `smoke+${Date.now()}@example.com`;
const res = await fetch('http://localhost:3000/api/spirit-guide', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'SmokeTest', giorno_nascita: 3, mese_nascita: 4, email,
    opt_in_newsletter: false, opt_in_partner_offers: true, opt_in_third_party: true,
    source: 'smoke'
  })
});
const body = await res.json();
console.log('POST /api/spirit-guide →', res.status, body);
if (!body.ok) process.exit(1);

const h = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const sub = await (await fetch(`${SB}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}&select=id,opt_in_partner_offers,opt_in_third_party`, { headers: h })).json();
console.log('subscriber:', sub);
if (!sub[0]?.opt_in_partner_offers || !sub[0]?.opt_in_third_party) { console.error('❌ flag non persistiti'); process.exit(1); }

const logs = await (await fetch(`${SB}/rest/v1/consent_log?subscriber_id=eq.${sub[0].id}&select=consent_type,consent_version`, { headers: h })).json();
console.log('consent_log:', logs);
const types = logs.map((l) => l.consent_type).sort();
const expected = ['download', 'partner_marketing', 'third_party_marketing'];
if (!expected.every((t) => types.includes(t))) { console.error('❌ consent_log incompleto'); process.exit(1); }
if (!logs.every((l) => l.consent_version === 'v2-2026-07-17')) { console.error('❌ consent_version sbagliata'); process.exit(1); }

// cleanup (cascade su consent_log e set null su spirit_guides)
await fetch(`${SB}/rest/v1/spirit_guides?subscriber_id=eq.${sub[0].id}`, { method: 'DELETE', headers: h });
await fetch(`${SB}/rest/v1/subscribers?id=eq.${sub[0].id}`, { method: 'DELETE', headers: h });
console.log('✅ SMOKE PASS (+ cleanup)');
```

- [ ] **Step 2: Esegui lo smoke**

Run: `npm run dev` (terminale separato o background), poi `node scripts/smoke-consent.mjs`
Expected: `✅ SMOKE PASS (+ cleanup)`. NOTA: il POST invia email reali via Brevo se `BREVO_API_KEY` è in `.env.local` — con `opt_in_newsletter: false` parte solo l'email Spirito Guida verso `@example.com` (dominio inesistente, innocuo; eventuale bounce singolo trascurabile).

- [ ] **Step 3: Build completa**

Run: `npm run build`
Expected: build verde, 10/10 pagine.

- [ ] **Step 4: Commit**

```bash
git add scripts/smoke-consent.mjs
git commit -m "test(consent): smoke script percorso consenso end-to-end con cleanup"
```

---

### Task 7: Gate legale + deploy

**Files:** nessuno (processo).

- [ ] **Step 1: Bozza wording → Gianmarco → legale**

Consegnare a Gianmarco il wording dei 2 checkbox (Task 3) + le 2 finalità privacy (Task 4) come **bozza unica** da far validare al suo legale. Attendere esito.

- [ ] **Step 2: Recepire le correzioni del legale**

Applicare le modifiche testuali richieste (solo stringhe in `Form.tsx`, `page.tsx`, `privacy.md`). Re-run `npm run build && npm run lint`.

- [ ] **Step 3: Push (= deploy Vercel) — conferma Gianmarco**

```bash
git push origin main
```
Expected: deploy Vercel ~1-2 min; verificare su https://indizicosmici.it che il form mostri i 2 checkbox e la privacy sia aggiornata. Poi eseguire una creazione reale di test (email `gianmarco.pandozi+consentlive@gmail.com`, entrambi i flag) e verificare i log consenso in DB.

---

## Ordine di esecuzione e dipendenze

`Task 1 (DDL, gated)` → `Task 2 (API)` → `Task 3 (Form)` → `Task 4 (Privacy)` → `Task 5 (Admin)` → `Task 6 (Smoke+Build)` → `Task 7 (Legale+Deploy, gated)`.
I Task 2-6 sono sviluppabili e committabili in locale anche prima dell'applicazione DDL, ma lo smoke (Task 6 Step 2) richiede la DDL applicata (le colonne devono esistere sul DB puntato da `.env.local`).

## Fuori scope (spec §5.2-5.4, binario operativo, non-code)

Produzione base reel 20-25s, cattura semi-manuale, ricerca Apify: gestiti come lavoro operativo con le skill reel-engine/HyperFrames — non in questo piano.
