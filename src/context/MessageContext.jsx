import React, { createContext, useContext, useState, useRef } from 'react';
import './MessageContext.scss';

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const timerRef = useRef(null);

    // Confirmation Modal State
    const [confirmData, setConfirmData] = useState(null); // { message, resolve }

    const showMessage = (msg, msgType = 'success') => {
        setMessage(msg);
        setType(msgType);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setMessage('');
        }, 4000);
    };

    const clearMessage = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setMessage('');
    };

    const showConfirm = (msg) => {
        return new Promise((resolve) => {
            setConfirmData({
                message: msg,
                resolve
            });
        });
    };

    const handleConfirmResponse = (value) => {
        if (confirmData) {
            confirmData.resolve(value);
            setConfirmData(null);
        }
    };

    return (
        <MessageContext.Provider value={{ showMessage, clearMessage, showConfirm }}>
            {children}

            {/* Toast Notifications */}
            {message && (
                <div className={`global-message-toast ${type}`} onClick={clearMessage}>
                    {message}
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmData && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-box">
                        <div className="confirm-modal-content">
                            <p>{confirmData.message}</p>
                        </div>
                        <div className="confirm-modal-actions">
                            <button className="confirm-btn-cancel" onClick={() => handleConfirmResponse(false)}>
                                No, Cancel
                            </button>
                            <button className="confirm-btn-confirm" onClick={() => handleConfirmResponse(true)}>
                                Yes, Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MessageContext.Provider>
    );
};
