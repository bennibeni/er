export function faseBattito(elapsedMs, bpm) {
  if (bpm <= 0 || elapsedMs < 0) return { ciclo: -1, fase: 0 };
  const cicli = (elapsedMs * bpm) / 60000;
  return { ciclo: Math.floor(cicli), fase: cicli % 1 };
}

// Onda illustrativa: picco R all'inizio di ogni ciclo.
export function ampiezzaEcg(elapsedMs, bpm) {
  if (elapsedMs < 0 || bpm <= 0) return 0;
  const { fase } = faseBattito(elapsedMs, bpm);
  const punti = [
    [0, -27],
    [0.035, 12],
    [0.07, 0],
    [0.2, 0],
    [0.28, -5],
    [0.36, 0],
    [0.78, 0],
    [0.85, -3],
    [0.92, 0],
    [0.97, 5],
    [1, -27],
  ];
  for (let i = 1; i < punti.length; i++) {
    if (fase <= punti[i][0]) {
      const [x0, y0] = punti[i - 1];
      const [x1, y1] = punti[i];
      return y0 + ((y1 - y0) * (fase - x0)) / (x1 - x0);
    }
  }
  return 0;
}
