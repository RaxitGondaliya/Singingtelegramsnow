import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.scss';

export default function Header({ title, onBack }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="common-header">
            <button className="back-arrow" onClick={handleBack}>
                ←
            </button>
            <h1>{title}</h1>
        </div>
    );
}
