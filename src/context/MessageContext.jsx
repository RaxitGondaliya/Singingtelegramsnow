import React, { createContext, useContext, useState, useRef } from 'react';
import './MessageContext.scss';

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const timerRef = useRef(null);

    // Confirmation Modal State
    // Alert Modal State
    const [alertData, setAlertData] = useState(null); // { message, title, resolve }
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

    const showAlert = (msg, title = 'Singing Telegrams Now') => {
        return new Promise((resolve) => {
            setAlertData({
                message: msg,
                title,
                resolve
            });
        });
    };

    const handleAlertOk = () => {
        if (alertData) {
            alertData.resolve();
            setAlertData(null);
        }
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
        <MessageContext.Provider value={{ showMessage, clearMessage, showConfirm, showAlert }}>
            {children}

            {/* Toast Notifications */}
            {message && (
                <div className={`global-message-toast ${type}`} onClick={clearMessage}>
                    {message}
                </div>
            )}

            {/* Alert Modal */}
            {alertData && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-box alert-box">
                        <div className="confirm-modal-header" style={{ textAlign: 'left', padding: '15px 20px 0' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{alertData.title}</h3>
                        </div>
                        <div className="confirm-modal-content" style={{ padding: '10px 20px 20px', textAlign: 'left' }}>
                            <p style={{ margin: 0, fontSize: '15px', color: '#444' }}>{alertData.message}</p>
                        </div>
                        <div className="confirm-modal-actions" style={{ borderTop: '1px solid #eee', justifyContent: 'flex-end', padding: '10px 15px' }}>
                            <button 
                                className="confirm-btn-confirm" 
                                style={{ background: 'transparent', color: '#007aff', fontWeight: '800', border: 'none', fontSize: '16px' }} 
                                onClick={handleAlertOk}
                            >
                                OK
                            </button>
                        </div>
                    </div>
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
