import React, { useRef, useEffect, useState } from 'react';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [foilType, setFoilType] = useState<string | null>(null);

  // Close modal on outside click
  useEffect(() => {
    if (!show) return;
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowForm(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [show, setShowForm]);

  // Default foilType to nonfoil if available and not already set
  useEffect(() => {
    if (!selectedCard) return;
    const finishes = getFinishes(selectedCard);
    if (finishes.length > 1 && !foilType) {
      const nonfoil = finishes.find(f => f.key === 'nonfoil');
      if (nonfoil) {
        setFoilType('nonfoil');
        setFormData((prev: any) => ({ ...prev, foilType: 'nonfoil', finish: 'nonfoil' }));
      }
    }
    // Only run when selectedCard or foilType changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard, foilType]);

  if (!show) return null;

  // Hide autocomplete immediately on click (before React event batching)
  const handleAutocompleteClick = (name: string) => {
    if (onAutocompleteSelect) onAutocompleteSelect(name);
    setShowAutocomplete(false);
    setTimeout(() => setShowAutocomplete(false), 0); // Defensive: ensure it closes even if parent state lags
  };

  // When a print is selected, show details form; allow going back to search
  const handleCardSelect = (card: any) => {
    setSelectedCard(card);
    setFormData((prev: any) => ({ ...prev, scryfallId: card.id }));
    // Auto-select if only one option, else require user to pick
    const finishes = card.finishes || [];
    if (finishes.length === 1) {
      setFoilType(finishes[0]);
      setFormData((prev: any) => ({ ...prev, foilType: finishes[0], finish: finishes[0] }));
    } else if (finishes.length > 1) {
      // Prefer nonfoil if available, else leave null for user to pick
      if (finishes.includes('nonfoil')) {
        setFoilType('nonfoil');
        setFormData((prev: any) => ({ ...prev, foilType: 'nonfoil', finish: 'nonfoil' }));
      } else {
        setFoilType(null);
      }
    }
  };

  const handleBackToSearch = () => {
    setSelectedCard(null);
    setFormData((prev: any) => ({ ...prev, scryfallId: '' }));
  };

  // Helper to get available finishes for a card (future-proof, all Scryfall finishes)
  const FINISH_LABELS: Record<string, string> = {
    nonfoil: 'Non-Foil',
    foil: 'Foil',
    etched: 'Etched',
    glossy: 'Glossy',
    surgefoil: 'Surgefoil',
    textured: 'Textured',
    'shattered glass': 'Shattered Glass',
    confetti: 'Confetti',
    'rainbow foiled': 'Rainbow Foil',
    prerelease: 'Prerelease',
    borderless: 'Borderless',
    'extended art': 'Extended Art',
  };
  function getFinishes(card: any): { key: string; label: string }[] {
    if (!card.finishes) return [];
    const promoTypes: string[] = card.promo_types || [];
    return card.finishes.map((finish: string) => {
      if (finish === 'foil') {
        if (promoTypes.includes('doublerainbow')) {
          return { key: 'doublerainbow', label: 'Double Rainbow Foil' };
        } else if (promoTypes.includes('surgefoil')) {
          return { key: 'surgefoil', label: 'Surgefoil' };
        } else if (promoTypes.includes('rainbow foiled')) {
          return { key: 'rainbow foiled', label: 'Rainbow Foil' };
        } else {
          return { key: 'foil', label: 'Foil' };
        }
      }
      return {
        key: finish,
        label: FINISH_LABELS[finish] || finish.charAt(0).toUpperCase() + finish.slice(1)
      };
    });
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div ref={modalRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <form onSubmit={e => e.preventDefault()} style={{ background: '#fff', padding: 32, borderRadius: 12, width: 800, height: 700, boxShadow: '0 4px 32px #0003', display: 'flex', flexDirection: 'column', maxWidth: '90vw', maxHeight: '90vh', overflow: 'hidden', position: 'relative' }}>
          <h2 style={{ marginTop: 0 }}>{formMode === 'add' ? 'Add Card' : 'Edit Card'}</h2>
          {!selectedCard ? (
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
              {scryfallLoading && (
                <div style={{ position: 'absolute', right: 10, top: 10 }}>
                  <span className="loader" style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid #ccc', borderTop: '3px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
              )}
              {showAutocomplete && autocompleteOptions.length > 0 && (
                <div
                  ref={autocompleteRef}
                  style={{ position: 'absolute', left: 0, right: 0, top: 56, background: '#fff', border: '1px solid #ccc', borderRadius: 4, zIndex: 10, maxHeight: 240, overflowY: 'auto', boxShadow: '0 2px 12px #0002' }}
                  onMouseDown={e => e.stopPropagation()} // Prevent outside click handler from firing
                >
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
              {scryfallResults.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 20,
                  maxHeight: 1200,
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
                      onClick={() => handleCardSelect(card)}
                    >
                      {card.image_uris?.normal && <img src={card.image_uris.normal} alt={card.name} style={{ width: 160, height: 222, objectFit: 'cover', borderRadius: 4, boxShadow: '0 2px 8px #0002' }} />}
                      <div style={{ fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{card.name}</div>
                      <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{card.set_name} ({card.set.toUpperCase()})</div>
                      <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{card.lang.toUpperCase()} • #{card.collector_number}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <button type="button" onClick={handleBackToSearch} style={{ alignSelf: 'flex-start', marginBottom: 16 }}>&larr; Back to search</button>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24 }}>
                {selectedCard.image_uris?.normal && <img src={selectedCard.image_uris.normal} alt={selectedCard.name} style={{ width: 160, height: 222, objectFit: 'cover', borderRadius: 4, boxShadow: '0 2px 8px #0002' }} />}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 20 }}>{selectedCard.name}</div>
                  <div style={{ color: '#888', fontSize: 16 }}>{selectedCard.set_name} ({selectedCard.set.toUpperCase()})</div>
                  <div style={{ color: '#888', fontSize: 16 }}>{selectedCard.lang.toUpperCase()} • #{selectedCard.collector_number}</div>
                  <div style={{ color: '#1976d2', fontWeight: 500, fontSize: 15, marginTop: 6 }}>
                    {/* Show finish options as a selector if more than one is available */}
                    {(() => {
                      const finishes = getFinishes(selectedCard);
                      if (finishes.length > 1) {
                        return (
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {finishes.map(option => (
                              <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <input
                                  type="radio"
                                  name="foilType"
                                  value={option.key}
                                  checked={foilType === option.key}
                                  onChange={() => {
                                    setFoilType(option.key);
                                    setFormData((prev: any) => ({ ...prev, foilType: option.key, finish: option.key }));
                                  }}
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        );
                      } else if (finishes.length === 1) {
                        setTimeout(() => {
                          setFoilType(finishes[0].key);
                          setFormData((prev: any) => ({ ...prev, foilType: finishes[0].key, finish: finishes[0].key }));
                        }, 0);
                        return finishes[0].label;
                      }
                      return '';
                    })()}
                  </div>
                </div>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setFormData((prev: any) => ({ ...prev, scryfallId: selectedCard.id }));
                  setShowForm(false);
                }}
                style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {/* Finish selection if multiple options */}
                {/* Removed duplicate finish selector; handled above with "Version:" label */}
                {/* Require foilType selection if multiple options */}
                {(selectedCard.foil && selectedCard.nonfoil) || selectedCard.surgefoil ? (
                  <div style={{ color: foilType ? '#222' : '#d32f2f', fontSize: 14, marginBottom: 4 }}>
                    {foilType ? '' : 'Please select a version above.'}
                  </div>
                ) : null}
                <label>
                  Quantity
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    onChange={e => setFormData((prev: any) => ({ ...prev, quantity: Number(e.target.value) }))}
                    style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
                  />
                </label>
                <label>
                  Condition
                  <select
                    defaultValue="NM"
                    onChange={e => setFormData((prev: any) => ({ ...prev, condition: e.target.value }))}
                    style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
                  >
                    <option value="NM">Near Mint</option>
                    <option value="EX">Excellent</option>
                    <option value="VG">Very Good</option>
                    <option value="G">Good</option>
                    <option value="P">Played</option>
                    <option value="HP">Heavily Played</option>
                  </select>
                </label>
                <label>
                  Language
                  <input
                    type="text"
                    defaultValue={selectedCard.lang?.toUpperCase() || 'EN'}
                    onChange={e => setFormData((prev: any) => ({ ...prev, language: e.target.value }))}
                    style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
                  />
                </label>
                <button
                  type="submit"
                  style={{ fontSize: 18, padding: '10px 0', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', marginTop: 12 }}
                  disabled={((selectedCard.foil && selectedCard.nonfoil) || selectedCard.surgefoil) && !foilType}
                >
                  Add to Collection
                </button>
              </form>
            </div>
          )}
          <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ fontSize: 18, padding: '8px 24px' }}>Cancel</button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScryfallModal;
