// Segnali qualitativi: indici grafici, non misure di portata o saturazione.
export function segnaliClinici({ bpcTotale, isArresto, scenariAttivi, cureAttive, sottoSforzo }) {
    const embolia = scenariAttivi.includes('embolia');
    const ostruzione = embolia && !cureAttive.includes('trombolisi');
    const emorragia = scenariAttivi.includes('emorragia');
    const perditaCompensata = emorragia && cureAttive.includes('trasfusione');
    const perfusione = isArresto ? 'assente' : bpcTotale <= 60 ? 'critica' : bpcTotale <= 80 ? 'ridotta' : 'adeguata';
    const ossigenazione = isArresto ? 'non valutabile' : ostruzione ? 'ridotta' : embolia ? 'in recupero' : 'conservata';
    const flusso = isArresto ? 'assente' : bpcTotale <= 60 ? 'molto ridotto' : bpcTotale <= 80 ? 'ridotto' : sottoSforzo ? 'aumentato' : 'conservato';
    const intensitaFlusso = isArresto ? 0 : (bpcTotale / 100) * (sottoSforzo && bpcTotale > 80 ? 1.5 : 1);
    return { perfusione, ossigenazione, flusso, intensitaFlusso, ostruzione, emorragia, perditaCompensata };
}
