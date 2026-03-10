import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import './EditCharacterProfile.scss';

export default function EditCharacterProfile() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        character: '',
        characterStyle: [],
        description: '',
        media: null,
        previewUrl: null 
    });

    const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const characterStyles = ["Funny Characters", "Classic", "Horror", "Action", "Romance"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsStyleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStyleToggle = (style) => {
        setFormData(prev => ({
            ...prev,
            characterStyle: prev.characterStyle.includes(style)
                ? prev.characterStyle.filter(item => item !== style)
                : [...prev.characterStyle, style]
        }));
    };

    const handleUpdate = () => {
        console.log("Updating data:", formData);
        navigate('/dashboard/profile/manage-profiles');
    };

    return (
        <div className="edit-character-container">
            <Header title="Edit Character Profile" />

            <div className="edit-character-form">
                <div className="form-group">
                    <label className="form-label">Upload Character Photos / Videos</label>
                    <div className="upload-container">
                        <div className="edit-upload-box">
                            {formData.previewUrl ? (
                                <div className="preview-wrapper">
                                    <img src={formData.previewUrl} alt="Preview" className="media-preview" />
                                    <button className="remove-media">×</button>
                                </div>
                            ) : (
                                <div className="upload-content">
                                    <span className="upload-plus">+</span>
                                    <span className="upload-hint">Upload Photo/Video</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="upload-indicator">
                        <span className="indicator-dot active"></span>
                        <span className="indicator-dot"></span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Select Character</label>
                    <div className="select-wrapper">
                        <select 
                            name="character" 
                            value={formData.character} 
                            onChange={handleInputChange} 
                            className="form-select"
                        >
                            <option value="Austin Powers">Austin Powers</option>
                            <option value="Marilyn Monroe">Marilyn Monroe</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Select Character Style</label>
                    <div className="select-wrapper" ref={dropdownRef}>
                        <div 
                            className="form-select custom-multi-select" 
                            onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                        >
                            {formData.characterStyle.length > 0 
                                ? formData.characterStyle.join(', ') 
                                : <span className="placeholder">Select character style</span>}
                        </div>
                        
                        {isStyleDropdownOpen && (
                            <div className="style-dropdown-list">
                                {characterStyles.map((style, index) => {
                                    const isChecked = formData.characterStyle.includes(style);
                                    return (
                                        <div key={index} className="style-option" onClick={() => handleStyleToggle(style)}>
                                            <span>{style}</span>
                                            <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                                                {isChecked && <span className="checkmark">✓</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows="8"
                    />
                </div>
            </div>

            <div className="form-actions">
                <button className="action-btn btn-update" onClick={handleUpdate}>
                    Update
                </button>
            </div>
        </div>
    );
}
