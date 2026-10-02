import { MarkerType } from "@xyflow/react";
import { scenariAccidentali } from "./dataScenari.js";

const ROSSO = "#dc384c";
const BLU = "#297bc1";
const VIOLA = "#975692";
const organi = new Set(["Cervello", "Organi", "Reni", "ArtiInf"]);
const cuori = new Set(["AS", "VS", "AD", "VD"]);

// Solo presentazione: non ricalcola né modifica lo stato clinico.
export function creaGrafoClinico(nodes, edges, stato) {
  const {
    segnali,
    bpm,
    isArresto,
    scenariAttivi,
    cureAttive,
    effettoCollaterale,
  } = stato;
  const rimossi = new Set(
    scenariAttivi.flatMap((id) => scenariAccidentali[id]?.nodiRimossi ?? []),
  );
  const archiRimossi = new Set(
    scenariAttivi.flatMap((id) => scenariAccidentali[id]?.archiRimossi ?? []),
  );

  const nodi = nodes
    .filter((n) => !rimossi.has(n.id))
    .map((n) => {
      const cuore = cuori.has(n.id);
      const destro = ["AD", "VD"].includes(n.id);
      let segnale = cuore
        ? `♥ ${bpm} bpm`
        : n.id === "Polmoni"
          ? "Scambio regolare"
          : "Perfusione adeguata";
      let livello = "normale";

      if (organi.has(n.id) && segnali.perfusione !== "adeguata") {
        livello = segnali.perfusione === "ridotta" ? "ridotto" : "critico";
        segnale =
          segnali.perfusione === "ridotta"
            ? "↓ Perfusione ridotta"
            : "⚠ Perfusione critica";
      }
      if (n.id === "Polmoni" && scenariAttivi.includes("embolia")) {
        livello = segnali.ostruzione ? "critico" : "recupero";
        segnale = segnali.ostruzione
          ? "⛔ Scambio ridotto"
          : "↗ Scambio in recupero";
      }
      if (cuore && effettoCollaterale) {
        livello = "critico";
        segnale =
          effettoCollaterale === "sovraccarico-trasfusione"
            ? "⚠ Sovraccarico"
            : "⚠ Stress cardiaco";
      } else if (n.id === "VS" && scenariAttivi.includes("infarto")) {
        livello = "critico";
        segnale = "💔 Pompa ridotta";
      } else if (cuore && segnali.perfusione === "critica") {
        livello = "critico";
        segnale = `⚠ ${bpm} bpm`;
      }
      if (isArresto) {
        livello = "arresto";
        segnale = "■ Flusso assente";
      }

      const bordo = {
        normale: cuore ? (destro ? BLU : ROSSO) : "#94a3b8",
        ridotto: "#c58110",
        critico: "#bd2637",
        recupero: "#258571",
        arresto: "#66717b",
      }[livello];

      // Struttura React per tenere ben separati titolo ed etichetta clinica
      const labelFormattata = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <strong style={{ fontSize: "12px", fontWeight: "bold" }}>
            {n.data.originalLabel || n.data.label}
          </strong>
          <span
            style={{ fontSize: "10px", opacity: 0.85, whiteSpace: "nowrap" }}
          >
            {segnale}
          </span>
        </div>
      );

      return {
        ...n,
        className: `clinical-node stato-${livello}${cuore && !isArresto ? " battito-cuore" : ""}`,
        ariaLabel: `${n.data.originalLabel || n.data.label}. ${segnale}`,
        data: {
          ...n.data,
          originalLabel: n.data.originalLabel || n.data.label,
          label: labelFormattata,
        },
        style: {
          ...n.style,
          minHeight: 74,
          padding: "10px 8px",
          color: "#273644",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isArresto
            ? "#e9ecef"
            : livello === "critico"
              ? "#fff0f1"
              : livello === "ridotto"
                ? "#fff8e7"
                : cuore
                  ? destro
                    ? "#eef7ff"
                    : "#fff2f3"
                  : "#ffffff",
          border: `2px ${livello === "critico" || isArresto ? "dashed" : "solid"} ${bordo}`,
          "--durata-battito": bpm > 0 ? `${60 / bpm}s` : "1s",
          "--colore-battito": destro ? "#297bc166" : "#dc384c66",
        },
      };
    });

  const archi = edges
    .filter(
      (e) =>
        !rimossi.has(e.source) &&
        !rimossi.has(e.target) &&
        !archiRimossi.has(e.id),
    )
    .map((e) => {
      const arterioso =
        e.source === "AS" || e.source === "VS" || e.source === "Polmoni";
      const colore = arterioso ? (segnali.ostruzione ? VIOLA : ROSSO) : BLU;
      const bloccato = segnali.ostruzione && e.id === "e-vd-polm";
      const recupero =
        scenariAttivi.includes("embolia") &&
        cureAttive.includes("trombolisi") &&
        e.id === "e-vd-polm";
      const label = bloccato
        ? "⛔ Ostruzione"
        : recupero
          ? "↗ Flusso ripristinato"
          : e.label;
      return {
        ...e,
        label,
        className: `clinical-flow${bloccato ? " vaso-ostruito" : ""}`,
        animated: !isArresto && !bloccato,
        ariaLabel: `${e.source} → ${e.target}: ${bloccato ? "ostruzione" : "flusso " + segnali.flusso}`,
        style: {
          ...e.style,
          stroke: colore,
          strokeWidth: isArresto ? 2 : 2 + 2 * segnali.intensitaFlusso,
          opacity: isArresto ? 0.45 : 1,
          "--durata-flusso": `${1.5 / Math.max(0.12, segnali.intensitaFlusso)}s`,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: colore },
        labelStyle: {
          fill: bloccato ? "#a6202f" : "#334155",
          fontSize: 11,
          fontWeight: bloccato || recupero ? 700 : 500,
        },
        labelBgStyle: {
          fill: bloccato ? "#fff0dd" : "#ffffff",
          fillOpacity: 0.95,
        },
        labelBgPadding: [5, 4], // Ripristinato correttamente qui
        labelBgBorderRadius: 4,
      };
    });
  return { nodes: nodi, edges: archi };
}
