import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { characterApi } from '../../../api/characterApi';
import { getImageUrl } from '../../../utils/imageUtils';
import { useMessage } from '../../../context/MessageContext';
import './EditCharacterProfile.scss';

export default function EditCharacterProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showMessage } = useMessage();
    const fileInputRef = useRef(null);

    // Profile data passed from ManageProfiles via navigate state
    const profileData = location.state?.profileData || {};

    const [formData, setFormData] = useState({
        iArtistCharacterId: profileData.iCharacterId || profileData.iArtistCharacterId || profileData.id || '',
        iCharacterId: '',
        iCharacterKeywordId: profileData.iCharacterKeywordId || profileData.iKeywordId || '',
        character: profileData.vCharacterName || profileData.name || '',
        characterStyle: profileData.vCharacterStyle || profileData.characterStyle || '',
        description: profileData.txDescription || profileData.description || '',
        media: [],
        previewUrls: profileData.vImage
            ? [getImageUrl(profileData.vImage)]
            : profileData.txCharacterPic
                ? [getImageUrl(profileData.txCharacterPic)]
                : []
    });

    const [submitting, setSubmitting] = useState(false);
    const [styles, setStyles] = useState([]);
    const [myCharacters, setMyCharacters] = useState([]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // Fetch Styles
                let fetchedStyles = [];
                const stylesRes = await characterApi.getCharacterStyles();
                if (stylesRes.data?.responseData) {
                    fetchedStyles = stylesRes.data.responseData;
                } else if (stylesRes.data?.data) {
                    fetchedStyles = stylesRes.data.data;
                } else if (Array.isArray(stylesRes.data)) {
                    fetchedStyles = stylesRes.data;
                }
                setStyles(fetchedStyles);

                // Fetch Characters
                let fetchedChars = [];
                const charsRes = await characterApi.getMyCharactersList();
                if (charsRes.data?.responseData) {
                    fetchedChars = Array.isArray(charsRes.data.responseData) ? charsRes.data.responseData : [charsRes.data.responseData];
                } else if (charsRes.data?.data) {
                    fetchedChars = Array.isArray(charsRes.data.data) ? charsRes.data.data : [charsRes.data.data];
                } else if (Array.isArray(charsRes.data)) {
                    fetchedChars = charsRes.data;
                }
                setMyCharacters(fetchedChars);

                // Auto-fill hidden IDs if they were missing but we passed strings
                setFormData(prev => {
                    const newState = { ...prev };
                    if (!newState.iCharacterKeywordId && prev.characterStyle) {
                        const sMatch = fetchedStyles.find(s => (s.vKeyword || s.name) === prev.characterStyle);
                        if (sMatch) newState.iCharacterKeywordId = sMatch.iKeywordId || sMatch.iCharacterKeywordId || '';
                    }
                    if (!newState.iCharacterId && prev.character) {
                        const cMatch = fetchedChars.find(c => (c.vCharacterName || c.name) === prev.character);
                        if (cMatch) newState.iCharacterId = cMatch.iCharacterId || cMatch.id || '';
                    }
                    return newState;
                });

            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };

        fetchDropdownData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'character') {
                const selectedChar = myCharacters.find(c => (c.vCharacterName || c.name) === value);
                if (selectedChar) {
                    newState.iCharacterId = selectedChar.iCharacterId || selectedChar.id || '';
                }
            } else if (name === 'characterStyle') {
                const selectedStyle = styles.find(s => (s.vKeyword || s.name) === value);
                if (selectedStyle) {
                    newState.iCharacterKeywordId = selectedStyle.iKeywordId || selectedStyle.iCharacterKeywordId || '';
                }
            }
            return newState;
        });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));

        setFormData(prev => ({
            ...prev,
            media: [...prev.media, ...files],
            previewUrls: [...prev.previewUrls, ...newPreviewUrls]
        }));
    };

    const handleRemoveMedia = (index) => {
        setFormData(prev => {
            const newMedia = [...prev.media];
            const newPreviews = [...prev.previewUrls];

            // Revoke object URL if it's a blob URL
            if (newPreviews[index]?.startsWith('blob:')) {
                URL.revokeObjectURL(newPreviews[index]);
            }

            newMedia.splice(index, 1);
            newPreviews.splice(index, 1);

            return { ...prev, media: newMedia, previewUrls: newPreviews };
        });
    };

    const handleUpdate = async () => {
        try {
            setSubmitting(true);

            // Build txMedia array from uploaded files (as base64) or existing URLs
            const txMedia = [];

            // Add existing image URLs that weren't removed
            for (const url of formData.previewUrls) {
                if (!url.startsWith('blob:')) {
                    const filename = url.split('/').pop();
                    const isVideo = filename.match(/\.(mp4|mov|wmv|avi|mkv|flv)$/i);
                    const ext = filename.split('.').pop() || 'jpeg';
                    txMedia.push({
                        vMedia: filename,
                        vMediaName: filename,
                        vMediaType: isVideo ? 'Video' : 'Image',
                        vFileType: ext,
                        vThumb: filename
                    });
                }
            }

            // Convert new files to base64
            for (const file of formData.media) {
                const base64 = await fileToBase64(file);
                const isVideo = file.type.startsWith('video/');
                const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpeg');
                txMedia.push({
                    vMedia: base64,
                    vMediaName: file.name,
                    vMediaType: isVideo ? 'Video' : 'Image',
                    vFileType: ext,
                    vThumb: base64
                });
            }

            const payload = {
                iArtistCharacterId: formData.iArtistCharacterId || "",
                iCharacterId: formData.iCharacterId || "",
                iCharacterKeywordId: formData.iCharacterKeywordId || "",
                vCharacterName: formData.character ? formData.character.trim() : '',
                vCharacterStyle: formData.characterStyle || "",
                txDescription: formData.description ? formData.description.trim() : '',
                txMedia: txMedia
            };

            console.log('Edit character payload:', payload);

            const res = await characterApi.editCharacter(payload);
            console.log('Edit character response:', res.data);

            if (res.data?.responseCode === 200) {
                showMessage(res.data?.responseMessage || 'Character Updated Successfully', 'success');
                navigate('/dashboard/profile/manage-profiles');
            } else {
                showMessage(res.data?.responseMessage || 'Update Failed', 'error');
            }
        } catch (error) {
            console.error('Edit character error:', error);
            showMessage('Failed to update character', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Helper: Convert File to base64 string
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div className="edit-character-container">
            <Header title="Edit Character Profile" />

            <div className="edit-character-form">
                <div className="form-group">
                    <label className="form-label">Upload Character Photos / Videos</label>
                    <div className="upload-container">
                        {formData.previewUrls.length > 0 ? (
                            formData.previewUrls.map((url, idx) => (
                                <div key={idx} className="edit-upload-box">
                                    <div className="preview-wrapper">
                                        <img src={url} alt={`Preview ${idx + 1}`} className="media-preview" />
                                        <button className="remove-media" onClick={() => handleRemoveMedia(idx)}>×</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                className="edit-upload-box"
                                onClick={() => fileInputRef.current?.click()}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="upload-content">
                                    <span className="upload-plus">+</span>
                                    <span className="upload-hint">Upload Photo/Video</span>
                                </div>
                            </div>
                        )}
                        {formData.previewUrls.length > 0 && (
                            <div
                                className="edit-upload-box add-more-box"
                                onClick={() => fileInputRef.current?.click()}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="upload-content">
                                    <span className="upload-plus">+</span>
                                    <span className="upload-hint">Add More</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                        multiple
                        style={{ display: 'none' }}
                    />
                    <div className="upload-indicator">
                        {formData.previewUrls.map((_, idx) => (
                            <span key={idx} className={`indicator-dot ${idx === 0 ? 'active' : ''}`}></span>
                        ))}
                        {formData.previewUrls.length === 0 && (
                            <>
                                <span className="indicator-dot active"></span>
                                <span className="indicator-dot"></span>
                            </>
                        )}
                    </div>
                </div>


                {/* multiple select */}
                <div className="form-group">
                    <label className="form-label">Select Character</label>
                    <div className="select-wrapper">
                        <select
                            name="character"
                            value={formData.character}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="">Select Character</option>
                            {myCharacters.map((charObj, index) => {
                                const charName = charObj.vCharacterName || charObj.name || `Character ${index + 1}`;
                                return (
                                    <option key={charObj.iCharacterId || charObj.id || index} value={charName}>
                                        {charName}
                                    </option>
                                );
                            })}
                            {/* Fallback to show existing character if not in the list yet */}
                            {formData.character && !myCharacters.some(c => (c.vCharacterName || c.name) === formData.character) && (
                                <option value={formData.character}>{formData.character}</option>
                            )}
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
                            <option value="">Select Style</option>
                            {styles.map((styleObj, index) => (
                                <option key={styleObj.iKeywordId || index} value={styleObj.vKeyword || styleObj.name}>
                                    {styleObj.vKeyword || styleObj.name}
                                </option>
                            ))}
                            {/* Fallback to show existing style if not in the list yet */}
                            {formData.characterStyle && !styles.some(s => (s.vKeyword || s.name) === formData.characterStyle) && (
                                <option value={formData.characterStyle}>{formData.characterStyle}</option>
                            )}
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
                <button
                    className="action-btn btn-update"
                    onClick={handleUpdate}
                    disabled={submitting}
                >
                    {submitting ? 'Updating...' : 'Update'}
                </button>
            </div>
        </div>
    );
}
