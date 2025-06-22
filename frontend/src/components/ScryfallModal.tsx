import React from 'react';

interface ScryfallModalProps {
  show: boolean;
  formMode: 'add' | 'edit';
  scryfallQuery: string;
  setScryfallQuery: (q: string) => void;
  scryfallLoading: boolean;
  scryfallResults: any[];
  setFormData: (fn: (prev: any) => any) => void;
  setShowForm: (show: boolean) => void;
  autocompleteOptions?: string[];
  showAutocomplete?: boolean;
  setShowAutocomplete?: (show: boolean) => void;
  autocompleteRef?: React.RefObject<HTMLDivElement>;
  onAutocompleteSelect?: (name: string) => void;
}

const ScryfallModal: React.FC<ScryfallModalProps> = ({
  show,
  formMode,
  scryfallQuery,
  setScryfallQuery,
  scryfallLoading,
  scryfallResults,
  setFormData,
  setShowForm,
  autocompleteOptions = [],
  showAutocomplete = false,
  setShowAutocomplete = () => {},
  autocompleteRef,
  onAutocompleteSelect = () => {},
}) => {
  if (!show) return null;

  // Hide autocomplete immediately on click (before React event batching)
  const handleAutocompleteClick = (name: string) => {
    if (onAutocompleteSelect) onAutocompleteSelect(name);
    setShowAutocomplete(false);
    setTimeout(() => setShowAutocomplete(false), 0); // Defensive: ensure it closes even if parent state lags
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <form onSubmit={e => e.preventDefault()} style={{ background: '#fff', padding: 32, borderRadius: 12, width: 800, height: 700, boxShadow: '0 4px 32px #0003', display: 'flex', flexDirection: 'column', maxWidth: '90vw', maxHeight: '90vh', overflow: 'hidden' }}>
        <h2 style={{ marginTop: 0 }}>{formMode === 'add' ? 'Add Card' : 'Edit Card'}</h2>
        <div style={{ position: 'relative' }}>
          <label style={{ fontWeight: 500, fontSize: 18 }}>Card Search<br />
            <input
              type="text"
              value={scryfallQuery}
              onChange={e => {
                setScryfallQuery(e.target.value);
                setShowAutocomplete(true);
              }}
              placeholder="Search Scryfall..."
              style={{ width: '100%', fontSize: 18, padding: 8, marginTop: 4, marginBottom: 12, borderRadius: 4, border: '1px solid #ccc' }}
              autoFocus
              autoComplete="off"
            />
          </label>
          {showAutocomplete && autocompleteOptions.length > 0 && (
            <div ref={autocompleteRef} style={{ position: 'absolute', left: 0, right: 0, top: 56, background: '#fff', border: '1px solid #ccc', borderRadius: 4, zIndex: 10, maxHeight: 240, overflowY: 'auto', boxShadow: '0 2px 12px #0002' }}>
              {autocompleteOptions.map((name, idx) => (
                <div
                  key={name + idx}
                  style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 16, borderBottom: idx !== autocompleteOptions.length - 1 ? '1px solid #eee' : undefined }}
                  onMouseDown={e => { e.preventDefault(); handleAutocompleteClick(name); }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
        {scryfallLoading && <div style={{ margin: '12px 0', fontSize: 18 }}>Searching...</div>}
        {scryfallResults.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            maxHeight: 1200, // Show more cards before scrolling
            overflowY: 'auto',
            border: '1px solid #eee',
            margin: '16px 0',
            background: '#fafafa',
            borderRadius: 8,
            padding: 16
          }}>
            {scryfallResults.map(card => (
              <div
                key={card.id}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 8, cursor: 'pointer', border: '1px solid #ddd', borderRadius: 6, background: '#fff', transition: 'box-shadow 0.2s', boxShadow: '0 1px 6px #0001',
                }}
                onClick={() => {
                  setFormData((prev: any) => ({ ...prev, scryfallId: card.id }));
                  setShowForm(false);
                }}
              >
                {card.image_uris?.normal && <img src={card.image_uris.normal} alt={card.name} style={{ width: 160, height: 222, objectFit: 'cover', borderRadius: 4, boxShadow: '0 2px 8px #0002' }} />}
                <div style={{ fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{card.name}</div>
                <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{card.set_name} ({card.set.toUpperCase()})</div>
                <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{card.lang.toUpperCase()} • #{card.collector_number}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setShowForm(false)} style={{ fontSize: 18, padding: '8px 24px' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ScryfallModal;
