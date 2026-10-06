// Sidebar.jsx
import CruscottoClinico from "./CruscottoClinico";
import { calcolaDettaglioLocale } from "./dettaglioLocale";
import DettaglioOrgano from "./DettaglioOrgano";
import MonitorEcg from "./MonitorEcg";

export default function Sidebar({ idSelezionato, elemento, statoSistemico }) {
  const {
    tprTotale,
    bpcTotale,
    notaEffettoCollaterale,
    isArresto,
    verdettoStato,
    coloreStato,
  } = statoSistemico;

  const datiAvanzati = calcolaDettaglioLocale(
    idSelezionato,
    elemento,
    statoSistemico,
  );

  return (
    <main>
      <div
        className="sidebar"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "350px",
          height: "100%",
          boxSizing: "border-box",
          borderLeft: "1px solid #e0e0e0",
          padding: "20px",
          background: "#ffffff",
          boxShadow: "-4px 0 10px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "#e8f5e9",
            border: "1px solid #c8e6c9",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "15px",
            fontSize: "0.8rem",
            lineHeight: "1.4",
            color: "#2e7d32",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            🩺 ER - Turno di Guardia
          </p>
          <p
            style={{
              margin: "0 0 10px 0",
              fontStyle: "italic",
              color: "#1b5e20",
            }}
          >
            &ldquo;Vesti i panni del Primario in questo incubo cardiovascolare.
            Collega sacche di sangue, stringi lacci emostatici e contrasta gli
            shock iatrogeni oppure fai suonare la nota fissa della Linea
            Piatta!&rdquo;
          </p>
          <hr
            style={{
              border: 0,
              borderTop: "1px solid #c8e6c9",
              margin: "8px 0",
            }}
          />
          <p style={{ margin: "0 0 4px 0" }}>
            • Attiva il suono dal monitor per ascoltare i battiti.
          </p>
          <p style={{ margin: 0 }}>
            Simulazione didattica semplificata. I valori non sono misure
            cliniche.
          </p>
          <p style={{ margin: 0 }}>
            • Seleziona un componente del grafo per esaminare i parametri
            idraulici locali.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span
            style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#555" }}
          >
            MONITORAGGIO PAZIENTE
          </span>
        </div>

        <MonitorEcg statoSistemico={statoSistemico} />
        <CruscottoClinico
          segnali={statoSistemico.segnali}
          verdettoStato={verdettoStato}
          coloreStato={coloreStato}
          tprTotale={tprTotale}
          bpcTotale={bpcTotale}
        />

        {notaEffettoCollaterale && !isArresto && (
          <div
            style={{
              marginBottom: "15px",
              padding: "10px",
              background: "#fff3e0",
              borderLeft: "4px solid #ff9800",
              borderRadius: "4px",
              fontSize: "0.8rem",
              color: "#e65100",
              fontWeight: "bold",
              lineHeight: "1.4",
            }}
          >
            {notaEffettoCollaterale}
          </div>
        )}

        {datiAvanzati ? (
          <DettaglioOrgano datiAvanzati={datiAvanzati} isArresto={isArresto} />
        ) : (
          <div
            style={{
              margin: "auto",
              textAlign: "center",
              color: "#999",
              fontSize: "0.82rem",
              lineHeight: "1.4",
              padding: "0 10px",
            }}
          >
            Seleziona un elemento della rete vascolare per misurare gli effetti
            combinati locali delle patologie attive.
          </div>
        )}
      </div>
      <div className="projects-footer">
        <a href="https://links-page-bennibeni.vercel.app/">
          &larr; All projects
        </a>
      </div>
    </main>
  );
}
