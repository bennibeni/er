# ER · Turno di guardia

App indipendente Next.js / React del simulatore ER.
Richiede Node.js 20.9 o successivo.

```bash
npm install
npm run dev
```

Apri http://localhost:3001. Per la produzione: `npm run build`, poi `npm start`.

Il grafo usa React Flow. Seleziona organi e vasi per i dettagli, attiva gli
scenari e applica gli interventi per osservare i cambiamenti del monitor.
Le regole sono un modello di gioco semplificato, rivisto per coerenza interna.
Le soglie e i coefficienti non sono parametri clinici validati. Vedi `MODELLO.md`.

I componenti sono in `app/`; `layout.js` e `globals.css` completano la struttura
App Router. La foto fornita è in `public/backgrounds/sala-operatoria.jpeg`,
visualizzata con opacità al 22%. Il layout si adatta anche a schermi piccoli.

## Controlli

`npm run lint` esegue l'analisi statica. `npm run build` verifica la compilazione.
`npm run test:e2e` avvia la build di produzione sulla porta 3002 e verifica
le interazioni con Microsoft Edge installato sul PC.

Per eseguire build e test mentre il server di sviluppo è attivo, in PowerShell:

```powershell
$env:ER_CHECK = '1'
npm run build
npm run test:e2e
Remove-Item Env:ER_CHECK
```

Questa modalità usa `.next-check` e non modifica la build del server di sviluppo.
Vedi `CONTROLLI.md` per esiti e limiti della revisione.
