import { useState } from 'react';

export function useScryfallModalForm(initial: { quantity: number; language: string; condition: string; finish: string }) {
  const [formData, setFormData] = useState(initial);

  function handleChange(field: string, value: string | number) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function reset(newInitial = initial) {
    setFormData(newInitial);
  }

  return { formData, setFormData, handleChange, reset };
}
