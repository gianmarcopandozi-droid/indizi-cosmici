# ASSET INTEGRATION — Indizi Cosmici

Guida operativa per integrare gli **asset visual master** generati con ChatGPT (o altro generatore immagini) nel progetto Indizi Cosmici. Il codice è già predisposto: basta posizionare i file con i nomi giusti nelle cartelle corrette, e tutto si attiva.

---

## 1. Cartelle target

Tutte le cartelle vivono sotto `public/assets/`. Sono già create e versionate (con placeholder dove serve).

### `public/assets/backgrounds/`
Sfondi cinematic usati come base sia per la Landing Page sia per i wallpaper generati a runtime.

| Filename | Dimensione | Uso |
|---|---|---|
| `notte-base.jpg` | 1920×1080 | bg orizzontale LP desktop |
| `notte-base-mobile.jpg` | 1080×1920 | bg verticale LP mobile + wallpaper template |
| `notte-cinematic.jpg` | 1920×1080 | variante più "cinematic" per hero LP (opzionale) |
| `notte-cinematic-mobile.jpg` | 1080×1920 | variante mobile della cinematic |
| `notte-orizzonte-rosa.jpg` | 1080×1920 | wallpaper template alternativo, con orizzonte rosa caldo |

**Formato**: `.jpg` 85% quality (peso target < 350 KB ciascuno). PNG ammesso solo se serve trasparenza (non dovrebbe per sfondi).

### `public/assets/glifi/`
12 file SVG dei glifi zodiacali, uno per segno.

| Filename |
|---|
| `ariete.svg`, `toro.svg`, `gemelli.svg`, `cancro.svg`, `leone.svg`, `vergine.svg`, `bilancia.svg`, `scorpione.svg`, `sagittario.svg`, `capricorno.svg`, `acquario.svg`, `pesci.svg` |

**Specifiche SVG**:
- ViewBox `0 0 200 200`
- Sfondo trasparente
- Color stroke: **oro caldo `#D7A86E`**
- Stroke-width: tra 4 e 6 (uniformi tra i 12 glifi)
- Stroke-linecap: `round`
- No fill (solo stroke)
- Peso ≤ 4 KB ciascuno

### `public/assets/textures/`
Texture di overlay applicate sopra gli sfondi per dare profondità.

| Filename | Dimensione | Uso |
|---|---|---|
| `grain.png` | 1080×1920 | overlay rumore cinematic, mode `overlay` o `multiply` a 8-12% opacity |
| `stelle-overlay.png` | 1080×1920 | campo stelle trasparente, mode `screen` a 60-80% opacity |

**Formato**: PNG-24 con alpha trasparente. Peso target < 200 KB.

### `public/assets/quote-backgrounds/`
Sfondi specifici per le 4 quote cards (file `content/30-giorni/quote-cards/*.md`).

| Filename | Dimensione | Quote |
|---|---|---|
| `quote-1.jpg` | 1080×1080 | "A volte l'universo ci invia un piccolo segno." |
| `quote-2.jpg` | 1080×1080 | "Non è magia. È attenzione. È ascolto." |
| `quote-3.jpg` | 1080×1080 | "Crea il tuo Spirito Guida e portalo con te." |
| `quote-4.jpg` | 1080×1080 | "O dedicato a chi ami. Un pensiero che resta." |

Pubblicheremo le quote card direttamente su IG: gli sfondi quote-backgrounds **non sono usati a runtime** dal codice, ma servono come asset finale per il publishing manuale (Figma/Canva → IG).

---

## 2. Specifiche stilistiche

### Palette esatta (da rispettare)

| Token | HEX | Uso |
|---|---|---|
| `notte-profonda` | `#18122B` | bg primario, top wallpaper |
| `viola-caldo` | `#2A1E4A` | bg secondario, transizione |
| `magenta-cosmico` | `#5D2C5A` | orizzonte caldo, accenti paesaggio |
| `oro-caldo` | `#D7A86E` | glifi, costellazioni, CTA, linee |
| `rosa-polvere` | `#F1D8C9` | testo secondario, glow ai bordi |
| `panna-stellare` | `#FFF6E8` | testo primario, stelle bianche |

### Mood (rispettare rigorosamente)
- **Sì**: cinematic, caldo, poetico, contemplativo, notturno, elegante, laico
- **No**: gotico, tarocco, witch, fantasy AI evidente, ali angeliche, santi cattolici, simboli esoterici aggressivi, occhi che osservano, mani con runa, smoke effetto Photoshop, illustrazioni stile *Vogue Italia* anni '70

### Riferimenti visivi
- Vedere il piano in `/Users/gianmarcopandozi/.claude/plans/leggi-claude-md-contensto-typed-toast.md` sezione "Direzione & Brand"
- Mood board: **"Notte Mistica Calda"** approvato dall'utente
- Ispirazione: paesaggi notturni desertici/montani al crepuscolo, cieli stellati con orizzonte rosa caldo, fotografia astronomica + post-processing pittorico

