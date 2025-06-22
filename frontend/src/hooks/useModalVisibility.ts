import { useState, useEffect } from 'react';

export function useModalVisibility(visible = false) {
  const [show, setShow] = useState(visible);
  useEffect(() => {
    setShow(visible);
  }, [visible]);
  const open = () => setShow(true);
  const close = () => setShow(false);
  return { show, open, close };
}
