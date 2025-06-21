import React from 'react';

interface ScryfallModalProps {
  show: boolean;
  formMode: 'add' | 'edit';
  scryfallQuery: string;
  setScryfallQuery: (q: string) => void;
  scryfallLoading: boolean;
  uniqueCardResults: any[];
  selectedCard: any;
  setSelectedCard: (card: any) => void;
  versions: any[];
  versionsLoading: boolean;
  setFormData: (fn: (prev: any) => any) => void;
  setScryfallResults: (results: any[]) => void;
  setShowForm: (show: boolean) => void;
}

const ScryfallModal: React.FC<ScryfallModalProps> = ({
  show,
  formMode,
  scryfallQuery,
  setScryfallQuery,
  scryfallLoading,
  uniqueCardResults,
  selectedCard,
  setSelectedCard,
  versions,
  versionsLoading,
  setFormData,
  setScryfallResults,
  setShowForm,
}) => {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <form onSubmit={e => e.preventDefault()} style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 600, maxWidth: 900, width: '90vw', boxShadow: '0 4px 32px #0003', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ marginTop: 0 }}>{formMode === 'add' ? 'Add Card' : 'Edit Card'}</h2>
        {/* Step 1: Card Search (unique names) */}
        {!selectedCard && (
          <>
            <div>
              <label style={{ fontWeight: 500, fontSize: 18 }}>Card Search<br />
                <input
                  type="text"
                  value={scryfallQuery}
                  onChange={e => setScryfallQuery(e.target.value)}
                  placeholder="Search Scryfall..."
                  style={{ width: '100%', fontSize: 18, padding: 8, marginTop: 4, marginBottom: 12, borderRadius: 4, border: '1px solid #ccc' }}
                  autoFocus
                />
              </label>
            </div>
            {scryfallLoading && <div style={{ margin: '12px 0', fontSize: 18 }}>Searching...</div>}
            {uniqueCardResults.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 20,
                maxHeight: 400,
                overflowY: 'auto',
                border: '1px solid #eee',
                margin: '16px 0',
                background: '#fafafa',
                borderRadius: 8,
                padding: 16
              }}>
                {uniqueCardResults.map(card => (
                  <div
                    key={card.id}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 8, cursor: 'pointer', border: '1px solid #ddd', borderRadius: 6, background: '#fff', transition: 'box-shadow 0.2s', boxShadow: '0 1px 6px #0001',
                    }}
                    onClick={() => setSelectedCard(card)}
                  >
                    {card.image && <img src={card.image} alt={card.name} style={{ width: 160, height: 222, objectFit: 'cover', borderRadius: 4, boxShadow: '0 2px 8px #0002' }} />}
                    <div style={{ fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{card.name}</div>
                    <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{card.set}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Step 2: Version Picker */}
        {selectedCard && (
          <>
            <div style={{ marginBottom: 16 }}>
              <button type="button" onClick={() => setSelectedCard(null)} style={{ marginBottom: 8 }}>&larr; Back to search</button>
              <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Select a Version</div>
              {versionsLoading && <div>Loading versions...</div>}
              {versions.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 20,
                  maxHeight: 400,
                  overflowY: 'auto',
                  border: '1px solid #eee',
                  background: '#fafafa',
                  borderRadius: 8,
                  padding: 16
                }}>
                  {versions.map(card => (
                    <div
                      key={card.id}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 8, cursor: 'pointer', border: '1px solid #ddd', borderRadius: 6, background: '#fff', transition: 'box-shadow 0.2s', boxShadow: '0 1px 6px #0001' }}
                      onClick={() => {
                        setFormData((prev: any) => ({ ...prev, scryfallId: card.id }));
                        setScryfallQuery(card.name);
                        setScryfallResults([]);
                        setSelectedCard(null);
                        setShowForm(false); // Optionally close modal or proceed to next step
                      }}
                    >
                      {card.image_uris?.normal && <img src={card.image_uris.normal} alt={card.name} style={{ width: 160, height: 222, objectFit: 'cover', borderRadius: 4, boxShadow: '0 2px 8px #0002' }} />}
                      <div style={{ fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{card.set_name} ({card.set.toUpperCase()})</div>
                      <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{card.lang.toUpperCase()} • #{card.collector_number}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setShowForm(false)} style={{ fontSize: 18, padding: '8px 24px' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ScryfallModal;
