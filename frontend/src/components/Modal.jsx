import React from 'react';
import './Modal.css';

/**
 * Reusable Modal component
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Called when overlay/close button clicked
 * @param {React.ReactNode} children - Modal content
 */
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
};

export default Modal;
