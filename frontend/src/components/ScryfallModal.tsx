import React, { useRef, useEffect, useState } from 'react';
// Removed unused imports for a clean codebase
import { useScryfallModalForm } from '../hooks/useScryfallModalForm';
import { useSelectedCard } from '../hooks/useSelectedCard';
import DuplicateDialog from '../components/DuplicateDialog/DuplicateDialog';
import { useDuplicateDetection } from '../hooks/useDuplicateDetection';
import ScryfallSearch from '../components/ScryfallSearch/ScryfallSearch';
import CardDetailsPanel from './CardDetailsPanel/CardDetailsPanel';
import CardImage from './CardImage/CardImage';

interface ScryfallModalProps {
  show: boolean;
  formMode: 'add' | 'edit';
  scryfallQuery: string;
  setScryfallQuery: (q: string) => void;
  scryfallLoading: boolean;
  scryfallResults: any[];
  setFormData: (fn: (prev: any) => any) => void;
  setShowForm: (show: boolean) => void;
  collection: any[]; // <-- Add this prop
  autocompleteOptions?: string[];
  showAutocomplete?: boolean;
  setShowAutocomplete?: (show: boolean) => void;
  autocompleteRef?: React.RefObject<HTMLDivElement>;
  onAutocompleteSelect?: (name: string) => void;
  onSubmit?: (formData: any) => void;
}

// Custom hook to track previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
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
  collection,
  autocompleteOptions = [],
  showAutocomplete = false,
  setShowAutocomplete = () => {},
  autocompleteRef,
  onAutocompleteSelect = () => {},
  onSubmit = () => {},
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const languageGroupRef = useRef<HTMLDivElement>(null!); // Use non-null assertion to match downstream types
  const [foilType, setFoilType] = useState<string | null>(null);
  const { formData: localFormData, setFormData: setLocalFormData, handleChange, reset } = useScryfallModalForm({ quantity: 1, language: 'EN', condition: 'NM', finish: '' });
  // Replace selectedCard and setSelectedCard with useSelectedCard
  const { selectedCard, setSelectedCard } = useSelectedCard();
  // Remove useModalVisibility, use show prop directly
  const modalVisible = show;
  const closeModal = () => setShowForm(false);
  const { duplicate, checkDuplicate, resetDuplicate } = useDuplicateDetection(collection, localFormData);
  const prevModalVisible = usePrevious(modalVisible);

  // Close autocomplete dropdown on outside click
  useEffect(() => {
    if (!showAutocomplete) return;
    function handleClick(e: MouseEvent) {
      const autoRef = (autocompleteRef as React.RefObject<HTMLDivElement>) || fallbackRef;
      // If click is outside the autocomplete dropdown, close it
      if (autoRef.current && !autoRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAutocomplete, autocompleteRef, fallbackRef, setShowAutocomplete]);

  // Only reset modal state when transitioning from closed to open
  useEffect(() => {
    if (modalVisible && !prevModalVisible) {
      setSelectedCard(null);
      setFoilType(null);
      reset({ quantity: 1, language: 'EN', condition: 'NM', finish: '' });
    } else if (!modalVisible && prevModalVisible) {
      setSelectedCard(null);
      setFoilType(null);
      reset({ quantity: 1, language: 'EN', condition: 'NM', finish: '' });
    }
  }, [modalVisible, prevModalVisible, reset, setSelectedCard]);

  if (!modalVisible) return null;

  // Hide autocomplete immediately on click (before React event batching)
  const handleAutocompleteClick = (name: string) => {
    if (onAutocompleteSelect) onAutocompleteSelect(name);
    setShowAutocomplete(false);
    setTimeout(() => setShowAutocomplete(false), 0); // Defensive: ensure it closes even if parent state lags
  };

  // When a print is selected, show details form; allow going back to search
  const handleCardSelect = (card: any) => {
    setSelectedCard(card);
    setLocalFormData((prev: any) => ({ ...prev, scryfallId: card.id }));
    // Auto-select if only one option, else require user to pick
    const finishes = card.finishes || [];
    if (finishes.length === 1) {
      setFoilType(finishes[0]);
      setLocalFormData((prev: any) => ({ ...prev, foilType: finishes[0], finish: finishes[0] }));
    } else if (finishes.length > 1) {
      // Prefer nonfoil if available, else leave null for user to pick
      if (finishes.includes('nonfoil')) {
        setFoilType('nonfoil');
        setLocalFormData((prev: any) => ({ ...prev, foilType: 'nonfoil', finish: 'nonfoil' }));
      } else {
        setFoilType(null);
      }
    }
  };

  const handleBackToSearch = () => {
    setSelectedCard(null);
    setLocalFormData((prev: any) => ({ ...prev, scryfallId: '' }));
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div ref={modalRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 4px 32px #0003', width: 1200, maxWidth: '98vw', minWidth: 400, padding: 32 }}>
        {/* Removed outer form, moved styles to this div */}
        <h2 style={{ marginTop: 0 }}>{formMode === 'add' ? 'Add Card' : 'Edit Card'}</h2>
        {!selectedCard ? (
          // If there is only one scryfall result, auto-select it and skip print selection
          scryfallResults.length === 1 ? (
            (() => {
              handleCardSelect(scryfallResults[0]);
              return null;
            })()
          ) : (
            <ScryfallSearch
              scryfallQuery={scryfallQuery}
              setScryfallQuery={setScryfallQuery}
              scryfallLoading={scryfallLoading}
              scryfallResults={scryfallResults}
              autocompleteOptions={autocompleteOptions}
              showAutocomplete={showAutocomplete}
              setShowAutocomplete={setShowAutocomplete}
              autocompleteRef={(autocompleteRef as React.RefObject<HTMLDivElement>) || fallbackRef}
              onAutocompleteSelect={handleAutocompleteClick}
              onCardSelect={handleCardSelect}
            />
          )
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (selectedCard) {
                const data = { ...localFormData, scryfallId: selectedCard.id, finish: foilType };
                if (checkDuplicate()) {
                  // Show duplicate dialog
                  return;
                }
                await onSubmit(data);
                // Reset modal state after successful add
                setSelectedCard(null);
                setFoilType(null);
                reset({ quantity: 1, language: 'EN', condition: 'NM', finish: '' });
              }
            }}
            style={{ width: '100%' }}
            autoComplete="off"
          >
            <CardDetailsPanel
              selectedCard={selectedCard}
              foilType={foilType}
              setFoilType={setFoilType}
              localFormData={localFormData}
              handleChange={handleChange}
              onSubmit={() => {}} // handled by form
              checkDuplicate={checkDuplicate}
              disabled={((selectedCard.foil && selectedCard.nonfoil) || selectedCard.surgefoil) && !foilType}
              handleBackToSearch={handleBackToSearch}
              setLocalFormData={setLocalFormData}
              languageGroupRef={languageGroupRef}
            />
          </form>
        )}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={closeModal} style={{ fontSize: 18, padding: '8px 24px' }}>Cancel</button>
        </div>
        <DuplicateDialog
          open={!!duplicate}
          existingCard={duplicate}
          newCard={localFormData}
          onUpdate={() => {
            // Implement update quantity logic here
            resetDuplicate();
          }}
          onAddSeparate={() => {
            // Implement add separate logic here
            resetDuplicate();
          }}
          onCancel={resetDuplicate}
        />
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
