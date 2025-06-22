import { useState } from 'react';

export function useFinishSelectorControlled(card: any, initial: string | null) {
  const [foilType, setFoilType] = useState<string | null>(initial);
  const finishes = (card && card.finishes) ? card.finishes : [];
  // Prefer nonfoil if available
  if (finishes.length > 1 && !foilType) {
    const nonfoil = finishes.find((f: string) => f === 'nonfoil');
    if (nonfoil) setFoilType('nonfoil');
  }
  if (finishes.length === 1 && foilType !== finishes[0]) {
    setFoilType(finishes[0]);
  }
  return { foilType, setFoilType };
}
