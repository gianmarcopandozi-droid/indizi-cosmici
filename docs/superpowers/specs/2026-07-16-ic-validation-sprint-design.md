# Spec — IC Validation Sprint (30 giorni) + Motore Audience-Asset

**Data:** 2026-07-16
**Progetto:** Indizi Cosmici (primo caso del metodo *brand-factory*)
**Stato:** Design — gate Codex passato (2 round, GO CON FIX → fix applicati); pronto per review Gianmarco
**Owner:** Gianmarco

---

## 1. Perché (scopo reale)

Questo NON è "far crescere IC". È **validare il metodo brand-factory** usando IC come primo
banco di prova. Un metodo non è un metodo finché non ha prodotto **un** risultato misurato:
si testa su uno, si misura, *poi* si replica (VisitLenola, agenzia siti web, altre pagine tematiche).

**L'asset che costruiamo** = audience IG + **lista email consensata**. La monetizzazione è
**differita ma strumentata**: tutte le vie (CPL/affitto lista ai contatti brand nazionali di
Gianmarco, rivendita dell'intera pagina, libro KDP, newsletter-sponsor, YouTube) richiedono la
**stessa cosa prima** → un'audience attiva con email raccolte correttamente. Quindi non si sceglie
il modello ora: si costruisce l'asset e lo si tiene pronto ad accendere qualsiasi modello.

**Anti-scope (premortem, rischio n°1 = attenzione dispersa):** in questo sprint si tocca **solo IC**.
VisitLenola, agenzia siti web, YouTube/cartoni, altre pagine, il libro: tutti **fuori scope**,
parcheggiati nel backlog §9.

---

## 2. Cosa viene VALIDATO (playbook astratto, non "Animale Guida")

Il deliverable dello sprint non è "IC ha funzionato": è un **playbook replicabile**. Al GO, ciò che
si porta su VisitLenola/agenzia è la *procedura astratta*, non i contenuti di IC:

**Trasferibile (il metodo):** (1) ricerca nicchia con dati → (2) ipotesi di formato + barra di qualità
audio/visiva → (3) ciclo "una base forte → varianti finché una buca" → (4) funnel di cattura con
consenso corretto → (5) metrica go/no-go → (6) automazione della replica post-vincitore.

**NON trasferibile (specifico di IC):** il tema astrologia, la meccanica "segno→animale", i mantra,
gli asset animali. VisitLenola è local/place-based: stessa *procedura*, contenuti e funnel diversi.
→ Al giorno 30 lo sprint deve produrre anche un **1-pager "playbook v1"** che astrae i 6 passi sopra.

---

## 3. Criterio di "fatto" (go/no-go a 30 giorni)

Successo NON = follower (vanity). Le soglie NON sono definitive: si **congelano al checkpoint giorno 7**
(§4) su dati reali cold-start, poi non si toccano più.

### 3.1 — Gate HARD: l'asset lista deve esistere
GO è **impossibile** senza un minimo di lista consensata (altrimenti si valida una vanity page senza
asset monetizzabile). Soglia lista minima proposta (correzione gate round 2 — condizione annidata, non
conteggi separati): **≥40 subscribers con `opt_in_newsletter=true AND confirmed=true`, DI CUI ≥10 anche
`opt_in_third_party=true`**. Così i 10 "terzi" sono per forza email confermate/raggiungibili.
Sotto questo → mai GO. *(Se Gianmarco sceglie Scenario A — solo offerte partner inviate da IC — la
metrica "terzi" va rinominata coerentemente; se Scenario B, resta consenso-cessione-terzi.)*

### 3.2 — Poi: 2 su 3 dei segnali di formato

| Segnale | Soglia proposta (calibrare al gg7) | Query di misura |
|---|---|---|
| **Breakout** | ≥1 reel oltre ~10k views | metrica IG/Buffer (manuale nello sprint) |
| **Creazioni Spirito Guida** | ≥ 50 in 30 giorni | `count(*) from spirit_guides where created_at in range` |
| **% dedica/share** | ≥ 15% | `count(dedicato_a is not null) / count(*) from spirit_guides` |

Email consensate (gate §3.1): `subscribers` con `opt_in_newsletter=true AND confirmed=true`;
terzi = `opt_in_third_party=true`.

### 3.3 — Decisione al giorno 30
- **Gate lista PASSA + ≥2/3 segnali sopra soglia** → **GO**: si automatizza la replica, si scrive
  il "playbook v1" (§2) e si porta il metodo su VisitLenola.
- **Gate lista PASSA + 1/3** → **ITERA**: si cambia formato/hook per altri 15 giorni.
- **Gate lista FALLISCE** oppure **0/3 segnali** → **KILL consapevole** (decisione, non abbandono per
  inerzia = la morte n°1 della premortem).

> **Nota metriche:** oggi l'admin (`app/admin/page.tsx`) traccia lead/opt-in/confermati/share-click,
> ma **non** creazioni, dedica-rate, email-terzi. Serve aggiungere queste query (task in §5.1).

---

## 4. Checkpoint giorno 7 (tara le soglie su dati reali)

Prima del gg30, al **giorno 7** si registra una baseline: n° reel pubblicati, views mediane,
CTR link-in-bio, tasso conversione form (visita→creazione), opt-in rate newsletter, opt-in rate terzi.
Le soglie del §3 si **congelano** dopo questo checkpoint — non "a sentimento". Se la baseline mostra
che ~10k views è irraggiungibile, si abbassa il breakout a un multiplo della reach mediana (es. 10×).

---

## 5. Componenti

Quattro unità indipendenti, ognuna con un confine chiaro.

### 5.1 — Consenso granulare + strumentazione metriche (unico blocco CODE, da fare SUBITO)

**Perché ORA e non dopo:** consenso newsletter (marketing proprio) e consenso terzi sono **basi
giuridiche diverse (GDPR)** e **non retroattive**: ogni email raccolta senza il consenso specifico
è **inutilizzabile** per CPL/affitto lista — il modello più naturale dato il network di Gianmarco.

**5.1.a — Due scenari di consenso, distinti (correzione gate round 1):**
- **Scenario A — offerte partner inviate DA IC** (IC resta titolare, invia lei le offerte): consenso
  marketing "partner" più leggero.
- **Scenario B — cessione/affitto a terzi autonomi** (il terzo diventa titolare): richiede consenso
  **specifico, informato, granulare, dimostrabile e revocabile** (EDPB Guidelines 05/2020) → testo
  dedicato, categorie/identità dei partner quando note, informativa aggiornata, meccanismo di revoca.
- **Decisione Gianmarco: ENTRAMBI (A + B).** Essendo finalità GDPR diverse, servono **2 consensi
  granulari** (o 1 checkbox con informativa che copre esplicitamente entrambe le finalità: offerte
  inviate da IC *e* condivisione con partner terzi autonomi). Il gate-lista §3.1 conta il consenso terzi.
- **Come produciamo il wording (decisione Gianmarco):** (1) **web research prima** (WebSearch/WebFetch
  su best-practice GDPR consenso marketing-terzi + affitto lista/CPL, esempi di consensi granulari,
  contesto IT/UE); (2) **Apify solo** per info che il web normale non estrae; (3) **draft bozza**;
  (4) **validazione da un legale PRIMA del deploy** (Gianmarco). Claude produce solo bozza documentata
  dalle fonti — NON è consulenza legale; il gate finale è il legale.

**5.1.b — Lista file/code da toccare (non "campo + payload"):**
- `components/Form.tsx` — nuovo checkbox opzionale (non pre-spuntato, non obbligatorio).
- `app/api/spirit-guide/route.ts` — `BodySchema` (+`opt_in_third_party: boolean`), payload subscribers,
  insert `consent_log` con nuovo `consent_type`.
- `supabase/migrations/*` — **DDL**: colonna `subscribers.opt_in_third_party boolean default false`
  + **aggiornare la check constraint** di `consent_log.consent_type` (oggi `download|newsletter`) per
  ammettere `third_party_marketing`.
- `app/privacy/page.tsx` + `content/privacy.md` — **fix: la policy cita Resend ma il codice usa Brevo**
  (`lib/email/index.ts` prio Brevo→Resend→devmode); aggiornare provider, trasferimenti, finalità
  marketing partner; **bump `CONSENT_VERSION`** coerente.
- `app/admin/page.tsx` — aggiungere metriche §3 (creazioni, dedica-rate, opt-in terzi).
- Smoke test del percorso consenso.

**5.1.c — Log consenso BLOCCANTE (correzione gate round 1):** oggi se `consent_log` fallisce la route
continua e crea comunque lo spirit guide (`route.ts` ~L126). Per un asset monetizzabile, un lead senza
prova di consenso è debito legale. → Per i consensi **marketing (newsletter e terzi)** il fallimento del
log deve **bloccare** l'iscrizione (o marcare il lead come non-utilizzabile). Il download dello Spirito
Guida può restare non-bloccante.

**5.1.d — Atomicità (correzione gate round 2):** oggi l'`upsert subscribers` avviene *prima* di
`consent_log` (`route.ts` ~L89), quindi un log fallito lascerebbe un subscriber senza prova di consenso.
Implementare in modo atomico: via **RPC/transaction Supabase**, oppure con **compensating update**
immediato (`opt_in_newsletter=false`, `opt_in_third_party=false`, eventuale flag `unusable`) se
`consent_log` fallisce dopo l'upsert. (Da dettagliare nel piano esecutivo, non tutto ora.)

**Confine:** funnel + schema + privacy. Nessun impatto su wallpaper/email (già corretti).
**Dipendenze:** DDL su Supabase IC → **conferma esplicita di Gianmarco prima di eseguire**. Validazione
legale del wording prima del deploy.

### 5.2 — Ricerca di mercato + ipotesi di formato (Fase 0, PRIMA di produrre)

- **Apify** (token in `~/.env.videogioco`, per memory `feedback_apify_first_scraping`), **due layer di
  scrape (decisione Gianmarco):**
  - **Layer 1 — meccaniche virali universali:** scrape nicchie ad **altissimo volume** (food/ricette,
    ecc.) dove c'è massa di dati → dedurre cosa *davvero* funziona a prescindere dal tema (pattern di
    hook, pacing/ritmo, device di retention nei primi 3s, durata, tipo audio, struttura CTA).
  - **Layer 2 — pattern di nicchia:** scrape competitor astrologia/spiritualità per adattamento tematico.
  - Reverse-engineering → JSON con engagement. *Seed (hashtag/account) e tetto budget: da fissare nel
    piano esecutivo (§8).*
