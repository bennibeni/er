// CruscottoClinico.jsx

export default function CruscottoClinico({
  verdettoStato,
  coloreStato,
  tprTotale,
  bpcTotale,
}) {
  return (
    <div
      style={{
        background: "#f8f9fa",
        border: "1px solid #e9ecef",
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: "bold",
          color: "#666",
          marginBottom: "8px",
        }}
      >
        CRUSCOTTO CLINICO CUMULATIVO
      </div>
      <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>
        <strong>Stato Paziente:</strong>{" "}
        <span style={{ color: coloreStato, fontWeight: "bold" }}>
          {verdettoStato}
        </span>
      </p>
      <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>
        <strong>Resistenza Totale (TPR):</strong>{" "}
        <span style={{ fontWeight: "bold" }}>
          {tprTotale}% (
          {tprTotale === 100
            ? "Standard"
            : `${tprTotale > 100 ? "+" : ""}${tprTotale - 100}%`}
          )
        </span>
      </p>
      <p style={{ margin: "4px 0", fontSize: "0.85rem" }}>
        <strong>Indice di perfusione simulato (BPC):</strong>{" "}
        <span
          style={{
            color: bpcTotale <= 60 ? "#d32f2f" : "#222",
            fontWeight: "bold",
          }}
        >
          {bpcTotale}%
        </span>
      </p>
    </div>
  );
}
