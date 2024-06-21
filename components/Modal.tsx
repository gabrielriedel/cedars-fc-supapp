import React from 'react';
import './Modal.css';  // Path to the CSS file relative to the Modal.tsx file

interface ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
