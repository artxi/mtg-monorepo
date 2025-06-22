import React from 'react';
import FinishSelector from '../FinishSelector/FinishSelector';
import CardForm from '../CardForm/CardForm';

interface CardDetailsPanelProps {
  selectedCard: any;
  foilType: string | null;
  setFoilType: (key: string) => void;
  localFormData: any;
  handleChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  checkDuplicate: () => boolean;
  disabled: boolean;
  handleBackToSearch: () => void;
  setLocalFormData: (fn: (prev: any) => any) => void;
  languageGroupRef?: React.RefObject<HTMLDivElement>;
}

const CardDetailsPanel: React.FC<CardDetailsPanelProps> = ({
  selectedCard,
  foilType,
  setFoilType,
  localFormData,
  handleChange,
  onSubmit,
  checkDuplicate,
  disabled,
  handleBackToSearch,
  setLocalFormData,
  languageGroupRef,
}) => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button type="button" onClick={handleBackToSearch} style={{ alignSelf: 'flex-start', marginBottom: 16 }}>&larr; Back to search</button>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24 }}>
        {selectedCard.image_uris?.normal && <img src={selectedCard.image_uris.normal} alt={selectedCard.name} style={{ width: 160, height: 222, objectFit: 'cover', borderRadius: 4, boxShadow: '0 2px 8px #0002' }} />}
        <div>
          <div style={{ fontWeight: 600, fontSize: 20 }}>{selectedCard.name}</div>
          <div style={{ color: '#888', fontSize: 16 }}>{selectedCard.set_name} ({selectedCard.set.toUpperCase()})</div>
          <div style={{ color: '#888', fontSize: 16 }}>{selectedCard.lang.toUpperCase()} • #{selectedCard.collector_number}</div>
          <div style={{ color: '#1976d2', fontWeight: 500, fontSize: 15, marginTop: 6 }}>
            <FinishSelector
              finishes={(() => {
                // Build a list of unique finish keys, including promo_types for special foils
                const finishes: { key: string; label: string }[] = [];
                if (selectedCard.finishes) {
                  selectedCard.finishes.forEach((finish: string) => {
                    if (finish === 'foil' && selectedCard.promo_types) {
                      // Check for special foils in promo_types
                      if (selectedCard.promo_types.some((t: string) => t.toLowerCase().includes('surge'))) {
                        finishes.push({ key: 'surgefoil', label: 'Surge Foil' });
                      } else if (selectedCard.promo_types.some((t: string) => t.toLowerCase().includes('double') || t.toLowerCase().includes('rainbow'))) {
                        finishes.push({ key: 'double_rainbow', label: 'Double Rainbow Foil' });
                      } else {
                        finishes.push({ key: 'foil', label: 'Foil' });
                      }
                    } else if (finish === 'etched') {
                      finishes.push({ key: 'etched', label: 'Etched Foil' });
                    } else if (finish === 'gilded') {
                      finishes.push({ key: 'gilded', label: 'Gilded Foil' });
                    } else if (finish === 'glossy') {
                      finishes.push({ key: 'glossy', label: 'Glossy Foil' });
                    } else if (finish === 'surgefoil') {
                      finishes.push({ key: 'surgefoil', label: 'Surge Foil' });
                    } else if (finish === 'double_rainbow') {
                      finishes.push({ key: 'double_rainbow', label: 'Double Rainbow Foil' });
                    } else if (finish === 'textured') {
                      finishes.push({ key: 'textured', label: 'Textured Foil' });
                    } else if (finish === 'shatterfoil') {
                      finishes.push({ key: 'shatterfoil', label: 'Shatter Foil' });
                    } else if (finish === 'nonfoil') {
                      finishes.push({ key: 'nonfoil', label: 'Non-Foil' });
                    } else {
                      finishes.push({ key: finish, label: finish.charAt(0).toUpperCase() + finish.slice(1) });
                    }
                  });
                }
                // Remove duplicates by key
                return finishes.filter((f, i, arr) => arr.findIndex(ff => ff.key === f.key) === i);
              })()}
              selected={foilType || ''}
              onSelect={setFoilType}
            />
          </div>
        </div>
      </div>
      <CardForm
        quantity={localFormData.quantity}
        condition={localFormData.condition}
        language={localFormData.language}
        onChange={handleChange}
        languageGroupRef={languageGroupRef}
      />
    </div>
  );
};

export default CardDetailsPanel;
