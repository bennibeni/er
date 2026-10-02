# R42 — ER · Turno di guardia

App indipendente Next.js / React ricavata dai componenti di `R42.zip`.
Richiede Node.js 20.9 o successivo.

```bash
npm install
npm run dev
```

Apri http://localhost:3001. Per la produzione: `npm run build`, poi `npm start`.

Il grafo usa React Flow. Seleziona organi e vasi per i dettagli, attiva gli
scenari e applica gli interventi per osservare i cambiamenti del monitor.
I dati e le regole semplificate sono quelli del codice fornito.

I componenti sono in `app/`; `layout.js` e `globals.css` completano la struttura
App Router. La foto fornita è in `public/backgrounds/sala-operatoria.jpeg`,
visualizzata con opacità al 22%. Il layout si adatta anche a schermi piccoli.
