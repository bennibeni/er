// PannelloControllo.jsx

export default function PannelloControllo({
    sottoSforzo,
    setSottoSforzo,
    scenariAttivi = [],
    gestisciCambioScenario,
    scenariAccidentali = {}
}) {
    const disabilitaAttivita = scenariAttivi.includes('emorragia') || scenariAttivi.includes('infarto');

    return (
        <div className="pannello-controllo" style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'none'
        }}>

            {/* SEZIONE 1: REGOLAZIONE ATTIVITÀ (260px) */}
            <div style={{
                background: '#ffffff',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.11)',
                border: '1px solid #dcdcdc',
                width: '300px',
                boxSizing: 'border-box',
                pointerEvents: 'auto'
            }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#777', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    REGOLAZIONE ATTIVITA
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        onClick={() => setSottoSforzo(false)}
                        disabled={disabilitaAttivita}
                        style={{
                            flex: 1, padding: '8px 4px',
                            background: !sottoSforzo ? '#e3f2fd' : '#f5f5f5',
                            border: !sottoSforzo ? '1px solid #2196f3' : '1px solid #ccc',
                            color: !sottoSforzo ? '#1565c0' : '#666',
                            borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold',
                            opacity: disabilitaAttivita ? 0.5 : 1
                        }}
                    >
                        🫀 Riposo
                    </button>
                    <button
                        onClick={() => setSottoSforzo(true)}
                        disabled={disabilitaAttivita}
                        style={{
                            flex: 1, padding: '8px 4px',
                            background: sottoSforzo ? '#ffebee' : '#f5f5f5',
                            border: sottoSforzo ? '1px solid #f44336' : '1px solid #ccc',
                            color: sottoSforzo ? '#c62828' : '#666',
                            borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold',
                            opacity: disabilitaAttivita ? 0.5 : 1
                        }}
                    >
                        🏃‍♂️ Sforzo
                    </button>
                </div>
            </div>

            {/* SEZIONE 2: ALTERAZIONI E TRAUMI CRITICI (260px) */}
            <div style={{
                background: '#ffffff',
                padding: '12px 14px',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.11)',
                border: '1px solid #dcdcdc',
                width: '300px',
                boxSizing: 'border-box',
                pointerEvents: 'auto'
            }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#777', marginBottom: '10px', letterSpacing: '0.5px' }}>
                    ALTERAZIONI E TRAUMI CRITICI
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                    {Object.values(scenariAccidentali).map((scenario) => (
                        <label
                            key={scenario.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                color: '#333',
                                width: '100%',
                                margin: 0,
                                boxSizing: 'border-box'
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={scenariAttivi.includes(scenario.id)}
                                onChange={() => gestisciCambioScenario(scenario.id)}
                                style={{
                                    cursor: 'pointer',
                                    margin: 0,
                                    padding: 0,
                                    width: '14px',
                                    height: '14px',
                                    flexShrink: 0,
                                    boxSizing: 'border-box'
                                }}
                            />
                            <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>{scenario.icona}</span>
                            <span style={{ whiteSpace: 'nowrap', flexGrow: 1, boxSizing: 'border-box' }}>
                                {scenario.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
}
