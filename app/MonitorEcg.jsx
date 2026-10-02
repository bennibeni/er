// MonitorEcg.jsx
import { useEffect, useRef, useState } from 'react';

export default function MonitorEcg({ bpcTotale, scenariAttivi = [], sottoSforzo, coloreStato, tipoRitmo, ritmoBPM }) {
    const canvasRef = useRef(null);
    const [cuoreLampeggiante, setCuoreLampeggiante] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let indicePunto = 0;
        let contatoreFrame = 0;

        // Configurazione base dell onda
        let puntiECG = [0, 0, 0, 2, -2, 0, 0, 5, -15, 25, -8, 0, 2, 0, 0, 0];
        let intervalloBattito = sottoSforzo ? 12 : 35;
        let coloreLinea = '#4cd964'; // Verde stabile
        let amplificazione = 1.4;

        // --- ALGORITMO DI FILTRAGGIO CLINICO DELL ONDA ---
        if (bpcTotale <= 40) {
            // 4. LINEA PIATTA
            puntiECG = [];
            intervalloBattito = 1;
            coloreLinea = '#37474f'; // Grigio spento
        } else if (bpcTotale <= 60) {
            // 3. PRE-ARRESTO (Onde agoniche, piatte e piccolissime)
            puntiECG = [0, 0, 0, 0.2, -0.2, 0, 0, 1, -4, 6, -1, 0, 0.2, 0];
            intervalloBattito = 70; // Bradicardia estrema
            coloreLinea = '#b71c1c'; // Rosso cupo
            amplificazione = 0.6;   // Ampiezza ridotta
        } else if (bpcTotale <= 80) {
            // 2. CRITICO (Aritmie o alterazioni patologiche specifiche)
            if (scenariAttivi.includes('infarto')) {
                puntiECG = [0, 5, -8, 12, -20, 18, -15, 30, -25, 10, -5, 15, -10, 5, 0];
                intervalloBattito = 10;
            } else if (scenariAttivi.includes('emorragia')) {
                puntiECG = [0, 0, 0, 0.5, -0.5, 0, 0, 1, -3, 8, -2, 0, 0.5, 0];
                intervalloBattito = 55;
            } else {
                intervalloBattito = 25;
            }
            coloreLinea = '#ff9100'; // Arancione di allarme
        } else if (sottoSforzo) {
            // 1. STABILE SOTTO SFORZO
            coloreLinea = '#ff3b30';
        }

        const storicoY = new Array(canvas.width).fill(canvas.height / 2);

        const render = () => {
            const yCentro = canvas.height / 2;
            ctx.fillStyle = '#0a0f0d';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let yNuovo = yCentro;
            contatoreFrame++;

            if (bpcTotale > 40 && contatoreFrame >= intervalloBattito) {
                if (indicePunto < puntiECG.length) {
                    yNuovo += puntiECG[indicePunto] * amplificazione;

                    // Trigger Heart Blip: si attiva sul picco dell onda R
                    if (puntiECG[indicePunto] >= 6) {
                        setCuoreLampeggiante(true);
                        // Nel pre-arresto il lampeggio è più debole
                        setTimeout(() => setCuoreLampeggiante(false), bpcTotale <= 60 ? 150 : 80);
                    }
                    indicePunto++;
                } else {
                    indicePunto = 0;
                    contatoreFrame = 0;
                }
            }

            storicoY.shift();
            storicoY.push(yNuovo);

            ctx.strokeStyle = coloreLinea;
            ctx.lineWidth = bpcTotale <= 40 ? 1.5 : 2.5;
            ctx.shadowBlur = bpcTotale <= 40 ? 0 : 6;
            ctx.shadowColor = coloreLinea;

            ctx.beginPath();
            ctx.moveTo(0, storicoY[0]);
            for (let i = 1; i < canvas.width; i++) {
                ctx.lineTo(i, storicoY[i]);
            }
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [sottoSforzo, scenariAttivi, bpcTotale]);

    return (
        <div style={{ marginBottom: '15px', position: 'relative' }}>
            <canvas ref={canvasRef} width={310} height={80} style={{ borderRadius: '6px', background: '#0a0f0d', display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 2px', fontSize: '0.8rem', fontWeight: 'bold', color: coloreStato, alignItems: 'center' }}>
                <span>{tipoRitmo}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <span style={{
                        color: bpcTotale <= 40 ? '#37474f' : '#ff3b30',
                        // Nel pre-arresto l icona è semi-invisibile/intermittente
                        opacity: bpcTotale <= 40 ? 0.1 : (cuoreLampeggiante ? 1 : (bpcTotale <= 60 ? 0.2 : 0.3)),
                        transition: 'opacity 0.05s',
                        fontSize: '1rem'
                    }}>
                        ❤️
                    </span>
                    {ritmoBPM}
                </span>
            </div>
        </div>
    );
}