---

## 3. Come integrare

### Modo 1 — Drop-in (consigliato per V1)
1. Genera gli asset con ChatGPT/Midjourney/altro
2. Rinomina i file rispettando esattamente i nomi della sezione 1
3. Trascinali nelle cartelle target sotto `public/assets/`
4. Verifica che siano tracciati da git: `git status`
5. Commit + push
6. Su Vercel: il deploy automatico rifletterà subito i nuovi asset
7. `lib/assets.ts` espone i fetcher (`getBackground()`, `getGlifo(segno)`, `getTexture(name)`) che li trovano automaticamente senza modifiche al codice

**Nessuna modifica al codice è richiesta** se mantieni i filename esatti.

### Modo 2 — Sostituire un singolo asset senza redeploy (post-V1)
Funzionalità non prioritaria V1. Quando servirà, possiamo configurare Supabase Storage `assets` come fonte secondaria — `lib/assets.ts` sceglierebbe runtime tra bucket storage e cartella statica `public/`. Da implementare solo se cambieremo asset frequentemente (es. stagionalità).

### Modo 3 — Aggiungere nuovi asset
Se vuoi aggiungere asset oltre quelli previsti:
1. Aggiungi il file in una delle cartelle (`backgrounds/`, `glifi/`, `textures/`, `quote-backgrounds/`)
2. Estendi `lib/assets.ts` con un nuovo helper, esempio:
   ```ts
   export function getBackground(name: 'notte-base' | 'notte-cinematic' | 'orizzonte-rosa') {
     return `/assets/backgrounds/${name}-mobile.jpg`
   }
   ```
3. Usa il nuovo helper nei componenti dove serve (es. `SpiritGuideCard.tsx`, `app/page.tsx`)
4. `npm run build` per verificare typecheck

---

## 4. Checklist post-integrazione

Da eseguire dopo ogni drop di nuovi asset:

- [ ] `npm run build` — build verde, no errori TypeScript
- [ ] `npm run lint` — ESLint pulito (warning ok, errori no)
- [ ] **LP visiva**: apri `http://localhost:3000` → verifica che gli sfondi nuovi appaiano correttamente su hero + sezioni
- [ ] **Wallpaper renderizzato**: apri `http://localhost:3000/wallpaper/test-share-id` (o un `shareId` reale) → verifica che il PNG 1080×1920 si generi e includa sfondo + glifo + costellazione + nome + mantra
- [ ] **OG card**: apri `http://localhost:3000/og/test-share-id` → verifica che la card 1200×630 sia generata correttamente
- [ ] **Test mobile**: chrome devtools 375×812 → no overflow, CTA tappabili, immagini caricate
- [ ] **Peso totale**: `du -sh public/assets/` → idealmente < 5 MB totali per non rallentare il primo caricamento
- [ ] **Coerenza palette**: a colpo d'occhio i nuovi sfondi e i glifi devono parlare la stessa lingua cromatica dei placeholder
- [ ] Push su git: `git add public/assets/ && git commit -m "assets: integra asset master ChatGPT" && git push`
- [ ] Verifica deploy Vercel completato, apri `https://indizicosmici.it` (o URL vercel) e ricontrolla

---

## 5. Prompt utili per ChatGPT (copia-incolla diretto)

> Suggerimento operativo: per i 12 glifi conviene un singolo prompt che produce un set coerente. Per gli sfondi, prompt separati per ogni variante.

### 5.1 Prompt per generare i 12 glifi SVG

```
Genera 12 immagini SVG dei glifi zodiacali, una per segno (Ariete, Toro, Gemelli, Cancro, Leone, Vergine, Bilancia, Scorpione, Sagittario, Capricorno, Acquario, Pesci).

Specifiche obbligatorie per OGNI glifo:
- viewBox: 0 0 200 200
- Sfondo trasparente
- Solo stroke, NO fill
- Colore stroke: #D7A86E (oro caldo)
- Stroke-width: 5
- Stroke-linecap: round
- Stroke-linejoin: round
- Stile: linee continue eleganti, ispirate ai glifi astronomici classici (NON ornamentali, NON art-nouveau)
- Coerenza visiva tra i 12: stessa weight, stessa "qualità del tratto"
- Niente decorazioni aggiuntive (no stelle, no cornici, no testo)

Output: 12 file SVG separati con nomi:
ariete.svg, toro.svg, gemelli.svg, cancro.svg, leone.svg, vergine.svg, bilancia.svg, scorpione.svg, sagittario.svg, capricorno.svg, acquario.svg, pesci.svg

Riferimento simbolico:
♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓

Mostrami prima un'anteprima visiva di tutti e 12 disposti in grid 4x3 per verificare coerenza, poi consegna gli SVG individuali.
```

### 5.2 Prompt per generare gli sfondi cinematic

