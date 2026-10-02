// DettaglioOrgano.jsx

export default function DettaglioOrgano({ datiAvanzati, isArresto }) {
    if (!datiAvanzati) {
        return (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
                Seleziona un elemento della rete vascolare per misurare gli effetti combinati locali delle patologie attive.
            </div>
        );
    }

    return (
        <div>
            <h2 style={{ color: '#333', fontSize: '1.25rem', margin: '0 0 5px 0' }}>{datiAvanzati.titolo}</h2>
            <span style={{ display: 'inline-block', padding: '3px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', background: '#f1f3f5', color: '#495057', marginBottom: '15px' }}>
                {datiAvanzati.tipo}
            </span>
            <div style={{ background: isArresto ? '#f5f5f5' : '#fff5f5', padding: '10px', borderRadius: '6px', marginBottom: '15px', border: isArresto ? '1px solid #e0e0e0' : '1px solid #ffe3e3' }}>
                <p style={{ margin: '3px 0', fontSize: '0.85rem' }}><strong>Pressione Locale:</strong> {datiAvanzati.pressione}</p>
                <p style={{ margin: '3px 0', fontSize: '0.85rem' }}><strong>Saturazione O2:</strong> {datiAvanzati.ossigeno}</p>
            </div>
            <h3 style={{ fontSize: '0.9rem', color: '#495057', margin: '0 0 4px 0' }}>Fisiopatologia</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.4', color: '#666', margin: 0 }}>{datiAvanzati.descrizione}</p>
        </div>
    );
}
