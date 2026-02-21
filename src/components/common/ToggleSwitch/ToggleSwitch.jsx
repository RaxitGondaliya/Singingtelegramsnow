import React from 'react';
import './ToggleSwitch.scss';

export default function ToggleSwitch({ active, onClick }) {
    return (
        <div
            className={`common-toggle-switch ${active ? 'active' : ''}`}
            onClick={onClick}
        >
            <div className="toggle-thumb" />
        </div>
    );
}