```
Genera un'immagine 1080×1920 verticale (formato wallpaper smartphone) per il brand "Indizi Cosmici".

Soggetto: paesaggio notturno cinematic, contemplativo. Cielo stellato fitto in alto. Orizzonte basso (1/4 inferiore) con bagliore caldo magenta-rosa che simula un crepuscolo cosmico. Niente persone, niente oggetti riconoscibili in primo piano — solo cielo e una linea d'orizzonte morbida (può essere mare, deserto, o montagne distanti molto sfumate).

Palette obbligatoria:
- Cielo alto: #18122B (notte profonda)
- Cielo medio: #2A1E4A (viola caldo)
- Orizzonte: #5D2C5A (magenta cosmico)
- Stelle: #FFF6E8 (panna calda, NON bianco freddo)
- Glow caldo bordo orizzonte: #F1D8C9 (rosa polvere) molto sottile

Mood: cinematic, caldo, poetico, contemplativo, ELEGANTE. Stile fotografia astronomica + post-processing pittorico.

NON includere:
- Stile gotico, tarocco, witch
- Volti, occhi, mani, simboli esoterici
- Fantasy AI evidente (es. comete giganti, draghi, castelli)
- Saturazioni aggressive, contrast HDR
- Watermark, testo

Output: file .jpg 1080×1920, quality 85, ≤ 350 KB.

Genera 3 varianti:
1. notte-base-mobile.jpg — versione bilanciata, neutra
2. notte-cinematic-mobile.jpg — versione più drammatica, più stelle, più contrast
3. notte-orizzonte-rosa.jpg — variante con orizzonte rosa più ampio e cielo più viola
```

### 5.3 Prompt per generare le 4 quote backgrounds

```
Genera 4 sfondi 1080×1080 quadrati per quote cards Instagram del brand "Indizi Cosmici".

Tutti e 4 devono:
- Avere una zona centrale "calma" (spazio dove sovrapporrò testo elegante in tipografia Cormorant Garamond italic)
- Avere la palette obbligatoria: #18122B / #2A1E4A / #5D2C5A / #D7A86E / #F1D8C9 / #FFF6E8
- Essere coerenti tra loro come "famiglia visiva"
- Avere stelle delicate (non un cielo invadente)
- Essere cinematic, NON gotici, NON tarocco

Variante 1 — "quote-1.jpg":
gradient notte-profonda → viola-caldo verticale, 14 stelle distribuite naturalmente, una stella più luminosa in alto a destra.

Variante 2 — "quote-2.jpg":
gradient viola-caldo → magenta-cosmico orizzontale, vignettatura ai bordi 15%, 10 stelle solo in alto.

Variante 3 — "quote-3.jpg":
gradient magenta-cosmico → notte-profonda diagonale, glow oro caldo al centro 20%, 12 stelle.

Variante 4 — "quote-4.jpg":
gradient notte-profonda → viola-caldo verticale, orizzonte basso con accenno rosa polvere (1/5 inferiore), 16 stelle, micro-costellazione (4-5 punti collegati da linea oro sottile) in alto a destra.

Output: 4 file .jpg 1080×1080, quality 85, ≤ 300 KB ciascuno. Niente testo, niente loghi — il testo lo aggiungo dopo.
```

### 5.4 Prompt per generare textures

```
Genera 2 textures PNG con alpha trasparente, 1080×1920 verticali:

1. "grain.png" — texture di rumore cinematic monochromatic, intensità media. Da applicare in mode overlay/multiply a 8-12% opacity sopra gli sfondi. Solo grana, no pattern visibili. Sfondo trasparente.

2. "stelle-overlay.png" — campo stelle sparse, 40-60 stelle di dimensioni miste (1-5px), colore #FFF6E8 (panna), opacità variabile 20-100%. Distribuzione naturale (non a griglia). Sfondo completamente trasparente. Da applicare in mode screen sopra gli sfondi.

Output: 2 PNG-24 con alpha, ≤ 200 KB ciascuno.
```

---

## 6. Note finali

- **Se gli asset non arrivano prima del deploy V1**, il codice gira lo stesso con i placeholder procedurali (gradient + stelle SVG procedurali + glifi Unicode `♈♉♊...`). Il prodotto è già usabile.
- **Sostituzione asset = zero codice toccato.** È questo il motivo per cui `lib/assets.ts` esiste come layer di astrazione.
- Se per qualche motivo i nomi file generati da ChatGPT non corrispondono, **rinomina i file prima del drop** — non modificare `lib/assets.ts`. È più sicuro.
- Per problemi di rendering Satori con gli asset (es. PNG troppo pesanti, SVG con feature non supportate): fare fallback al renderer `sharp` come documentato nel piano principale. I 12 glifi SVG, se semplici (solo stroke), funzionano in Satori; se complessi (con filtri, gradients SVG, mask), Satori può ignorarli → usare `sharp`.
- **Test obbligatorio post-drop**: il wallpaper renderizzato a runtime DEVE includere correttamente il glifo del segno scelto. Se il glifo non appare, controllare la console del server Next.js per errori Satori e considerare lo switch a `sharp`.
