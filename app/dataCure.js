// dataCure.js

export const interventiMedici = {
  laccio: {
    id: "laccio",
    label: "Applica Laccio Emostatico",
    icona: "🩹",
    descrizione:
      "Blocca l emorragia locale massiva stringendo i vasi a monte del trauma. Funziona solo se associato ad Amputazione.",
    deltaTPR: 10, // Aumenta leggermente la resistenza occludendo il vaso
    deltaBPC: 15, // Recupero di perfusione fermando la perdita di sangue
    condizioneNecessaria: "amputazione",
  },
  trasfusione: {
    id: "trasfusione",
    label: "Sacca di Sangue / Plasma",
    icona: "🩸",
    descrizione:
      "Ripristina la volemia (il volume di sangue circolante) per contrastare lo shock ipovolemico.",
    deltaTPR: -10, // Riduce la vasocostrizione estrema di compenso
    deltaBPC: 30, // Forte recupero della pressione e della perfusione cerebrale
    condizioneNecessaria: "emorragia",
  },
  adrenalina: {
    id: "adrenalina",
    label: "Iniezione di Adrenalina",
    icona: "💉",
    descrizione:
      "Potente stimolante cardiaco e vasocostrittore. Aumenta artificialmente la pressione e la gittata.",
    deltaTPR: 40, // Vasocostrizione massiva
    deltaBPC: 20, // Spinge piu sangue al cervello
    condizioneNecessaria: null, // Somministrabile sempre
  },
  trombolisi: {
    id: "trombolisi",
    label: "Terapia Trombolitica",
    icona: "🧪",
    descrizione:
      "Somministrazione di farmaci per sciogliere meccanicamente l embolo o il trombo.",
    deltaTPR: -5,
    deltaBPC: 45, // Libera quasi completamente il circolo polmonare o coronarico
    condizioneNecessaria: "embolia",
  },
};
