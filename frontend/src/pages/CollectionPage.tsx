import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import * as collectionApi from '../api/collection';
import ScryfallModal from '../components/ScryfallModal';

interface CollectionCard {
  _id: string;
  scryfallId: string;
  quantity: number;
  condition: string;
  language: string;
  location?: string;
  notes?: string;
}

const initialFormState = {
  scryfallId: '',
  quantity: 1,
  condition: '',
  language: '',
  location: '',
  notes: '',
};

type FormMode = 'add' | 'edit';

const CollectionPage: React.FC = () => {
  const { token } = useAuth();
  const [cards, setCards] = useState<CollectionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [formData, setFormData] = useState<any>(initialFormState);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [scryfallResults, setScryfallResults] = useState<any[]>([]);
  const [scryfallQuery, setScryfallQuery] = useState('');
  const [scryfallLoading, setScryfallLoading] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
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
    setFormData(initialFormState);
    setShowForm(true);
    setSelectedId(null);
  };

  const openEditForm = (card: CollectionCard) => {
    setFormMode('edit');
    setFormData({ ...card });
    setShowForm(true);
    setSelectedId(card._id);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProcessing(true);
    try {
      if (formMode === 'add') {
        const newCard = await collectionApi.addCollectionCard(token, formData);
        setCards((prev) => [...prev, newCard]);
      } else if (formMode === 'edit' && selectedId) {
        const updated = await collectionApi.updateCollectionCard(token, selectedId, formData);
        setCards((prev) => prev.map(c => c._id === selectedId ? updated : c));
      }
      setShowForm(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
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
    setScryfallQuery('');
    setAutocompleteOptions([]);
    setScryfallResults([]);
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
              <th>Location</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => {
              return (
                <tr key={card._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>
                    {card.scryfallId}
                  </td>
                  <td>{card.quantity}</td>
                  <td>{card.condition}</td>
                  <td>{card.language}</td>
                  <td>{card.location || ''}</td>
                  <td>{card.notes || ''}</td>
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
        autocompleteOptions={autocompleteOptions}
        showAutocomplete={showAutocomplete}
        setShowAutocomplete={setShowAutocomplete}
        autocompleteRef={autocompleteRef as React.RefObject<HTMLDivElement>}
        onAutocompleteSelect={name => {
          setScryfallQuery(name);
          setShowAutocomplete(false);
          setAutocompleteOptions([]); // Hide the autocomplete list after selection
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
    </div>
  );
};

export default CollectionPage;
