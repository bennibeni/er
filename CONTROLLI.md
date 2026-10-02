# Revisione del codice ER

## Correzioni completate

- Nome ER e favicon 🫀; vecchio nome rimosso dai sorgenti e dai manifest.
- Unico calcolo sistemico condiviso da grafo, sidebar, ECG e controlli.
- Benefici delle cure limitati alle condizioni idonee; penalità applicate dopo
  il limite superiore del beneficio. Trasfusione non indicata: BPC 75, non 100.
- Corrette tachicardia nello scenario emorragia e associazione automatica
  infarto/fibrillazione. Le soglie restano convenzioni documentate in MODELLO.md.
- Dettagli locali dinamici qualitativi, con indicazioni specifiche per embolia,
  trombolisi e infarto. Separati riferimenti anatomici e stato simulato.
- ECG, lampeggio e suono condividono una timeline temporale indipendente dai frame.
- Audio esplicito e silenziabile, allarme di arresto e pulizia delle risorse;
  nessun recupero in sequenza dei battiti persi in background.
- Riposo automatico con emorragia/infarto, rimozione/ripristino degli elementi
  amputati, conservazione della posizione dei nodi, protezione dal tasto Canc.
- Cure disabilitate durante l’arresto, stato premuto accessibile, avvisi cumulativi.

## Verifiche ripetibili

- ESLint e build Next.js di produzione.
- Suite Playwright: quattro test browser, quattro test mirati dello stato
  sistemico e cinque test su combinazioni, dettagli locali, timing e risorse audio.
- Tutte le 512 combinazioni dei quattro scenari, quattro cure e riposo/sforzo:
  limiti degli indici, coerenza dell’arresto, effetti avversi e dettagli locali.
- Timeline verificata a 30, 60 e 144 fps e con diversi BPM.
- Web Audio verificato nel browser per frequenza a riposo, mute, attivazione
  durante l’arresto e ritorno ai battiti. Risorse verificate anche con contesto simulato.
- Audit npm e controllo del diff.

## Limiti residui

- Modello non validato clinicamente: coefficienti, soglie e parte delle interazioni
  rimangono regole di gioco. I dettagli locali sono qualitativi, non misure emodinamiche.
- I test coprono gli stati combinatori, non ogni sequenza temporale possibile né
  l’ascolto fisico su ogni dispositivo. La precisione audio resta soggetta al browser.
- React DevTools CLI non disponibile: nessuna profilazione dei render eseguita.
- ESLint 10.11.0 valutato ma non adottato: eslint-plugin-react 7.37.5 dichiara
  supporto fino a ESLint 9.7+ nella major 9 e jsx-a11y 6.10.2 fino alla major 9.
  Ripristinato ESLint 9.39.5 per evitare dipendenze peer incompatibili. L’avviso
  di fine supporto resta: aggiornare quando i plugin dichiareranno compatibilità.
