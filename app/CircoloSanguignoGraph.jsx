// CircoloSanguignoGraph.jsx
import { useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';

import '@xyflow/react/dist/style.css';
import './CircoloSanguigno.css';

import { informazioniMediche } from './dataAnatomia';
import { interventiMedici } from './dataCure';
import { scenariAccidentali } from './dataScenari';
import { initialEdges, initialNodes } from './flowConfig';

import AreaGrafo from './AreaGrafo';
import LogoEr from './LogoEr'; // Nuovo import del componente del logo
import PannelloControllo from './PannelloControllo';
import PannelloCure from './PannelloCure';
import Sidebar from './Sidebar';

export default function CircoloSanguignoGraph() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [idSelezionato, setIdSelezionato] = useState(null);
    const [sottoSforzo, setSottoSforzo] = useState(false);
    const [scenariAttivi, setScenariAttivi] = useState([]);
    const [cureAttive, setCureAttive] = useState([]);

    // Calcolo dinamico dello stato emodinamico lineare con effetti collaterali
    const calcolaStatoEmodinamico = useCallback(() => {
        let bpc = 100;
        let effettoCollateraleAttivo = null;

        scenariAttivi.forEach(id => {
            if (scenariAccidentali[id]) bpc += scenariAccidentali[id].deltaBPC;
        });

        cureAttive.forEach(id => {
            if (interventiMedici[id]) bpc += interventiMedici[id].deltaBPC;
        });

        if (cureAttive.includes('adrenalina') && (sottoSforzo || cureAttive.includes('trombolisi'))) {
            bpc -= 35;
            effettoCollateraleAttivo = 'tossicita-adrenalina';
        }

        if (cureAttive.includes('trasfusione') && !scenariAttivi.includes('emorragia')) {
            bpc -= 25;
            if (effettoCollateraleAttivo) effettoCollateraleAttivo = 'collasso-farmacologico';
            else effettoCollateraleAttivo = 'sovraccarico-trasfusione';
        }

        bpc = Math.max(0, Math.min(100, bpc));
        return { bpc, effettoCollaterale: effettoCollateraleAttivo };
    }, [scenariAttivi, cureAttive, sottoSforzo]);

    const { bpc: bpcCalcolato } = calcolaStatoEmodinamico();
    const ilPazienteEMorto = bpcCalcolato <= 40;

    useEffect(() => {
        let nodiCorrenti = initialNodes.map(n => ({ ...n, className: '', style: { ...n.style } }));
        let archiCorrenti = initialEdges.map(e => ({ ...e, className: '', style: { ...e.style }, animated: true }));

        const { bpc: bpcTotale, effettoCollaterale } = calcolaStatoEmodinamico();
        const isArresto = bpcTotale <= 40;

        nodiCorrenti = nodiCorrenti.map(nodo => {
            if (isArresto) {
                return { ...nodo, style: { ...nodo.style, background: '#e0e0e0', border: '2px dashed #757575', color: '#9e9e9e' }, className: '' };
            }

            let stileAggiornato = { ...nodo.style };
            let classeAggiornata = '';
            const isCuore = ['AS', 'VS', 'AD', 'VD'].includes(nodo.id);

            if (isCuore && effettoCollaterale === 'tossicita-adrenalina') {
                stileAggiornato = { ...stileAggiornato, background: '#ffb74d', border: '3px dotted #e65100' };
                classeAggiornata = 'cuore-pulsante';
            } else if (isCuore && effettoCollaterale === 'sovraccarico-trasfusione') {
                stileAggiornato = { ...stileAggiornato, background: '#b3e5fc', border: '3px double #0288d1' };
                classeAggiornata = 'cuore-pulsante';
            } else if (isCuore && cureAttive.includes('adrenalina') && !effettoCollaterale) {
                stileAggiornato = { ...stileAggiornato, background: '#fff9c4', border: '3px solid #fbc02d' };
                classeAggiornata = 'cuore-pulsante';
            } else if (scenariAttivi.includes('infarto') && nodo.id === 'VS') {
                stileAggiornato = { ...stileAggiornato, background: '#ff8a80', border: '3px dashed #b71c1c' };
                classeAggiornata = 'cuore-pulsante';
            }

            if (scenariAttivi.includes('emorragia') && ['Cervello', 'Organi', 'Reni'].includes(nodo.id) && !cureAttive.includes('trasfusione')) {
                stileAggiornato = { ...stileAggiornato, background: '#f5f5f5', border: '1px solid #b0bec5' };
            }

            if (bpcTotale <= 60) {
                stileAggiornato = { ...stileAggiornato, background: isCuore ? '#bbdefb' : '#c5cae9', border: '2px solid #5c6bc0', color: '#1a237e' };
                classeAggiornata = 'nodo-cianotico';
            }

            return { ...nodo, style: stileAggiornato, className: classeAggiornata };
        });

        archiCorrenti = archiCorrenti.map(arco => {
            if (isArresto) return { ...arco, style: { ...arco.style, stroke: '#9e9e9e', strokeWidth: 1.5 }, animated: false };
            let stileArco = { ...arco.style };
            let classeArco = '';
            let animato = true;

            if (bpcTotale <= 60) {
                stileArco = { ...stileArco, strokeWidth: 2, stroke: '#7986cb' };
                classeArco = 'flusso-critico';
            } else if (scenariAttivi.includes('emorragia') && !cureAttive.includes('trasfusione')) {
                stileArco = { ...stileArco, strokeWidth: 1.5, stroke: '#b0bec5' };
                animato = false;
            } else if (scenariAttivi.includes('embolia') && arco.id === 'e-vd-polm') {
                const risolto = cureAttive.includes('trombolisi');
                stileArco = { ...stileArco, strokeWidth: risolto ? 3.5 : 7, stroke: risolto ? '#4cd964' : '#ff9800' };
                classeArco = risolto ? 'flusso-accelerato' : 'flusso-bloccato';
            } else if (sottoSforzo || effettoCollaterale === 'tossicita-adrenalina') {
                stileArco = { ...stileArco, strokeWidth: 6, stroke: '#d32f2f' };
                classeArco = 'flusso-accelerato';
            }

            return { ...arco, style: stileArco, className: classeArco, animated: animato };
        });

        setNodes(nodiCorrenti);
        setEdges(archiCorrenti);
    }, [sottoSforzo, scenariAttivi, cureAttive, setNodes, setEdges, calcolaStatoEmodinamico]);

    const gestisciCambioScenario = (idScenario) => {
        const giaAttivo = scenariAttivi.includes(idScenario);
        setScenariAttivi(prev => giaAttivo ? prev.filter(id => id !== idScenario) : [...prev, idScenario]);
        if (giaAttivo) {
            setCureAttive(currentCure => currentCure.filter(cId => interventiMedici[cId].condizioneNecessaria !== idScenario));
        }
        setIdSelezionato(null);
    };

    const gestisciCura = (idCura) => {
        if (ilPazienteEMorto) return;
        setCureAttive((prev) => prev.includes(idCura) ? prev.filter(id => id !== idCura) : [...prev, idCura]);
    };

    const onNodeClick = useCallback((event, node) => setIdSelezionato(node.id), []);
    const onEdgeClick = useCallback((event, edge) => setIdSelezionato(edge.id), []);
    const onPaneClick = useCallback(() => setIdSelezionato(null), []);

    const elementoDati = idSelezionato ? informazioniMediche[idSelezionato] : null;

    return (
        <div className="contenitore-gioco-er">

            {/* AREA GRAFO (Ora renderizzata sopra lo sfondo opaco della sala operatoria) */}
            <AreaGrafo nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={onNodeClick} onEdgeClick={onEdgeClick} onPaneClick={onPaneClick} />

            {/* COMPONENTE LOGO INDIPENDENTE */}
            <LogoEr />

            {/* COMPONENTI CONTROLLI E INTERFACCIA */}
            <PannelloControllo sottoSforzo={sottoSforzo} setSottoSforzo={setSottoSforzo} scenariAttivi={scenariAttivi} gestisciCambioScenario={gestisciCambioScenario} scenariAccidentali={scenariAccidentali} />
            <PannelloCure interventiMedici={interventiMedici} cureAttive={cureAttive} scenariAttivi={scenariAttivi} gestisciCura={gestisciCura} pazienteMorto={ilPazienteEMorto} />
            <Sidebar idSelezionato={idSelezionato} elemento={elementoDati} scenariAttivi={scenariAttivi} cureAttive={cureAttive} sottoSforzo={sottoSforzo} />

        </div>
    );

}
