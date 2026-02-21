import React from 'react';
import './ProfileMenuItem.scss';

export default function ProfileMenuItem({ icon, label, onClick }) {
    return (
        <div className="menu-item" onClick={onClick}>
            <div className="menu-icon">{icon}</div>
            <span className="menu-label">{label}</span>
        </div>
    );
}
