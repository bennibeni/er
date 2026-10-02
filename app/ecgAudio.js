// Il monitor invoca battito dalla stessa timeline usata dal canvas.
export function creaAudioEcg(AudioContextClass) {
    const ctx = new AudioContextClass();
    const attivi = new Set();
    let allarme = null;
    let chiuso = false;
    const stop = osc => { try { osc.stop(); } catch { /* Già terminato. */ } };
    function tono(frequenza, continuo = false) {
        if (chiuso || ctx.state !== 'running') return null;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(frequenza, ctx.currentTime);
        gain.gain.setValueAtTime(continuo ? .025 : .06, ctx.currentTime);
        if (!continuo) gain.gain.exponentialRampToValueAtTime(.00001, ctx.currentTime + .1);
        osc.connect(gain); gain.connect(ctx.destination);
        attivi.add(osc);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); attivi.delete(osc); };
        osc.start();
        if (!continuo) osc.stop(ctx.currentTime + .1);
        return osc;
    }
    return {
        async avvia() { await ctx.resume(); },
        battito() { tono(880); },
        arresto(attivo) {
            if (!attivo && allarme) { stop(allarme); allarme = null; }
            if (attivo && !allarme) allarme = tono(540, true);
        },
        chiudi() {
            chiuso = true;
            for (const osc of attivi) stop(osc);
            attivi.clear(); allarme = null;
            void ctx.close().catch(() => {});
        },
    };
}