- **Skill curate** come framework: `scriptwriting-methodology` (hook/PAS/AIDA/CTA) + `marketing-skills`.
- Output: 1–2 **ipotesi di formato** con struttura esplicita.

**Ipotesi di partenza (confermata con Gianmarco):** serie **"Animale Guida"** con meccanica
*"taggati se sei {segno}"* → i commenti/tag sono il segnale che l'algoritmo premia (0 commenti sul reel
di lancio). **Costo Apify** a consumo → tetto budget da fissare (§8).

### 5.3 — Motore contenuti: qualità-prima, una base + varianti

**Principio (deciso da Gianmarco):** NON 10 reel diversi. **Una base eccellente**, poi ripubblicata con
**varianti** (hook-testo / musica / effetti) per spremere reach su audience nuove — leva di **pura
crescita**, non serve un prodotto da vendere.

**Barra di qualità (il "lavorone" richiesto da Gianmarco):**
- **Audio fluido:** ElevenLabs (voce Lily per IC, memory `reference_elevenlabs_voices_ic`) + musica su
  griglia beat (Epidemic Sound, memory `feedback_social_publishing_audio_stack`), cut sul beat
  (memory `feedback_music_reel_beatsync`).
- **Effetti grafici/visivi:** HyperFrames per overlay/animazioni + motore reel esistente
  (`_motore-reel`, memory `reference_reel_engine`).
