import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import * as collectionApi from '../api/collection';
import { searchScryfallCards } from '../api/scryfall';
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
  const [selectedCard, setSelectedCard] = useState<any>(null); // for version picker step
  const [versions, setVersions] = useState<any[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    collectionApi.getCollection(token)
      .then(setCards)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Scryfall search effect (debounced)
  useEffect(() => {
    if (formMode !== 'add' && formMode !== 'edit') {
      setScryfallResults([]);
      return;
    }
    if (!showForm || !scryfallQuery) {
      setScryfallResults([]);
      return;
    }
    setScryfallLoading(true);
    const timeout = setTimeout(() => {
      searchScryfallCards(scryfallQuery).then(setScryfallResults).finally(() => setScryfallLoading(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [scryfallQuery, showForm, formMode]);

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

  // Step 1: Show unique card names in search
  const uniqueCardResults = React.useMemo(() => {
    const seen = new Set();
    return scryfallResults.filter(card => {
      if (seen.has(card.name)) return false;
      seen.add(card.name);
      return true;
    });
  }, [scryfallResults]);

  // Step 2: When a card is selected, fetch all printings/versions
  useEffect(() => {
    if (!selectedCard) return;
    setVersionsLoading(true);
    // Use backend proxy for prints
    import('../api/scryfall').then(api => {
      api.getScryfallPrints(selectedCard.id)
        .then(setVersions)
        .finally(() => setVersionsLoading(false));
    });
  }, [selectedCard]);

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
        uniqueCardResults={uniqueCardResults}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        versions={versions}
        versionsLoading={versionsLoading}
        setFormData={setFormData}
        setScryfallResults={setScryfallResults}
        setShowForm={setShowForm}
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
