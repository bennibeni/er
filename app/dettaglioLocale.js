// Esiti qualitativi del gioco: non conversioni del BPC in mmHg o saturazione.
export function calcolaDettaglioLocale(id, elemento, stato) {
    if (!elemento) return null;
    const { bpcTotale, isArresto, scenariAttivi, cureAttive, effettoCollaterale, sottoSforzo } = stato;
    const dati = { ...elemento };
    const note = [];
    dati.pressione = `Riferimento a riposo: ${elemento.pressione}`;
    dati.ossigeno = `Riferimento a riposo: ${elemento.ossigeno}`;
    if (isArresto) {
        dati.pressione = 'Flusso assente nel modello';
        dati.ossigeno = 'Apporto assente; saturazione non calcolabile';
        note.push('Arresto simulato: nessuna perfusione efficace.');
    } else {
        if (bpcTotale < 100) {
            dati.pressione = bpcTotale <= 60 ? 'Compromessa nel modello' : 'Ridotta nel modello';
            dati.ossigeno = 'Apporto ai tessuti ridotto; saturazione non calcolata';
            note.push('La perfusione locale segue la compromissione sistemica simulata.');
        } else if (scenariAttivi.length) {
            dati.pressione = 'Compensata nel modello; patologie ancora attive';
            dati.ossigeno = 'Apporto compensato nel modello; saturazione non calcolata';
        } else if (sottoSforzo) {
            dati.pressione = 'Richiesta di flusso aumentata nel modello';
            dati.ossigeno = 'Richiesta di ossigeno aumentata nel modello';
        }
        if (scenariAttivi.includes('embolia') && ['Polmoni', 'VD', 'e-vd-polm'].includes(id)) {
            dati.pressione = cureAttive.includes('trombolisi') ? 'Ostruzione attenuata nel modello' : 'Carico a monte aumentato nel modello';
            dati.ossigeno = cureAttive.includes('trombolisi') ? 'Scambio in recupero nel modello' : 'Scambio compromesso nel modello';
            note.push('Effetto locale dello scenario embolia e della sua eventuale terapia.');
        }
        if (scenariAttivi.includes('infarto') && id === 'VS') {
            dati.pressione = 'Capacità di pompa compromessa nel modello';
            dati.ossigeno = 'Apporto al miocardio compromesso nel modello';
            note.push('L’infarto resta attivo anche se altre cure compensano l’indice globale.');
        }
        if (effettoCollaterale) {
            note.push('Sono presenti effetti avversi simulati: il compenso globale non equivale alla risoluzione delle patologie.');
            if (['AD', 'VD', 'AS', 'VS', 'Polmoni'].includes(id)) dati.pressione = 'Carico alterato dagli effetti avversi simulati';
        }
    }
    dati.descrizione = `${elemento.descrizione}${note.length ? ' ' + note.join(' ') : ''}`;
    return dati;
}