- Ciclo: produci **1 base**, itera hook/primi-3s/CTA su poche varianti finché **una buca**.

**Realismo tempi (correzione gate round 1):** una "base eccellente" con questo stack richiede tempo
reale non banale → nel piano esecutivo va stimato il costo-tempo per base, per non far saltare la
cadenza (rischio premortem n°1). **Cadenza:** poche uscite curate/settimana, NON 1/giorno di mediocre.
**Dipendenze:** ElevenLabs, HyperFrames, Epidemic, motore-reel.

### 5.4 — Distribuzione + cattura

**Regola:** non si automatizza la creatività. Si automatizzano cadenza, pubblicazione, cattura, nurture.

**Fase 1 — cattura SEMI-manuale già attiva (correzione gate round 1):** parte della validazione è
contenuto→funnel; senza cattura si testa un funnel più debole. Da subito, senza automazione:
- **Primo commento fissato:** *"Il tuo segno? Scrivilo qui sotto 👇 ✦"* (a mano — Buffer non supporta
  firstComment; automazione IG fragile, cfr. tentativo fallito con emoji duplicate).
- **Link-in-bio con UTM/source** per attribuire le creazioni al contenuto.
- **Risposta manuale** ai commenti col link.

**Fase 2 — automazione SOLO dopo un vincitore:** Buffer (già attivo) per scheduling; ManyChat
(commento→DM col link); valutare n8n per batch. Automatizzare il mediocre = scalare il mediocre.

