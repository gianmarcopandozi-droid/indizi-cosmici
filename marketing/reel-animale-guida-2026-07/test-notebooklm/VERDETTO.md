# Test NotebookLM → Reel IC — VERDETTO (15 Luglio 2026)

Gate Codex: STOP pipeline / GO condizionato reel 2 (doppio giro, 2° round GO).

## Verdetto pipeline: STOP
Criterio gated: 3 reel pubblicabili nel timebox di 1 pomeriggio. Risultato: 1 su 3.
La pipeline NotebookLM→reel NON è validata come formato da adottare. Niente altre
generazioni/ottimizzazioni.

## I 3 reel
| Reel | Titolo | Verdetto | Motivo |
|------|--------|----------|--------|
| 1 | Come Creare il Tuo Spirito Guida (68s) | SCARTATO | Card blu inventata ≠ prodotto reale; hook informativo; demo 65% runtime |
| 2 | Un Cielo Notturno Su WhatsApp (57s) | CANDIDATO ESPERIMENTO | Fotorealistico, hook in medias res, niente UI finta, script emotivo forte |
| 3 | Come Creare... v2 (64s) | SCRIPT-DONOR | Script eccellente (pattern interrupt) ma mockup sito inventato |

## Reel 2 — condizioni per l'eventuale pubblicazione (decisione di Gianmarco)
- Solo come TEST ORGANICO/learning post, MAI asset brand-grade, paid, pinned o campagna
- Watermark NotebookLM presente in basso a destra: comunica "tool/prototipo" — da accettare esplicitamente
- File pronto: video/IC-reel-2-cielo-notturno-IG-READY.mp4 (1080×1920, faststart, decode verificato)
- Se pubblicato: misurare retention/salvataggi/DM

## Learning
1. NotebookLM Short = voce ITA e script forti (gratis, ~15 min/reel, generazione parallela).
   I visual sono affidabili SOLO se il focus prompt evita qualsiasi UI/prodotto: l'angolo
   emotivo-scenico (reel 2) produce fotorealismo senza travisare il prodotto; gli angoli
   "come si crea" spingono il modello a inventare interfacce false (reel 1 e 3).
2. Tecnica EDL audio-driven per spacchettare video: Whisper verbose_json (timestamp per frase)
   + frame full-res al centro di ogni segmento vocale. La scene detection da sola fallisce
   sulle transizioni morbide (3 hard-cut su 12 scene nel reel 1).
3. Rubrica valutazione reel (da prompts.chat "Cinematic Video Essay Director" + "YouTube Script
   Engine"): hook 5s visivo, arco % capitoli, curiosity loop, pattern interrupt, momento Aha,
   CTA allineata, prodotto reale.

## Ricetta remake (WATCHLIST — non aprire senza decisione esplicita)
Script del reel 3 (con pattern interrupt) + screen recording REALE di indizicosmici.it
mentre si crea uno Spirito Guida + voce NotebookLM o TTS → montaggio reel-engine/HyperFrames.
