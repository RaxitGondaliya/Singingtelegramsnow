import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import './AddCharacterProfile.scss';

export default function AddCharacterProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        character: '',
        characterStyle: '',
        description: '',
        media: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                media: file
            }));
        }
    };

    const handleAddAnother = () => {
        setFormData({
            character: '',
            characterStyle: '',
            description: '',
            media: null
        });
    };

    const handleDone = () => {
        navigate('/dashboard/profile/manage-profiles');
    };

    return (
        <div className="add-character-container">    
            <Header title="Add Character Profile" />

            <div className="add-character-form">
                <div className="form-group first-group">
                    <label className="form-label">Select Character</label>
                    <div className="select-wrapper">
                        <select
                            name="character"
                            value={formData.character}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="">Select Character</option>
                            <option value="austin-powers">Austin Powers</option>
                            <option value="marilyn-monroe">Marilyn Monroe</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Select Character Style</label>
                    <div className="select-wrapper">
                        <select
                            name="characterStyle"
                            value={formData.characterStyle}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="">Select Character Style</option>
                            <option value="classic">Classic</option>
                            <option value="modern">Modern</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-textarea"
                        rows="1"
                        placeholder=""
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Upload Character Photos / Videos</label>
                    <div className="upload-container">
                        {/* Hidden input, triggered by label */}
                        <input
                            type="file"
                            id="media-upload"
                            accept="image/*,video/*"
                            onChange={handleMediaUpload}
                            className="hidden-input"
                        />
                        <label htmlFor="media-upload" className="upload-label">
                            <div className="upload-content">
                                <span className="upload-plus">+</span>
                                <span className="upload-hint">Upload Photo/Video</span>
                            </div>
                        </label>
                    </div>
                    
                    <div className="upload-indicator">
                        <span className={`indicator-dot ${formData.media ? 'active' : ''}`}></span>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button className="action-btn btn-add-another" onClick={handleAddAnother}>
                    +Add Another Character Profile
                </button>
                <button className="action-btn btn-done" onClick={handleDone}>
                    Done
                </button>
            </div>
        </div>
    );
}