**Dipendenze:** Buffer; poi ManyChat/n8n. **Vincoli piattaforma:** regole IG/ManyChat su automazione DM.

---

## 6. Flusso (fasi)

```
Fase 0 (dati)   : Apify market research + skill → ipotesi formato            [§5.2]
Fase 1 (qualità): consenso granulare live [§5.1] + cattura semi-manuale [§5.4] +
                  produci 1 base eccellente, itera varianti finché una buca  [§5.3]
Giorno 7        : checkpoint baseline → congela soglie go/no-go              [§4]
Fase 2 (scala)  : replica vincitore (12 segni + winner-reposting) + automazione [§5.4]
Giorno 30       : valuta go/no-go [§3] → GO = scrivi playbook v1 [§2] + VisitLenola
```

---

## 7. Rischi (premortem + operativi da gate round 1) e mitigazioni

| Rischio | Mitigazione |
|---|---|
| n°1 Attenzione dispersa | Scope = solo IC; resto in backlog §9; sprint time-boxed; stima costo-tempo/base |
| n°2 Distribuzione one-shot | Cadenza + winner-reposting + soglia go/no-go che forza decisione |
| n°3 Nessun ritorno | Lista consensata + (differito) newsletter settimanale |
| n°4 Loop dedica non gira | Dedica-rate tracciata (query §3); cattura semi-manuale già in Fase 1 |
| n°5 Scopo/monetizzazione vago | Asset = lista; consenso-terzi instrumentato e **bloccante** ora |
| **Op: spam/abuso form** | Il form non ha rate-limit visibile (`route.ts` invia email per submit) → aggiungere rate-limit/CAPTCHA leggero se abuso |
| **Op: deliverability** | Monitorare bounce Brevo; consenso pulito protegge la reputazione appena recuperata |
| **Op: costi tool** | Tetto budget Apify + tool (ElevenLabs/HyperFrames/Epidemic già pagati) |
| **Op: minori** | Wording "audience adulta" / policy minori nel funnel |

---

## 8. Domande aperte (da chiudere prima di implementare)

1. **Soglie go/no-go** (§3): ✅ numeri accettati da Gianmarco → si congelano/ritarano al checkpoint gg7.
2. **Scenario di consenso** (§5.1.a): ✅ **entrambi (A+B)** → resta da produrre wording + informativa e
   **validarli legalmente** prima del deploy.
3. **Seed/budget Apify** (§5.2): ✅ strategia decisa (2 layer: alto-volume + astrologia) → restano da
   fissare hashtag/account seed e tetto budget **nel piano esecutivo**.
4. **Approvazione DDL** su Supabase IC (§5.1.b): ✅ ok di massima → conferma puntuale al momento dell'esecuzione.

---

## 9. Backlog differito (registrato, NON in questo sprint)

- **VisitLenola**: sito "figo" secondo ispirazioni (progetto 2, a metodo validato).
- **Agenzia siti web per imprese** (progetto 3).
- **Monetizzazione IC**: libro KDP, CPL/affitto lista ai contatti brand, rivendita pagina, YouTube
  (IC vs cartoni bimbi — fork da decidere), newsletter-sponsor.
- **Fix email opzionale**: anteprima inline wallpaper via CID invece del mirror Brevo (se ricapita
  "immagine rotta").

---

## 10. Prossimo passo

Gate Codex round 2 → applica fix residui → review Gianmarco → `writing-plans` per il piano esecutivo
della Fase 0/1.
