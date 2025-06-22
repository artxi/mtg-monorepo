import { useState, useRef, useEffect } from 'react';

export function useAutocomplete(options: string[], onSelect: (name: string) => void) {
  const [show, setShow] = useState(false);
  const [filtered, setFiltered] = useState<string[]>(options);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFiltered(options);
  }, [options]);

  function handleInputChange(value: string) {
    setShow(true);
    setFiltered(options.filter(opt => opt.toLowerCase().includes(value.toLowerCase())));
  }

  function handleSelect(name: string) {
    onSelect(name);
    setShow(false);
  }

  function close() {
    setShow(false);
  }

  return { show, setShow, filtered, anchorRef, handleInputChange, handleSelect, close };
}
