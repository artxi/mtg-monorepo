import React from 'react';
import AutocompleteDropdown from '../ScryfallSearch/AutocompleteDropdown';
import CardGrid from '../CardGrid/CardGrid';

interface ScryfallSearchProps {
  scryfallQuery: string;
  setScryfallQuery: (q: string) => void;
  scryfallLoading: boolean;
  scryfallResults: any[];
  autocompleteOptions: string[];
  showAutocomplete: boolean;
  setShowAutocomplete: (show: boolean) => void;
  autocompleteRef: React.RefObject<HTMLDivElement>;
  onAutocompleteSelect: (name: string) => void;
  onCardSelect: (card: any) => void;
}

const ScryfallSearch: React.FC<ScryfallSearchProps> = ({
  scryfallQuery,
  setScryfallQuery,
  scryfallLoading,
  scryfallResults,
  autocompleteOptions,
  showAutocomplete,
  setShowAutocomplete,
  autocompleteRef,
  onAutocompleteSelect,
  onCardSelect,
}) => (
  <div style={{ position: 'relative', width: '100%' }}>
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
      <AutocompleteDropdown
        options={autocompleteOptions}
        onSelect={onAutocompleteSelect}
        show={showAutocomplete}
        anchorRef={autocompleteRef}
      />
    )}
    <CardGrid cards={scryfallResults} onSelect={onCardSelect} />
  </div>
);

export default ScryfallSearch;
