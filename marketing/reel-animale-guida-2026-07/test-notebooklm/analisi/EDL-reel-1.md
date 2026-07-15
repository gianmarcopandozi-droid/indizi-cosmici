# EDL — Reel 1 "Come Creare il Tuo Spirito Guida" (NotebookLM Short, 68s)

Tecnica: scene detection ffmpeg (hard-cut) + trascrizione Whisper verbose_json (timestamp per frase)
+ frame full-res al centro di ogni segmento vocale, letti con visione alta risoluzione.

## Struttura macro (hard-cut a 3.3s / 11.2s / 65.8s)
- ATTO 1 (0:00-0:11) — acquerello dipinto a mano, 2 scene
- ATTO 2 (0:11-1:06) — mockup UI "carta" su sfondo crema, costruzione progressiva della card
- OUTRO (1:06-1:08) — chiusura

## Scene-by-scene

| # | Timing | Visual | Voce | Caption bruciata |
|---|--------|--------|------|------------------|
| 1 | 0.0-3.5 | Acquerello: occhi con stelle nelle pupille sopra un telefono impugnato che illumina il volto | "Cos'è esattamente lo spirito guida di indizi cosmici?" | — |
| 2 | 4.0-10.8 | Acquerello: mani a coppa che reggono una sfera di luce dorata su cerchio notturno | "In un mondo costantemente distratto, un gesto intimo e reale di attenzione vale molto più di una finta magia." | "una finta magia." |
| 3 | 11.6-17.5 | Foglio crema puntinato: compare titolo "Dedica a un amico", campo "Nome: Marco" in dissolvenza | "Mettiamo che tu voglia dedicare un pensiero davvero speciale a un amico, diciamo Marco, dell'Ariete." | "dell'Ariete." |
| 4 | 18.3-25.5 | Card blu notte vuota (bordo arrotondato) al centro del foglio | "La creazione inizia da un semplice ma suggestivo cielo notturno, illuminato solamente da una piccola stella dorata che brilla." | "solamente da una" |
| 5 | 25.7-29.6 | Card + cerchio oliva con stella dorata + "Marco" bianco, "Ariete" in fade-in | "Poi compare il suo nome, affiancato al suo segno zodiacale." | "segno zodiacale." |
| 6 | 30.0-35.4 | Etichetta "Grafica Decorativa" sopra la card completa di nome+segno | "Fin qui però hai tra le mani soltanto una bella grafica decorativa, ma ecco l'elemento chiave..." | "grafica decorativa." |
| 7 | 35.4-38.0 | Card con 3 righe bianche (placeholder frase) sotto il nome | "...l'aggiunta di una frase scelta." | "frase scelta." |
| 8 | 38.7-43.9 | Etichetta cambia in "Spirito Guida" (pill dorata), righe frase diventano DORATE | "È questo testo profondamente emotivo a trasformare l'immagine nel vero spirito guida." | "Spirito Guida." |
| 9 | 44.6-49.5 | Card rimpicciolita dentro sagoma telefono, transizione "volo" | "In pochi secondi l'immagine è completa, si salva gratis e vola direttamente su WhatsApp." | "su WhatsApp." |
| 10 | 50.1-54.2 | Card piccola + claim tipografico grande "Non è magia. È attenzione." | "...incarnando il suo motto perfetto, non è magia, è attenzione." | "è attenzione." |
| 11 | 54.9-59.7 | Card sola su foglio, respiro visivo | "Marco riceve così questo piccolo e intimo segno luminoso sul suo telefono, un messaggio..." | "sul suo telefono." |
| 12 | 59.7-64.6 | CTA finale: "Per chi lo creeresti?" + bottone dorato "Crea il tuo Spirito Guida" | "...personale da portare sempre con sé, e tu, per chi lo creeresti per primo?" | — |

## Cosa rivela l'EDL (che il filmstrip non vedeva)
1. Il video ha CAPTION BRUCIATE sincronizzate con la voce (stile handwritten) — sottotitoli nativi, buona accessibilità.
2. La struttura è da direct-response corretta: hook domanda (3s) → problema/valore (7s) → demo progressiva del prodotto (44s) → claim (4s) → CTA con bottone (5s). Il PROBLEMA non è la struttura, è: hook debole (domanda informativa, non emotiva), demo su prodotto FINTO (card inventata ≠ Spirito Guida reale), ritmo piatto (44s di demo = troppo).
3. Il claim "Non è magia. È attenzione." è renderizzato come typography card a 50s — riutilizzabile come frame statico.
4. Voce: femminile ITA naturale, dizione pulita, zero accento — la traccia ha musica sotto ma il TIMING della voce (15 segmenti con timestamp) è estraibile per rimontare su visual nostri.

## Limiti superati rispetto alla tecnica precedente
- Filmstrip a intervalli fissi → frame agganciati ai SEGMENTI VOCALI (audio-video allineati)
- Tile 270px illeggibili → frame full-res (testo su schermo leggibile, OCR implicito)
- Scene detection sola falliva (3 hard-cut su 12 scene: transizioni morbide) → ibrido audio-driven
- Trascrizione piatta → verbose_json con timestamp per frase
