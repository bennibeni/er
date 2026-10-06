import { useEffect, useRef, useState } from "react";
import { ampiezzaEcg, faseBattito } from "./ecgTiming";
import { creaAudioEcg } from "./ecgAudio";

export default function MonitorEcg({ statoSistemico }) {
  const { bpm, bpcTotale, isArresto, coloreStato, tipoRitmo, ritmoBPM } =
    statoSistemico;
  const canvasRef = useRef(null);
  const cuoreRef = useRef(null);
  const audioRef = useRef(null);
  const [audioAttivo, setAudioAttivo] = useState(false);
  const [erroreAudio, setErroreAudio] = useState("");

  async function cambiaAudio() {
    if (audioRef.current) {
      audioRef.current.chiudi();
      audioRef.current = null;
      setAudioAttivo(false);
      return;
    }
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) {
      setErroreAudio("Audio non disponibile in questo browser.");
      return;
    }
    let audio;
    try {
      audio = creaAudioEcg(AudioClass);
      audioRef.current = audio;
      await audio.avvia();
      if (audioRef.current === audio) {
        setAudioAttivo(true);
        setErroreAudio("");
      }
    } catch {
      audio?.chiudi();
      if (audioRef.current === audio) audioRef.current = null;
      setErroreAudio("Impossibile attivare l’audio. Riprova.");
    }
  }

  useEffect(
    () => () => {
      audioRef.current?.chiudi();
      audioRef.current = null;
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const inizio = performance.now();
    let ultimoCiclo = -1;
    let frame;
    const render = (now) => {
      const trascorso = now - inizio;
      const { ciclo, fase } = faseBattito(trascorso, bpm);
      const visibile = !document.hidden;
      audioRef.current?.arresto(isArresto && visibile);
      if (ciclo > ultimoCiclo && visibile && !isArresto)
        audioRef.current?.battito();
      ultimoCiclo = ciclo;
      if (cuoreRef.current)
        cuoreRef.current.style.opacity = isArresto
          ? ".1"
          : fase < 0.12
            ? "1"
            : ".3";
      ctx.fillStyle = "#0a0f0d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = isArresto ? "#687c73" : coloreStato;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const t = trascorso - (canvas.width - 1 - x) * 10;
        const y =
          canvas.height / 2 + ampiezzaEcg(t, bpm) * (bpcTotale <= 60 ? 0.4 : 1);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      frame = requestAnimationFrame(render);
    };
    const visibilita = () => {
      audioRef.current?.arresto(false);
      ultimoCiclo = faseBattito(performance.now() - inizio, bpm).ciclo;
    };
    document.addEventListener("visibilitychange", visibilita);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibilita);
      audioRef.current?.arresto(false);
    };
  }, [bpm, bpcTotale, isArresto, coloreStato]);

  return (
    <div style={{ marginBottom: 15 }}>
      <canvas
        ref={canvasRef}
        width={310}
        height={80}
        aria-label={`ECG simulato: ${ritmoBPM}`}
        style={{ borderRadius: 6, display: "block" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          padding: "6px 0",
          fontSize: ".8rem",
          fontWeight: "bold",
          color: coloreStato,
        }}
      >
        <span>{tipoRitmo}</span>
        <span>
          <span ref={cuoreRef} aria-hidden="true">
            ❤️
          </span>{" "}
          {ritmoBPM}
        </span>
      </div>
      <button type="button" onClick={cambiaAudio} aria-pressed={audioAttivo}>
        {audioAttivo ? "Disattiva audio" : "Attiva audio"}
      </button>
      {erroreAudio && <p role="status">{erroreAudio}</p>}
    </div>
  );
}
