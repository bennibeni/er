// dataAnatomia.js

export const informazioniMediche = {
  // CAMERE CARDIACHE (I NODI DEL CUORE)
  AS: {
    titolo: "Atrio Sinistro (AS)",
    tipo: "Camera Cardiaca",
    ossigeno: "98%",
    pressione: "5-10 mmHg",
    descrizione:
      "Riceve il sangue ossigenato proveniente dai polmoni tramite le vene polmonari e lo spinge nel ventricolo sinistro.",
  },
  VS: {
    titolo: "Ventricolo Sinistro (VS)",
    tipo: "Camera Cardiaca",
    ossigeno: "98%",
    pressione: "120 mmHg (Sistolica)",
    descrizione:
      "La camera cardiaca piu muscolosa. Ha il compito di spingere il sangue ossigenato nell aorta per distribuirlo a tutto il corpo.",
  },
  AD: {
    titolo: "Atrio Destro (AD)",
    tipo: "Camera Cardiaca",
    ossigeno: "75%",
    pressione: "2-6 mmHg",
    descrizione:
      "Raccoglie tutto il sangue deossigenato di ritorno dai tessuti del grande circolo attraverso la vena cava superiore e inferiore.",
  },
  VD: {
    titolo: "Ventricolo Destro (VD)",
    tipo: "Camera Cardiaca",
    ossigeno: "75%",
    pressione: "25 mmHg (Sistolica)",
    descrizione:
      "Pompa il sangue deossigenato a bassa pressione nell arteria polmonare per inviarlo ai polmoni a ossigenarsi.",
  },

  // PICCOLO CIRCOLO (SCAMBIO GASSOSO)
  Polmoni: {
    titolo: "Polmoni (Circolo Polmonare)",
    tipo: "Organo di Scambio",
    ossigeno: "Da 75% a 98%",
    pressione: "15 mmHg (Media)",
    descrizione:
      "Qui avviene l ematosi: il sangue cede l anidride carbonica accumulata nei tessuti e si ricarica dell ossigeno respirato.",
  },

  // GRANDE CIRCOLO (DISTRETTI SISTEMICI IN PARALLELO)
  Cervello: {
    titolo: "Cervello e Arti Superiori",
    tipo: "Distretto Sistemico",
    ossigeno: "98% (Ingresso) / 75% (Uscita)",
    pressione: "90 mmHg",
    descrizione:
      "Irrora il sistema nervoso centrale. E un organo nobile e iper-protetto: richiede un flusso ematico costante e prioritario.",
  },
  Organi: {
    titolo: "Organi Addominali",
    tipo: "Distretto Sistemico",
    ossigeno: "98% (Ingresso) / 75% (Uscita)",
    pressione: "85 mmHg",
    descrizione:
      "Comprende stomaco, intestino, milza e fegato. Gestisce l assorbimento dei nutrienti, il metabolismo e i processi di disintossicazione.",
  },
  Reni: {
    titolo: "Reni (Filtrazione)",
    tipo: "Distretto Sistemico",
    ossigeno: "98% (Ingresso) / 75% (Uscita)",
    pressione: "80 mmHg",
    descrizione:
      "Filtrano costantemente il sangue circolante per regolare l equilibrio idro-salino, i fluidi corporei e rimuovere le scorie metaboliche.",
  },
  ArtiInf: {
    titolo: "Arti Inferiori",
    tipo: "Distretto Sistemico",
    ossigeno: "98% (Ingresso) / 75% (Uscita)",
    pressione: "90 mmHg",
    descrizione:
      "Irrora l apparato muscolo-scheletrico inferiore. Il ritorno venoso da questo distretto e fortemente aiutato dalla contrazione dei muscoli.",
  },

  // VALVOLE E VASI SANGUIGNI (GLI ARCHI DEL GRAFO)
  "e-ad-vd": {
    titolo: "Valvola Tricuspide",
    tipo: "Valvola Cardiaca",
    ossigeno: "75%",
    pressione: "Bassa",
    descrizione:
      "Impedisce al sangue di rifluire dal ventricolo destro all atrio destro durante la contrazione.",
  },
  "e-as-vs": {
    titolo: "Valvola Mitrale",
    tipo: "Valvola Cardiaca",
    ossigeno: "98%",
    pressione: "Alta",
    descrizione:
      "Regola il passaggio tra atrio e ventricolo sinistro. Sottoposta a forti sollecitazioni pressorie.",
  },
  "e-vd-polm": {
    titolo: "Arteria Polmonare",
    tipo: "Arteria Polmonare",
    ossigeno: "75%",
    pressione: "25/10 mmHg",
    descrizione:
      "L unica arteria dell organismo a trasportare sangue deossigenato (blu), dirigendolo verso i polmoni.",
  },
  "e-polm-as": {
    titolo: "Vene Polmonari",
    tipo: "Vena Polmonare",
    ossigeno: "98%",
    pressione: "Bassa",
    descrizione:
      "Le uniche vene del corpo a trasportare sangue ricco di ossigeno (rosso), riportandolo all atrio sinistro.",
  },
  "e-vs-cerv": {
    titolo: "Arteria Aorta (Ramo Superiore)",
    tipo: "Arteria Sistemica",
    ossigeno: "98%",
    pressione: "120/80 mmHg",
    descrizione:
      "Grande vaso arterioso che porta sangue arterioso ossigenato verso il capo e gli arti superiori.",
  },
  "e-vs-org": {
    titolo: "Arteria Aorta (Ramo Addominale)",
    tipo: "Arteria Sistemica",
    ossigeno: "98%",
    pressione: "120/80 mmHg",
    descrizione:
      "Tronco principale dell aorta che scende nella cavita addominale per nutrire i visceri.",
  },
  "e-vs-reni": {
    titolo: "Arterie Renali",
    tipo: "Arteria Sistemica",
    ossigeno: "98%",
    pressione: "Elevata",
    descrizione:
      "Rami diretti dell aorta che portano un enorme volume di sangue ai reni per permettere la filtrazione.",
  },
  "e-vs-art": {
    titolo: "Arteria Aorta (Ramo Iliaco)",
    tipo: "Arteria Sistemica",
    ossigeno: "98%",
    pressione: "120/80 mmHg",
    descrizione:
      "Segmento terminale dell aorta che si biforca per distribuire sangue arterioso nelle gambe.",
  },
  "e-cerv-ad": {
    titolo: "Vena Cava Superiore",
    tipo: "Grande Vena",
    ossigeno: "75%",
    pressione: "Prossima a 0",
    descrizione:
      "Raccoglie il sangue refluo e povero di ossigeno dalla meta superiore del corpo e lo riversa nel cuore.",
  },
  "e-org-ad": {
    titolo: "Vena Cava Inferiore (Ramo Epatico)",
    tipo: "Grande Vena",
    ossigeno: "75%",
    pressione: "Prossima a 0",
    descrizione:
      "Canalizza il sangue proveniente dai distretti digerenti e dal fegato verso l atrio destro.",
  },
  "e-reni-ad": {
    titolo: "Vene Renali",
    tipo: "Grande Vena",
    ossigeno: "75%",
    pressione: "Prossima a 0",
    descrizione:
      "Riportano il sangue filtrato dai reni verso la corrente della vena cava inferiore.",
  },
  "e-art-ad": {
    titolo: "Vena Cava Inferiore (Ramo Iliaco)",
    tipo: "Grande Vena",
    ossigeno: "75%",
    pressione: "Prossima a 0",
    descrizione:
      "Risale dalle gambe raccogliendo il sangue venoso profondo della meta inferiore del corpo.",
  },
};
