// dataScenari.js

export const scenariAccidentali = {
  amputazione: {
    id: "amputazione",
    label: "Amputazione Arto Inf.",
    icona: "🩸",
    descrizione:
      "Perdita fisica di un intero letto capillare in parallelo. Aumenta la resistenza al flusso.",
    nodiRimossi: ["ArtiInf"],
    archiRimossi: ["e-vs-art", "e-art-ad"],
    // Impatto quantitativo sui parametri sistemici
    deltaTPR: 35, // +35% Resistenza Periferica
    deltaBPC: -8, // -8% Perfusione Cerebrale
    prioritaStato: 2, // Livello di gravita per il verdetto clinico
    statoSalute: "Critico ma Compensato",
  },
  emorragia: {
    id: "emorragia",
    label: "Emorragia Acuta Massiva",
    icona: "❌",
    descrizione:
      "Perdita rapida di oltre il 30% del volume ematico. Crollo pressorio sistemico.",
    nodiRimossi: [],
    archiRimossi: [],
    deltaTPR: 50, // Massima vasocostrizione di compenso
    deltaBPC: -35, // Crollo perfusione per mancanza di volume
    prioritaStato: 4,
    statoSalute: "Shock Ipovolemico Grave",
  },
  embolia: {
    id: "embolia",
    label: "Emolia Polmonare Massiva",
    icona: "⚠️",
    descrizione:
      "Ostruzione dell arteria polmonare. Blocco dello scambio gassoso.",
    nodiRimossi: [],
    archiRimossi: [],
    deltaTPR: 20,
    deltaBPC: -50, // Mancanza drammatica di ossigeno nel sangue
    prioritaStato: 5,
    statoSalute: "Insufficienza Cardiorespiratoria",
  },
  infarto: {
    id: "infarto",
    label: "Infarto del Miocardio (VS)",
    icona: "💔",
    descrizione:
      "Necrosi del tessuto muscolare del VS. Cedimento della pompa meccanica.",
    nodiRimossi: [],
    archiRimossi: [],
    deltaTPR: 15,
    deltaBPC: -28, // Calo della gittata cardiaca
    prioritaStato: 3,
    statoSalute: "Shock Cardiogeno",
  },
};
