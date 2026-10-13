import { useEffect } from "react";

export function Modal({ eyebrow, title, subtitle, onClose, children, wide = false }) {
  useEffect(() => {
    const handleKey = (event) => event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><p className="eyebrow">{eyebrow}</p><h2 id="modal-title">{title}</h2><p>{subtitle}</p></div><button className="close-button" onClick={onClose} aria-label="Close">×</button></div>{children}</section></div>;
}
