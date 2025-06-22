import React from 'react';

interface CardImageProps {
  scryfallId: string;
  imageUrl: string;
  alt?: string;
  className?: string;
}

/**
 * Renders a card image that links to the Scryfall page for that card.
 */
const CardImage: React.FC<CardImageProps> = ({ scryfallId, imageUrl, alt = '', className }) => {
  const scryfallUrl = `https://scryfall.com/card/${scryfallId}`;
  return (
    <a href={scryfallUrl} target="_blank" rel="noopener noreferrer">
      <img src={imageUrl} alt={alt} className={className} style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
    </a>
  );
};

export default CardImage;
