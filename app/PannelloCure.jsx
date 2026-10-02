// PannelloCure.jsx
import { useState } from 'react';

export default function PannelloCure({
    interventiMedici = {},
    cureAttive = [],
    scenariAttivi = [],
    gestisciCura,
    pazienteMorto
}) {
    const [idHover, setIdHover] = useState(null);

    return (
        <div className="pannello-cure" style={{
            position: 'absolute',
            top: '295px',
            left: '20px',
            zIndex: 10,
            background: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.11)',
            border: '1px solid #dcdcdc',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '300px',
            boxSizing: 'border-box'
        }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555', marginBottom: '4px', letterSpacing: '0.5px' }}>
                🚨 INTERVENTI E CURE DI EMERGENZA
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.values(interventiMedici).map((cura) => {
                    const giaAttiva = cureAttive.includes(cura.id);
                    const isHovered = idHover === cura.id;

                    const esIdonea = cura.condizioneNecessaria === null || scenariAttivi.includes(cura.condizioneNecessaria);
                    let coloreTestoDinamico = esIdonea ? '#2e7d32' : '#c62828';

                    let coloreSfondoDinamico = '#fffde7';
                    let stileBordoDinamico = esIdonea ? '1px solid #c8e6c9' : '1px solid #ffcdd2';

                    if (giaAttiva) {
                        coloreSfondoDinamico = '#f5f5f5';
                        coloreTestoDinamico = '#757575';
                        stileBordoDinamico = '1px solid #e0e0e0';

                        if (pazienteMorto) {
                            coloreSfondoDinamico = '#ffebee';
                            coloreTestoDinamico = '#b71c1c';
                            stileBordoDinamico = '1px solid #ef9a9a';
                        }
                    } else if (isHovered) {
                        coloreSfondoDinamico = '#ffffff';
                        stileBordoDinamico = esIdonea ? '1px solid #2e7d32' : '1px solid #c62828';
                    }

                    return (
                        <button
                            key={cura.id}
                            disabled={pazienteMorto}
                            aria-pressed={giaAttiva}
                            onClick={() => gestisciCura(cura.id)}
                            onMouseEnter={() => setIdHover(cura.id)}
                            onMouseLeave={() => setIdHover(null)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                border: stileBordoDinamico,
                                background: coloreSfondoDinamico,
                                color: coloreTestoDinamico,
                                boxShadow: isHovered && !giaAttiva ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                transition: 'all 0.2s ease-in-out',
                                textAlign: 'left',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            {/* ASSE SPAZIALE RIGIDO: Mostra l'icona solo se la cura è somministrata, altrimenti lascia lo spazio vuoto allineato */}
                            <div style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                                flexShrink: 0
                            }}>
                                {giaAttiva ? cura.icona : ''}
                            </div>

                            <div style={{ flexGrow: 1 }}>
                                <div style={{ lineHeight: '1.2' }}>{cura.label}</div>

                                {giaAttiva && !pazienteMorto && (
                                    <span style={{ fontSize: '0.65rem', color: '#616161', display: 'block', fontWeight: 'normal', marginTop: '2px' }}>
                                        ● Somministrato (In Circolo)
                                    </span>
                                )}
                                {pazienteMorto && giaAttiva && (
                                    <span style={{ fontSize: '0.65rem', color: '#b71c1c', display: 'block', fontWeight: 'normal', marginTop: '2px' }}>
                                        ● Inefficace (Arresto)
                                    </span>
                                )}
                                {!giaAttiva && !pazienteMorto && (
                                    <span style={{ fontSize: '0.65rem', color: esIdonea ? '#558b2f' : '#b71c1c', display: 'block', fontWeight: 'normal', marginTop: '2px' }}>
                                        {esIdonea ? '✓ Trattamento Idoneo' : '✗ Non Idoneo'}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

    );
}
