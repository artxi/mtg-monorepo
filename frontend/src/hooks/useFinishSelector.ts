import { useState, useEffect } from 'react';

export function useFinishSelector(card: any) {
  const [foilType, setFoilType] = useState<string | null>(null);
  const [finishes, setFinishes] = useState<{ key: string; label: string }[]>([]);

  useEffect(() => {
    if (!card) return;
    const promoTypes: string[] = card.promo_types || [];
    const FINISH_LABELS: Record<string, string> = {
      nonfoil: 'Non-Foil',
      foil: 'Foil',
      etched: 'Etched',
      glossy: 'Glossy',
      surgefoil: 'Surgefoil',
      textured: 'Textured',
      'shattered glass': 'Shattered Glass',
      confetti: 'Confetti',
      'rainbow foiled': 'Rainbow Foil',
      prerelease: 'Prerelease',
      borderless: 'Borderless',
      'extended art': 'Extended Art',
    };
    const finishOptions = (card.finishes || []).map((finish: string) => {
      if (finish === 'foil') {
        if (promoTypes.includes('doublerainbow')) {
          return { key: 'doublerainbow', label: 'Double Rainbow Foil' };
        } else if (promoTypes.includes('surgefoil')) {
          return { key: 'surgefoil', label: 'Surgefoil' };
        } else if (promoTypes.includes('rainbow foiled')) {
          return { key: 'rainbow foiled', label: 'Rainbow Foil' };
        } else {
          return { key: 'foil', label: 'Foil' };
        }
      }
      return {
        key: finish,
        label: FINISH_LABELS[finish] || finish.charAt(0).toUpperCase() + finish.slice(1)
      };
    });
    setFinishes(finishOptions);
    // Prefer nonfoil if available
    if (finishOptions.length > 1 && !foilType) {
      const nonfoil = finishOptions.find((f: { key: string; label: string }) => f.key === 'nonfoil');
      if (nonfoil) setFoilType('nonfoil');
    }
    if (finishOptions.length === 1) setFoilType(finishOptions[0].key);
  }, [card]);

  return { finishes, foilType, setFoilType };
}
