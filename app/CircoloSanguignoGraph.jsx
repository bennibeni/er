// CircoloSanguignoGraph.jsx
import { useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useMemo, useState } from 'react';

import '@xyflow/react/dist/style.css';
import './CircoloSanguigno.css';

import { informazioniMediche } from './dataAnatomia';
import { interventiMedici } from './dataCure';
import { scenariAccidentali } from './dataScenari';
import { initialEdges, initialNodes } from './flowConfig';

import { calcolaStatoSistemico } from './statoSistemico';

import AreaGrafo from './AreaGrafo';
import { creaGrafoClinico } from './grafoClinico';
import LogoEr from './LogoEr'; // Nuovo import del componente del logo
import PannelloControllo from './PannelloControllo';
import PannelloCure from './PannelloCure';
import Sidebar from './Sidebar';

export default function CircoloSanguignoGraph() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);
    const [idSelezionato, setIdSelezionato] = useState(null);
    const [sottoSforzo, setSottoSforzo] = useState(false);
    const [scenariAttivi, setScenariAttivi] = useState([]);
    const [cureAttive, setCureAttive] = useState([]);

    const statoSistemico = useMemo(
        () => calcolaStatoSistemico({ scenariAttivi, cureAttive, sottoSforzo }),
        [scenariAttivi, cureAttive, sottoSforzo],
    );
    const ilPazienteEMorto = statoSistemico.isArresto;

    const grafo = useMemo(() => {
        const vista = creaGrafoClinico(nodes, edges, statoSistemico);
        return {
            ...vista, nodes: vista.nodes.map(n => ({
                ...n, data: {
                    ...n.data,
                    label: <><span className="titolo-nodo">{n.data.label}</span><span className="segnale-nodo">{n.data.segnale}</span></>,
                }
            }))
        };
    }, [nodes, edges, statoSistemico]);

    const gestisciCambioScenario = (idScenario) => {
        const giaAttivo = scenariAttivi.includes(idScenario);
        if (!giaAttivo && ['emorragia', 'infarto'].includes(idScenario)) setSottoSforzo(false);
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
            <AreaGrafo statoSistemico={statoSistemico} nodes={grafo.nodes} edges={grafo.edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={onNodeClick} onEdgeClick={onEdgeClick} onPaneClick={onPaneClick} />

            {/* COMPONENTE LOGO INDIPENDENTE */}
            <LogoEr />

            {/* COMPONENTI CONTROLLI E INTERFACCIA */}
            <PannelloControllo sottoSforzo={sottoSforzo} setSottoSforzo={setSottoSforzo} scenariAttivi={scenariAttivi} gestisciCambioScenario={gestisciCambioScenario} scenariAccidentali={scenariAccidentali} />
            <PannelloCure interventiMedici={interventiMedici} cureAttive={cureAttive} scenariAttivi={scenariAttivi} gestisciCura={gestisciCura} pazienteMorto={ilPazienteEMorto} />
            <Sidebar idSelezionato={idSelezionato} elemento={elementoDati} scenariAttivi={scenariAttivi} statoSistemico={statoSistemico} sottoSforzo={sottoSforzo} />
        </div>
    );

}
