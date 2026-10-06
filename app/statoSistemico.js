import { segnaliClinici } from "./segnaliClinici.js";
import { interventiMedici } from "./dataCure.js";
import { scenariAccidentali } from "./dataScenari.js";

// Funzione pura: unica fonte dei parametri sistemici e dello stato del paziente.
export function calcolaStatoSistemico({
  scenariAttivi = [],
  cureAttive = [],
  sottoSforzo = false,
} = {}) {
  scenariAttivi = [...new Set(scenariAttivi)].filter((id) =>
    Object.hasOwn(scenariAccidentali, id),
  );
  cureAttive = [...new Set(cureAttive)].filter((id) =>
    Object.hasOwn(interventiMedici, id),
  );
  // --- MOTORE MATEMATICO DI CALCOLO CUMULATIVO SISTEMICO ---
  let tprTotale = 100;
  let bpcTotale = 100;
  let notaEffettoCollaterale = "";
  let effettoCollaterale = null;

  scenariAttivi.forEach((id) => {
    if (scenariAccidentali[id]) {
      tprTotale += scenariAccidentali[id].deltaTPR;
      bpcTotale += scenariAccidentali[id].deltaBPC;
    }
  });

  cureAttive.forEach((id) => {
    const cura = interventiMedici[id];
    if (
      cura &&
      (!cura.condizioneNecessaria ||
        scenariAttivi.includes(cura.condizioneNecessaria))
    ) {
      tprTotale += interventiMedici[id].deltaTPR;
      bpcTotale += interventiMedici[id].deltaBPC;
    }
  });

  bpcTotale = Math.min(100, bpcTotale); // Il beneficio non crea una riserva contro i danni.

  if (
    cureAttive.includes("adrenalina") &&
    (sottoSforzo || cureAttive.includes("trombolisi"))
  ) {
    bpcTotale -= 35;
    effettoCollaterale = "tossicita-adrenalina";
    notaEffettoCollaterale =
      "⚠️ STRESS CARDIACO SIMULATO: combinazione di adrenalina con sforzo o trombolisi nel modello di gioco.";
  }

  if (
    cureAttive.includes("trasfusione") &&
    !scenariAttivi.includes("emorragia")
  ) {
    bpcTotale -= 25;
    effettoCollaterale = effettoCollaterale
      ? "collasso-farmacologico"
      : "sovraccarico-trasfusione";
    notaEffettoCollaterale +=
      (notaEffettoCollaterale ? " " : "") +
      "⚠️ SOVRACCARICO SIMULATO: trasfusione senza emorragia attiva nel modello di gioco.";
  }

  bpcTotale = Math.max(0, Math.min(100, bpcTotale));
  const isArresto = bpcTotale <= 40;

  let verdettoStato = "Stabile / Compensato";
  let coloreStato = "#2e7d32";
  let ritmoBPM = sottoSforzo ? "140 BPM" : "60 BPM";
  let tipoRitmo = sottoSforzo ? "🏃‍♂️ TACHICARDIA" : "🫀 RITMO SINUSALE";

  if (isArresto) {
    verdettoStato = "Arresto simulato";
    coloreStato = "#212121";
    ritmoBPM = "0 BPM";
    tipoRitmo = "💀 ASISTOLIA / LINEA PIATTA";
  } else if (notaEffettoCollaterale) {
    verdettoStato =
      bpcTotale <= 60
        ? "Tossicita Severa / Pre-Arresto"
        : "Shock Iatrogeno Farmacologico";
    coloreStato = bpcTotale <= 60 ? "#b71c1c" : "#ff9100";
    ritmoBPM = cureAttive.includes("adrenalina") ? "175 BPM" : "110 BPM";
    tipoRitmo = cureAttive.includes("adrenalina")
      ? "⚡ STRESS CARDIACO"
      : "⚠️ CONGESTIONE ACUTA";
  } else if (bpcTotale <= 60) {
    verdettoStato = "Insufficienza Multiorgano / Pre-Arresto";
    coloreStato = "#b71c1c";
    ritmoBPM = "40 BPM";
    tipoRitmo = "📉 RITMO AGONICO CRITICO";
  } else if (bpcTotale <= 80) {
    coloreStato = "#ff9100";
    if (scenariAttivi.includes("emorragia")) {
      verdettoStato = "Shock Ipovolemico Compensato";
      ritmoBPM = "120 BPM";
      tipoRitmo = "📈 TACHICARDIA DA SHOCK";
    } else if (scenariAttivi.includes("infarto")) {
      verdettoStato = "Shock Cardiogeno Acuto";
      ritmoBPM = "110 BPM";
      tipoRitmo = "⚡ TACHICARDIA SIMULATA";
    } else if (scenariAttivi.includes("embolia")) {
      verdettoStato = "Insufficienza Respiratoria Acuta";
      ritmoBPM = "160 BPM";
      tipoRitmo = "⚠️ TACHICARDIA OSTRUTTIVA";
    }
  }

  const bpm = Number.parseInt(ritmoBPM, 10);
  const segnali = segnaliClinici({
    bpcTotale,
    isArresto,
    scenariAttivi,
    cureAttive,
    sottoSforzo,
  });
  return {
    segnali,
    bpm,
    scenariAttivi,
    cureAttive,
    sottoSforzo,
    tprTotale,
    bpcTotale,
    effettoCollaterale,
    notaEffettoCollaterale,
    isArresto,
    verdettoStato,
    coloreStato,
    ritmoBPM,
    tipoRitmo,
  };
}
