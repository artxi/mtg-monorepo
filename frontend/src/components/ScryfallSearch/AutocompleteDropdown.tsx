import React from 'react';

interface AutocompleteDropdownProps {
  options: string[];
  onSelect: (name: string) => void;
  show: boolean;
  anchorRef?: React.RefObject<HTMLDivElement>;
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({ options, onSelect, show, anchorRef }) => {
  if (!show || options.length === 0) return null;
  return (
    <div
      ref={anchorRef}
      style={{ position: 'absolute', left: 0, right: 0, top: 56, background: '#fff', border: '1px solid #ccc', borderRadius: 4, zIndex: 10, maxHeight: 240, overflowY: 'auto', boxShadow: '0 2px 12px #0002' }}
      onMouseDown={e => e.stopPropagation()}
    >
      {options.map((name, idx) => (
        <div
          key={name + idx}
          style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 16, borderBottom: idx !== options.length - 1 ? '1px solid #eee' : undefined }}
          onMouseDown={e => { e.preventDefault(); onSelect(name); }}
        >
          {name}
        </div>
      ))}
    </div>
  );
};

export default AutocompleteDropdown;
