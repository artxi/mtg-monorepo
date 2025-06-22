import { useState } from 'react';

export function useDuplicateDetection(collection: any[], newCard: any) {
  const [duplicate, setDuplicate] = useState<any | null>(null);
  function checkDuplicate() {
    const found = collection.find(card =>
      card.scryfallId === newCard.scryfallId &&
      card.language === newCard.language &&
      card.finish === newCard.finish &&
      card.condition === newCard.condition
    );
    setDuplicate(found || null);
    return found;
  }
  function resetDuplicate() {
    setDuplicate(null);
  }
  return { duplicate, checkDuplicate, resetDuplicate };
}
