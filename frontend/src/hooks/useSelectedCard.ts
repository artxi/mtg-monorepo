import { useState } from 'react';

export function useSelectedCard() {
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  return { selectedCard, setSelectedCard };
}
