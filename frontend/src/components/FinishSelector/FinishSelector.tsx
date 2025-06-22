import React from 'react';

// Map Scryfall finish keys to user-friendly labels
const finishLabels: Record<string, string> = {
  nonfoil: 'Non-Foil',
  foil: 'Foil',
  etched: 'Etched Foil',
  gilded: 'Gilded Foil',
  glossy: 'Glossy Foil',
  surgefoil: 'Surge Foil',
  'double_rainbow': 'Double Rainbow Foil',
  textured: 'Textured Foil',
  shatterfoil: 'Shatter Foil',
  confetti: 'Confetti Foil',
};

interface FinishSelectorProps {
  finishes: { key: string; label: string }[];
  selected: string | null;
  onSelect: (key: string) => void;
}

const FinishSelector: React.FC<FinishSelectorProps> = ({ finishes, selected, onSelect }) => {
  if (!finishes.length) return null;
  if (finishes.length === 1) {
    // Auto-select single finish
    if (selected !== finishes[0].key) {
      setTimeout(() => onSelect(finishes[0].key), 0);
    }
    return <span>{finishes[0].label}</span>;
  }
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {finishes.map(({ key }) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: selected === key ? 'lightgray' : 'transparent',
            border: '1px solid gray',
            borderRadius: 4,
            padding: '4px 8px',
            cursor: 'pointer',
          }}
        >
          {finishLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default FinishSelector;
