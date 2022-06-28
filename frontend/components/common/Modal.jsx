import React from 'react'
import { createPortal } from 'react-dom'
import '../../styles/components/modal.css'

const Modal = ({ isOpen, closeModal, children }) => {
    const container = document.getElementById('portal')

    if (!isOpen) return null
    return container
        ? createPortal(
            <div className="modal__container flex items-center justify-center" onClick={closeModal}>
                <div className="modal__window" onClick={(e) => e.stopPropagation()}>
                    <div className="modal__window_close-icon">
                        <i onClick={closeModal}>[x]</i>
                    </div>
                    {children}
                </div>
            </div>,
            container
        )
        : null
}

export default Modal