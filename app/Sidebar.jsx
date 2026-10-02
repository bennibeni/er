// Sidebar.jsx
import AudioEcg from './AudioEcg';
import CruscottoClinico from './CruscottoClinico';
import { interventiMedici } from './dataCure';
import { scenariAccidentali } from './dataScenari';
import DettaglioOrgano from './DettaglioOrgano';
import MonitorEcg from './MonitorEcg';

export default function Sidebar({ idSelezionato, elemento, scenariAttivi = [], cureAttive = [], sottoSforzo }) {

    // --- MOTORE MATEMATICO DI CALCOLO CUMULATIVO SISTEMICO ---
    let tprTotale = 100;
    let bpcTotale = 100;
    let notaEffettoCollaterale = '';

    scenariAttivi.forEach(id => {
        if (scenariAccidentali[id]) {
            tprTotale += scenariAccidentali[id].deltaTPR;
            bpcTotale += scenariAccidentali[id].deltaBPC;
        }
    });

    cureAttive.forEach(id => {
        if (interventiMedici[id]) {
            tprTotale += interventiMedici[id].deltaTPR;
            bpcTotale += interventiMedici[id].deltaBPC;
        }
    });

    if (cureAttive.includes('adrenalina') && (sottoSforzo || cureAttive.includes('trombolisi'))) {
        bpcTotale -= 35;
        notaEffettoCollaterale = '⚠️ CRISI IPERTENSIVA MALIGNA: Somministrazione incongrua di Adrenalina su miocardio accelerato o vasi trombolisati.';
    }

    if (cureAttive.includes('trasfusione') && !scenariAttivi.includes('emorragia')) {
        bpcTotale -= 25;
        notaEffettoCollaterale = '⚠️ SOVRACCARICO CIRCOLATORIO (TACO): Espansione ematica non necessaria in assenza di perdite ematiche attive.';
    }

    bpcTotale = Math.max(0, Math.min(100, bpcTotale));
    const isArresto = bpcTotale <= 40;

    let verdettoStato = 'Stabile / Compensato';
    let coloreStato = '#2e7d32';
    let ritmoBPM = sottoSforzo ? '140 BPM' : '60 BPM';
    let tipoRitmo = sottoSforzo ? '🏃‍♂️ TACHICARDIA' : '🫀 RITMO SINUSALE';

    if (isArresto) {
        verdettoStato = 'Arresto Cardiaco / Morte Clinica';
        coloreStato = '#212121';
        ritmoBPM = '0 BPM';
        tipoRitmo = '💀 ASISTOLIA / LINEA PIATTA';
    } else if (notaEffettoCollaterale) {
        verdettoStato = bpcTotale <= 60 ? 'Tossicita Severa / Pre-Arresto' : 'Shock Iatrogeno Farmacologico';
        coloreStato = bpcTotale <= 60 ? '#b71c1c' : '#ff9100';
        ritmoBPM = cureAttive.includes('adrenalina') ? '175 BPM' : '50 BPM';
        tipoRitmo = cureAttive.includes('adrenalina') ? '⚡ CRISI IPERTENSIVA' : '⚠️ CONGESTIONE ACUTA';
    } else if (bpcTotale <= 60) {
        verdettoStato = 'Insufficienza Multiorgano / Pre-Arresto';
        coloreStato = '#b71c1c';
        ritmoBPM = '40 BPM';
        tipoRitmo = '📉 RITMO AGONICO CRITICO';
    } else if (bpcTotale <= 80) {
        coloreStato = '#ff9100';
        if (scenariAttivi.includes('emorragia')) { verdettoStato = 'Shock Ipovolemico Compensato'; ritmoBPM = '35 BPM'; tipoRitmo = '📉 BRADICARDIA DA SHOCK'; }
        else if (scenariAttivi.includes('infarto')) { verdettoStato = 'Shock Cardiogeno Acuto'; ritmoBPM = 'Fibrillante'; tipoRitmo = '⚡ FIBRILLAZIONE VENTRICOLARE'; }
        else if (scenariAttivi.includes('embolia')) { verdettoStato = 'Insufficienza Respiratoria Acuta'; ritmoBPM = '160 BPM'; tipoRitmo = '⚠️ TACHICARDIA OSTRUTTIVA'; }
    }

    let datiAvanzati = elemento ? { ...elemento } : null;
    scenariAttivi.forEach(id => {
        const alterazioni = scenariAccidentali[id]?.alterazioniDati;
        if (datiAvanzati && alterazioni && alterazioni[idSelezionato]) {
            datiAvanzati = { ...datiAvanzati, ...alterazioni[idSelezionato] };
        }
    });

    if (isArresto && datiAvanzati) {
        datiAvanzati.pressione = '0 mmHg';
        datiAvanzati.ossigeno = '0%';
        datiAvanzati.descrizione = 'Arresto circolatorio totale. Assenza completa di flusso e ossigenazione cellulare.';
    }

    return (
        <div className="sidebar" style={{
            position: 'absolute', top: 0, right: 0, width: '350px',
            height: '100%', boxSizing: 'border-box', borderLeft: '1px solid #e0e0e0',
            padding: '20px', background: '#ffffff', boxShadow: '-4px 0 10px rgba(0,0,0,0.08)',
            display: 'flex', flexDirection: 'column', overflowY: 'auto', zIndex: 2
        }}>

            <AudioEcg bpcTotale={bpcTotale} bpmTesto={ritmoBPM} />

            <div style={{
                background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '6px',
                padding: '12px', marginBottom: '15px', fontSize: '0.8rem', lineHeight: '1.4', color: '#2e7d32'
            }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🩺 ER - Turno di Guardia
                </p>
                <p style={{ margin: '0 0 10px 0', fontStyle: 'italic', color: '#1b5e20' }}>
                    "Vesti i panni del Primario in questo incubo cardiovascolare. Collega sacche di sangue, stringi lacci emostatici e contrasta gli shock iatrogeni oppure fai suonare la nota fissa della Linea Piatta!"
                </p>
                <hr style={{ border: 0, borderTop: '1px solid #c8e6c9', margin: '8px 0' }} />
                <p style={{ margin: '0 0 4px 0' }}>• Fai un click sullo schermo per sbloccare l audio dei battiti.</p>
                <p style={{ margin: 0 }}>• Seleziona un componente del grafo per esaminare i parametri idraulici locali.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555' }}>MONITORAGGIO PAZIENTE</span>
            </div>

            <MonitorEcg bpcTotale={bpcTotale} scenariAttivi={scenariAttivi} sottoSforzo={sottoSforzo} coloreStato={coloreStato} tipoRitmo={tipoRitmo} ritmoBPM={ritmoBPM} />
            <CruscottoClinico verdettoStato={verdettoStato} coloreStato={coloreStato} tprTotale={tprTotale} bpcTotale={bpcTotale} />

            {notaEffettoCollaterale && !isArresto && (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#fff3e0', borderLeft: '4px solid #ff9800', borderRadius: '4px', fontSize: '0.8rem', color: '#e65100', fontWeight: 'bold', lineHeight: '1.4' }}>
                    {notaEffettoCollaterale}
                </div>
            )}

            {datiAvanzati ? (
                <DettaglioOrgano datiAvanzati={datiAvanzati} isArresto={isArresto} />
            ) : (
                <div style={{ margin: 'auto', textAlign: 'center', color: '#999', fontSize: '0.82rem', lineHeight: '1.4', padding: '0 10px' }}>
                    Seleziona un elemento della rete vascolare per misurare gli effetti combinati locali delle patologie attive.
                </div>
            )}

        </div>
    );
}
