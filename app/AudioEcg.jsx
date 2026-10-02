// AudioEcg.jsx
import { useEffect, useRef } from 'react';

export default function AudioEcg({ bpcTotale, bpmTesto }) {
    const audioCtxRef = useRef(null);
    const intervalloRef = useRef(null);
    const fischioContinuoRef = useRef(null);

    // Inizializza il contesto audio solo al primo click dell'utente (vincolo del browser)
    const inizializzaAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    };

    useEffect(() => {
        // Aggancia l'inizializzazione a un click globale per sbloccare l'audio sul browser
        window.addEventListener('click', inizializzaAudio);
        return () => {
            window.removeEventListener('click', inizializzaAudio);
            audioCtxRef.current?.close();
            audioCtxRef.current = null;
        };
    }, []);

    useEffect(() => {
        // Funzione per generare il singolo "Bip"
        const riproducibip = () => {
            if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;

            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // Frequenza del bip (880Hz è un LA)

            // Inviluppo del suono: attacco rapido e decadimento in 100ms
            gain.gain.setValueAtTime(0.08, ctx.currentTime); // Volume basso controllato
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        };

        // Pulisce i cicli precedenti prima di ri-analizzare lo stato emodinamico
        if (intervalloRef.current) clearInterval(intervalloRef.current);
        if (fischioContinuoRef.current) {
            try { fischioContinuoRef.current.stop(); } catch { }
            fischioContinuoRef.current = null;
        }

        const isArresto = bpcTotale <= 40;

        if (isArresto) {
            // 💀 STATO LINEA PIATTA: Fischio continuo e drammatico
            if (audioCtxRef.current && audioCtxRef.current.state !== 'suspended') {
                const ctx = audioCtxRef.current;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(540, ctx.currentTime); // Nota fissa continua più bassa
                gain.gain.setValueAtTime(0.04, ctx.currentTime); // Volume di sottofondo costante

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                fischioContinuoRef.current = osc; // Lo memorizziamo per poterlo fermare quando viene curato
            }
        } else {
            // 🫀 PAZIENTE VIVO: Calcola la velocità dei singoli battiti
            let millisecondiIntervallo = 1000; // Default 60 BPM (1 battito al secondo)

            if (bpmTesto.includes('140') || bpmTesto.includes('150') || bpmTesto.includes('160')) {
                millisecondiIntervallo = 400; // Tachicardia (battiti molto ravvicinati)
            } else if (bpmTesto.includes('35')) {
                millisecondiIntervallo = 1700; // Bradicardia agonica (battiti lentissimi)
            } else if (bpmTesto.includes('Irregolare')) {
                // Simula aritmia alternando tempi casuali ad ogni ciclo
                intervalloRef.current = setInterval(() => {
                    if (Math.random() > 0.4) riproducibip();
                }, 300);
                return () => clearInterval(intervalloRef.current);
            }

            intervalloRef.current = setInterval(riproducibip, millisecondiIntervallo);
        }

        return () => {
            if (intervalloRef.current) clearInterval(intervalloRef.current);
            if (fischioContinuoRef.current) {
                try { fischioContinuoRef.current.stop(); } catch { }
            }
        };
    }, [bpcTotale, bpmTesto]);

    return null; // Il componente è invisibile, genera solo onde sonore
}
