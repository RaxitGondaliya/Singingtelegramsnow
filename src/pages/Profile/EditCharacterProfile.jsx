import React, { useState,} from 'react';//
import { useNavigate, } from 'react-router-dom';//useParams, useLocation 
import Header from '../../components/Header';
import './EditCharacterProfile.css';

export default function EditCharacterProfile() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        character: '',
        characterStyle: '',
        description: '',
        media: null,
        previewUrl: null 
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        console.log("Updating data:", formData);
        navigate('/dashboard/profile/manage-profiles');
    };

    return (
        <div className="edit-character-container">
            {/* <div className="custom-header-wrapper"> */}
                <Header title="Edit Character Profile" />
            {/* </div> */}

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
                    <div className="select-wrapper">
                        <select 
                            name="characterStyle" 
                            value={formData.characterStyle} 
                            onChange={handleInputChange} 
                            className="form-select"
                        >
                            <option value="Funny Characters">Funny Characters</option>
                            <option value="Classic">Classic</option>
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