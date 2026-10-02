// LogoEr.jsx

export default function LogoEr() {
    return (
        <div className="logo-er" style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)', // Centratura orizzontale esatta
            zIndex: 10,
            background: '#1a1f2c', // Sfondo scuro stile monitor medico
            padding: '4px 24px',
            borderRadius: '20px',  // Angoli arrotondati a capsula
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            border: '1px solid #37474f',
            width: '180px',       // Stretto e allungato
            height: '45px',       // Sottile per non rubare spazio ai nodi superiori
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                {/* Lettere Monumentali Rosse */}
                <span style={{ fontSize: '2rem', fontWeight: '900', color: '#e53935', letterSpacing: '6px', fontStyle: 'italic', zIndex: 11, lineHeight: 1 }}>
                    ER
                </span>

                {/* Tracciato ECG Neon Verde Sovrapposto */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 12, pointerEvents: 'none' }} viewBox="0 0 100 50">
                    <path
                        d="M 5,25 L 32,25 L 37,20 L 41,30 L 46,5 L 53,45 L 58,22 L 64,25 L 95,25"
                        fill="none"
                        stroke="#4cd964"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0px 0px 3px #4cd964)' }}
                    />
                </svg>
            </div>
        </div>
    );
}
