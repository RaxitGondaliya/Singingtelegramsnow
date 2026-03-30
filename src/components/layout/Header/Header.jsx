import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.scss';

// SVG Icons
const BackIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export default function Header({ title, onBack }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    return (
        <header className="premium-header">
            <div className="toolbar">
                <button 
                    className="back-btn" 
                    onClick={handleBack} 
                    aria-label="go back"
                >
                    <BackIcon />
                </button>
                <h1 className="title">{title}</h1>
                <div className="header-spacer" />
            </div>
        </header>
    );
}
