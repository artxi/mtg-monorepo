import React from 'react';

interface CardGridProps {
  cards: any[];
  onSelect: (card: any) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ cards, onSelect }) => {
  if (!cards.length) return null;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
      gap: 24,
      maxHeight: 600,
      overflowY: 'auto',
      border: '1px solid #eee',
      margin: '16px 0',
      background: '#fafafa',
      borderRadius: 8,
      padding: 24,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {cards.map(card => (
        <div
          key={card.id}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 12, cursor: 'pointer', border: '1px solid #ddd', borderRadius: 8, background: '#fff', transition: 'box-shadow 0.2s', boxShadow: '0 1px 6px #0001',
          }}
          onClick={() => onSelect(card)}
        >
          {card.image_uris?.normal && <img src={card.image_uris.normal} alt={card.name} style={{ width: 140, height: 200, objectFit: 'cover', borderRadius: 4, boxShadow: '0 2px 8px #0002' }} />}
          <div style={{ fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{card.name}</div>
          <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{card.set_name} ({card.set.toUpperCase()})</div>
          <div style={{ color: '#888', fontSize: 14, textAlign: 'center' }}>{card.lang.toUpperCase()} • #{card.collector_number}</div>
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
