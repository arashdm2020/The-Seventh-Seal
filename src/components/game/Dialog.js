"use client";
import { useEffect, useRef } from "react";
export default function Dialog({ children, label, onClose, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
    >
      {children}
    </dialog>
  );
}
