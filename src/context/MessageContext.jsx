import React, { createContext, useContext, useState, useRef } from 'react';
import './MessageContext.scss';

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const timerRef = useRef(null);

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

    return (
        <MessageContext.Provider value={{ showMessage, clearMessage }}>
            {children}
            {message && (
                <div className={`global-message-toast ${type}`} onClick={clearMessage}>
                    {message}
                </div>
            )}
        </MessageContext.Provider>
    );
};
