import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import * as collectionApi from '../api/collection';
import ScryfallModal from '../components/ScryfallModal';
import { getCardImage } from '../api/scryfall';
import CardImage from '../components/CardImage/CardImage';
import CardDetailsPanel from '../components/CardDetailsPanel/CardDetailsPanel';

// Add finish to CollectionCard type and initialFormState
export interface CollectionCard {
  _id: string;
  scryfallId: string;
  quantity: number;
  condition: string;
  language: string;
  finish: string;
}

const initialFormState = {
  scryfallId: '',
  quantity: 1,
  condition: '',
  language: '',
  finish: '',
};

type FormMode = 'add' | 'edit';

const CollectionPage: React.FC = () => {
  const { token } = useAuth();
  const [cards, setCards] = useState<CollectionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [, setFormData] = useState<any>(initialFormState);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [scryfallResults, setScryfallResults] = useState<any[]>([]);
  const [scryfallQuery, setScryfallQuery] = useState('');
  const [scryfallLoading, setScryfallLoading] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [duplicateChoice, setDuplicateChoice] = useState<null | { existing: CollectionCard, newData: any }>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    collectionApi.getCollection(token)
      .then(setCards)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Scryfall autocomplete effect (debounced)
  useEffect(() => {
    if (!showForm || !scryfallQuery) {
      setAutocompleteOptions([]);
      setShowAutocomplete(false);
      return;
    }
    setShowAutocomplete(true);
    import('../api/scryfall').then(api => {
      api.autocompleteScryfallNames(scryfallQuery)
        .then((options: string[]) => {
          setAutocompleteOptions(options);
        });
    });
  }, [scryfallQuery, showForm]);

  // Scryfall search effect (only after autocomplete selection)
  useEffect(() => {
    if (formMode !== 'add' && formMode !== 'edit') {
      setScryfallResults([]);
      return;
    }
    if (!showForm || !scryfallQuery || showAutocomplete) {
      setScryfallResults([]);
      return;
    }
    setScryfallLoading(true);
    import('../api/scryfall').then(api => {
      api.searchScryfallCards(scryfallQuery)
        .then((results: any[]) => {
          setScryfallResults(results);
        })
        .finally(() => setScryfallLoading(false));
    });
  }, [scryfallQuery, showForm, formMode, showAutocomplete]);

  const openAddForm = () => {
    setFormMode('add');
    setScryfallQuery(''); // Reset search query when opening modal
    setShowForm(true);
    setSelectedId(null);
  };

  const openEditForm = (card: CollectionCard) => {
    setFormMode('edit');
    setShowForm(true);
    setSelectedId(card._id);
  };

  const handleDelete = async () => {
    if (!deleteId || !token) return;
    setProcessing(true);
    try {
      await collectionApi.deleteCollectionCard(token, deleteId);
      setCards((prev) => prev.filter(c => c._id !== deleteId));
      setDeleteId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setScryfallQuery(''); // Reset search query when closing modal
    setAutocompleteOptions([]);
    setScryfallResults([]);
  };

  const normalize = (v: string | undefined | null) => (v || '').toLowerCase().trim();

  // Utility to map Scryfall finish codes to user-friendly labels
  const finishLabels: Record<string, string> = {
    nonfoil: 'Nonfoil',
    foil: 'Foil',
    etched: 'Etched Foil',
    gilded: 'Gilded Foil',
    glossy: 'Glossy',
    matte: 'Matte',
    "double_rainbow": 'Double Rainbow Foil',
    "surgefoil": 'Surge Foil',
    "confetti": 'Confetti Foil',
    "prerelease": 'Prerelease',
    "extendedart": 'Extended Art',
    "showcase": 'Showcase',
    "borderless": 'Borderless',
    "retro": 'Retro Frame',
    "promo": 'Promo',
    "textured": 'Textured Foil',
    "shatterfoil": 'Shatter Foil',
    "rainbow": 'Rainbow Foil',
    "zfoil": 'Z-Foil',
    "stepandcomplete": 'Step-and-Complete Foil',
    "oil": 'Oil Slick',
    "neon": 'Neon Ink',
    "fandemonium": 'Fandemonium',
    "signature": 'Artist Signed',
    "stamped": 'Gold Stamped',
    "oversized": 'Oversized',
    "minigame": 'Minigame',
    "playtest": 'Playtest',
    "misprint": 'Misprint',
    "testprint": 'Test Print',
    "foilstamp": 'Foil Stamp',
    "foil_etched": 'Etched Foil',
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Your Collection</h2>
      <button onClick={openAddForm} style={{ marginBottom: 16 }}>Add Card</button>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Card</th>
              <th>Quantity</th>
              <th>Condition</th>
              <th>Language</th>
              <th>Finish</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => {
              return (
                <tr key={card._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>
                    {/* Render card image with link to Scryfall page */}
                    <CardImage
                      scryfallId={card.scryfallId}
                      imageUrl={`https://api.scryfall.com/cards/${card.scryfallId}?format=image`}
                      alt={card.scryfallId}
                      className="collection-card-image"
                    />
                  </td>
                  <td>{card.quantity}</td>
                  <td>{card.condition}</td>
                  <td>{card.language}</td>
                  <td>{finishLabels[card.finish] || (card.finish ? card.finish.charAt(0).toUpperCase() + card.finish.slice(1) : '')}</td>
                  <td>
                    <button onClick={() => openEditForm(card)}>Edit</button>
                    <button onClick={() => setDeleteId(card._id)} style={{ marginLeft: 8 }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {/* Modal Add/Edit Form */}
      <ScryfallModal
        show={showForm}
        formMode={formMode}
        scryfallQuery={scryfallQuery}
        setScryfallQuery={setScryfallQuery}
        scryfallLoading={scryfallLoading}
        scryfallResults={scryfallResults}
        setFormData={setFormData}
        setShowForm={closeForm}
        collection={cards}
        autocompleteOptions={autocompleteOptions}
        showAutocomplete={showAutocomplete}
        setShowAutocomplete={setShowAutocomplete}
        autocompleteRef={autocompleteRef as React.RefObject<HTMLDivElement>}
        onAutocompleteSelect={name => {
          setScryfallQuery(name);
          setShowAutocomplete(false);
          setAutocompleteOptions([]); // Hide the autocomplete list after selection
        }}
        onSubmit={async (modalFormData) => {
          if (!token) return;
          setProcessing(true);
          try {
            if (formMode === 'add') {
              // Check for duplicate
              const match = cards.find(card =>
                card.scryfallId === modalFormData.scryfallId &&
                normalize(card.language) === normalize(modalFormData.language) &&
                normalize(card.finish) === normalize(modalFormData.finish) &&
                normalize(card.condition) === normalize(modalFormData.condition)
              );
              if (match) {
                setDuplicateChoice({ existing: match, newData: modalFormData });
                setProcessing(false);
                return;
              }
              const newCard = await collectionApi.addCollectionCard(token, modalFormData);
              setCards((prev) => [...prev, newCard]);
            } else if (formMode === 'edit' && selectedId) {
              const updated = await collectionApi.updateCollectionCard(token, selectedId, modalFormData);
              setCards((prev) => prev.map(c => c._id === selectedId ? updated : c));
            }
            setShowForm(false);
          } catch (e: any) {
            setError(e.message);
          } finally {
            setProcessing(false);
          }
        }}
      />
      {/* Delete Confirmation */}
      {deleteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
            <h3>Delete Card</h3>
            <p>Are you sure you want to delete this card?</p>
            <button onClick={handleDelete} disabled={processing}>Delete</button>
            <button onClick={() => setDeleteId(null)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </div>
      )}
      {/* Duplicate Choice Confirmation */}
      {duplicateChoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 340, maxWidth: 400 }}>
            <h3>Duplicate Card Detected</h3>
            <p>This card already exists in your collection with the same language, finish, and condition.</p>
            <p>Would you like to update the quantity or add as a separate entry?</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={async () => {
                  if (!token) return;
                  setProcessing(true);
                  try {
                    const updated = await collectionApi.updateCollectionCard(
                      token,
                      duplicateChoice.existing._id,
                      { quantity: duplicateChoice.existing.quantity + (duplicateChoice.newData.quantity || 1) }
                    );
                    setCards((prev) => prev.map(c => c._id === updated._id ? updated : c));
                    setShowForm(false);
                    setDuplicateChoice(null);
                  } catch (e: any) {
                    setError(e.message);
                  } finally {
                    setProcessing(false);
                  }
                }}
                disabled={processing}
              >Update Quantity</button>
              <button
                onClick={async () => {
                  if (!token) return;
                  setProcessing(true);
                  try {
                    const newCard = await collectionApi.addCollectionCard(token, duplicateChoice.newData);
                    setCards((prev) => [...prev, newCard]);
                    setShowForm(false);
                    setDuplicateChoice(null);
                  } catch (e: any) {
                    setError(e.message);
                  } finally {
                    setProcessing(false);
                  }
                }}
                disabled={processing}
              >Add as Separate Entry</button>
              <button onClick={() => setDuplicateChoice(null)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
