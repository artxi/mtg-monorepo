import React, { useRef } from 'react';
import { useAutocomplete } from '../../hooks/useAutocomplete';

// Map language names to ISO codes
const languageMap: Record<string, string> = {
  'English': 'EN',
  'Japanese': 'JA',
  'French': 'FR',
  'German': 'DE',
  'Spanish': 'ES',
  'Italian': 'IT',
  'Portuguese': 'PT',
  'Russian': 'RU',
  'Korean': 'KO',
  'Chinese Simplified': 'ZHS',
  'Chinese Traditional': 'ZHT',
  'Hebrew': 'HE',
  'Latin': 'LA',
  'Ancient Greek': 'GR',
  'Arabic': 'AR',
  'Sanskrit': 'SA',
  'Phyrexian': 'PH'
};
// Only show languages that MTG cards exist in (from Scryfall docs)
const languageOptions: string[] = [
  'EN', // English
  'ES', // Spanish
  'DE', // German
  'IT', // Italian
  'FR', // French
  'JA', // Japanese
  'PT', // Portuguese
  'RU', // Russian
  'KO', // Korean
  'ZHS', // Chinese Simplified
  'ZHT', // Chinese Traditional
  'OT' // Other
];
// Standard MTG card conditions, ordered best to worst
const conditionOptions = [
  { value: 'NM', label: 'Near Mint (NM)' },
  { value: 'EX', label: 'Excellent (EX)' },
  { value: 'LP', label: 'Lightly Played (LP)' },
  { value: 'SP', label: 'Slightly Played (SP)' },
  { value: 'MP', label: 'Moderately Played (MP)' },
  { value: 'GD', label: 'Good (GD)' },
  { value: 'HP', label: 'Heavily Played (HP)' },
  { value: 'D', label: 'Damaged (D)' },
  { value: 'PO', label: 'Poor (PO)' },
];

interface CardFormProps {
  quantity: number;
  condition: string;
  language: string;
  onChange: (field: string, value: string | number) => void;
  languageGroupRef?: React.RefObject<HTMLDivElement>; // <-- add this prop
}

const CardForm: React.FC<CardFormProps> = ({
  quantity,
  condition,
  language,
  onChange,
  languageGroupRef, // <-- receive as prop
}) => {
  const onChangeLanguage = (name: string) => {
    onChange('language', languageMap[name] || name);
    close();
  };
  const { show, setShow, filtered, handleInputChange, handleSelect, close } = useAutocomplete(languageOptions, onChangeLanguage);

  // Display ISO code if present, else show as is
  const displayLanguage = language || 'EN';

  // Only create a ref if not provided (for backward compatibility)
  const internalRef = useRef<HTMLDivElement>(null!); // Use non-null assertion for type safety
  const groupRef = languageGroupRef || internalRef;

  return (
    <>
      <label>
        Condition
        <select
          value={condition}
          onChange={e => onChange('condition', e.target.value)}
          style={{ width: '100%', fontSize: 16, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
        >
          {conditionOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', width: '20%' }}>
        <label style={{ flex: 1 }}>
          Quantity
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => onChange('quantity', Number(e.target.value))}
            style={{ width: '100%', fontSize: 16, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </label>
        <label style={{ flex: 1 }}>
          Language
          <select
            value={displayLanguage}
            onChange={e => onChange('language', e.target.value)}
            style={{ width: '100%', fontSize: 16, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
          >
            {languageOptions.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>
      </div>
      {/* Add to collection button */}
      <button
        type="submit"
        style={{
          fontSize: 18,
          padding: '12px 0',
          background: '#43a047', // plain green
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          marginTop: 24,
          cursor: 'pointer',
          width: '20%',
          fontWeight: 600,
          letterSpacing: 1,
          boxShadow: '0 2px 8px #43a04733',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#388e3c')}
        onMouseOut={e => (e.currentTarget.style.background = '#43a047')}
      >
        Add to collection
      </button>
    </>
  );
};

export default CardForm;
