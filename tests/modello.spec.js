import assert from 'node:assert/strict';
import { test, expect } from '@playwright/test';
import { calcolaStatoSistemico } from '../app/statoSistemico.js';
import { calcolaDettaglioLocale } from '../app/dettaglioLocale.js';
import { informazioniMediche } from '../app/dataAnatomia.js';
import { scenariAccidentali } from '../app/dataScenari.js';
import { interventiMedici } from '../app/dataCure.js';
import { faseBattito, ampiezzaEcg } from '../app/ecgTiming.js';
import { creaAudioEcg } from '../app/ecgAudio.js';

test('all 512 combinations have consistent bounded state and local details', () => {
    test.setTimeout(60000);
    const scenarios = Object.keys(scenariAccidentali);
    const cures = Object.keys(interventiMedici);
    let count = 0;
    for (let s = 0; s < 16; s++) for (let c = 0; c < 16; c++) for (const sottoSforzo of [false, true]) {
        const input = { scenariAttivi: scenarios.filter((_, i) => s & (1 << i)), cureAttive: cures.filter((_, i) => c & (1 << i)), sottoSforzo };
        const stato = calcolaStatoSistemico(input);
        assert.ok(stato.bpcTotale >= 0);
        assert.ok(stato.bpcTotale <= 100);
        assert.ok(Number.isFinite(stato.tprTotale));
        assert.equal(stato.isArresto, stato.bpcTotale <= 40);
        assert.equal(stato.bpm === 0, stato.isArresto);
        if (stato.effettoCollaterale) assert.ok(stato.bpcTotale < 100);
        assert.deepEqual(calcolaStatoSistemico({ ...input, cureAttive: [...input.cureAttive, ...input.cureAttive] }), stato);
        for (const [id, elemento] of Object.entries(informazioniMediche)) {
            const locale = calcolaDettaglioLocale(id, elemento, stato);
            assert.equal(locale.titolo, elemento.titolo);
            if (stato.isArresto) assert.ok(locale.pressione.includes('assente'));
            if (stato.bpcTotale < 100) assert.ok(!locale.ossigeno.includes('Riferimento a riposo'));
        }
        count++;
    }
    expect(count).toBe(512);
});

test('ineligible treatments cannot improve perfusion; hemorrhage has tachycardia', () => {
    for (const id of ['laccio', 'trombolisi']) {
        expect(calcolaStatoSistemico({ cureAttive: [id] })).toMatchObject({ bpcTotale: 100, tprTotale: 100 });
    }
    expect(calcolaStatoSistemico({ scenariAttivi: ['emorragia'] }).bpm).toBe(120);
    expect(calcolaStatoSistemico({ scenariAttivi: ['unknown'], cureAttive: ['constructor'] })).toEqual(calcolaStatoSistemico());
});

test('local recovery follows therapy without mutating anatomy', () => {
    const baseline = JSON.stringify(informazioniMediche);
    const scenario = { scenariAttivi: ['embolia'] };
    const prima = calcolaDettaglioLocale('Polmoni', informazioniMediche.Polmoni, calcolaStatoSistemico(scenario));
    const dopo = calcolaDettaglioLocale('Polmoni', informazioniMediche.Polmoni, calcolaStatoSistemico({ ...scenario, cureAttive: ['trombolisi'] }));
    expect(prima.ossigeno).toContain('compromesso');
    expect(dopo.ossigeno).toContain('recupero');
    expect(JSON.stringify(informazioniMediche)).toBe(baseline);
    expect(calcolaDettaglioLocale(null, null, calcolaStatoSistemico())).toBeNull();
});

test('ECG timeline is independent of frame rate and does not replay missed beats', () => {
    for (const bpm of [40, 60, 110, 120, 140, 175]) {
        const counts = [30, 60, 144].map(fps => {
            const cycles = new Set();
            for (let frame = 0; frame < fps * 12; frame++) cycles.add(faseBattito(frame * 1000 / fps, bpm).ciclo);
            return cycles.size;
        });
        expect(counts[0]).toBe(counts[1]);
        expect(counts[1]).toBe(counts[2]);
        expect(ampiezzaEcg(60000 / bpm, bpm)).toBeCloseTo(-27);
    }
    expect(faseBattito(10000, 60).ciclo).toBe(10);
    expect(ampiezzaEcg(1000, 0)).toBe(0);
    expect(ampiezzaEcg(-1, 60)).toBe(0);
});

test('audio stops alarms, disconnects sources and closes its context', async () => {
    const oscillators = [];
    let closed = 0;
    class FakeContext {
        state = 'suspended'; currentTime = 0; destination = {};
        async resume() { this.state = 'running'; }
        async close() { this.state = 'closed'; closed++; }
        createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
        createOscillator() {
            const osc = { frequency: { setValueAtTime(value) { osc.hz = value; } }, connect() {}, disconnect() { osc.disconnected = true; }, start() {}, stop() { osc.onended?.(); } };
            oscillators.push(osc); return osc;
        }
    }
    const audio = creaAudioEcg(FakeContext);
    audio.battito(); expect(oscillators).toHaveLength(0);
    await audio.avvia();
    audio.battito(); expect(oscillators[0]).toMatchObject({ hz: 880, disconnected: true });
    audio.arresto(true); audio.arresto(true); expect(oscillators).toHaveLength(2);
    audio.arresto(false); expect(oscillators[1].disconnected).toBe(true);
    audio.arresto(true); audio.chiudi();
    expect(oscillators[2].disconnected).toBe(true);
    expect(closed).toBe(1);
    audio.battito(); expect(oscillators).toHaveLength(3);
});

