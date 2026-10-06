import { test, expect } from "@playwright/test";
import { calcolaStatoSistemico } from "../app/statoSistemico.js";

test("baseline and exercise", () => {
  expect(calcolaStatoSistemico()).toMatchObject({
    bpcTotale: 100,
    tprTotale: 100,
    isArresto: false,
    effettoCollaterale: null,
    ritmoBPM: "60 BPM",
  });
  expect(calcolaStatoSistemico({ sottoSforzo: true }).ritmoBPM).toBe("140 BPM");
});

test("scenarios, treatments and lower clamp", () => {
  for (const [scenariAttivi, cureAttive, bpcTotale, tprTotale, isArresto] of [
    [["emorragia"], [], 65, 150, false],
    [["emorragia"], ["trasfusione"], 95, 140, false],
    [["embolia"], [], 50, 120, false],
    [["embolia"], ["trombolisi"], 95, 115, false],
    [["infarto", "emorragia"], [], 37, 165, true],
    [["amputazione", "emorragia", "embolia", "infarto"], [], 0, 220, true],
  ]) {
    expect(calcolaStatoSistemico({ scenariAttivi, cureAttive })).toMatchObject({
      bpcTotale,
      tprTotale,
      isArresto,
    });
  }
});

test("adverse effects accumulate after benefit cap and preserve both warnings", () => {
  expect(
    calcolaStatoSistemico({ cureAttive: ["adrenalina"], sottoSforzo: true }),
  ).toMatchObject({
    bpcTotale: 65,
    effettoCollaterale: "tossicita-adrenalina",
    ritmoBPM: "175 BPM",
  });
  expect(calcolaStatoSistemico({ cureAttive: ["trasfusione"] })).toMatchObject({
    bpcTotale: 75,
    effettoCollaterale: "sovraccarico-trasfusione",
    ritmoBPM: "110 BPM",
  });
  const combined = calcolaStatoSistemico({
    cureAttive: ["adrenalina", "trasfusione"],
    sottoSforzo: true,
  });
  expect(combined).toMatchObject({
    bpcTotale: 40,
    tprTotale: 140,
    effettoCollaterale: "collasso-farmacologico",
  });
  expect(combined.notaEffettoCollaterale).toContain("STRESS CARDIACO");
  expect(combined.notaEffettoCollaterale).toContain("SOVRACCARICO");
});

test("arrest takes precedence over adverse effects; inputs stay unchanged", () => {
  const scenariAttivi = Object.freeze(["infarto", "emorragia", "embolia"]);
  const cureAttive = Object.freeze(["adrenalina"]);
  expect(
    calcolaStatoSistemico({ scenariAttivi, cureAttive, sottoSforzo: true }),
  ).toMatchObject({
    isArresto: true,
    ritmoBPM: "0 BPM",
    verdettoStato: "Arresto simulato",
  });
});
