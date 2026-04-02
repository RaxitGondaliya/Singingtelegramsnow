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

    const isEditMode = location.pathname.includes('edit-character');

    // Profile data passed from ManageProfiles via navigate state
    const profileData = location.state?.profileData || {};

    const [formData, setFormData] = useState({
        iArtistCharacterId: profileData.iCharacterId || profileData.iArtistCharacterId || profileData.id || '',
        iCharacterId: '',
        iCharacterKeywordId: (() => {
            const rawId = profileData.iCharacterKeywordId || profileData.iKeywordId;
            if (Array.isArray(rawId)) return rawId.join(',');
            if (rawId !== undefined && rawId !== null) return String(rawId);
            return '';
        })(),
        character: profileData.vCharacterName || profileData.name || '',
        characterStyle: (() => {
            const rawStyle = profileData.vCharacterStyle || profileData.characterStyle;
            if (Array.isArray(rawStyle)) return rawStyle;
            if (typeof rawStyle === 'string') return rawStyle.split(',').map(s => s.trim()).filter(Boolean);
            if (typeof rawStyle === 'number') return [String(rawStyle)];
            return [];
        })(),
        description: profileData.txDescription || profileData.description || '',
        media: [],
        previewUrls: profileData.vImage
            ? [getImageUrl(profileData.vImage)]
            : profileData.txCharacterPic
                ? [getImageUrl(profileData.txCharacterPic)]
                : ['https://img.freepik.com/premium-vector/snowflakes-stencil-vector03-mandala-style_566680-13576.jpg?semt=ais_rp_progressive&w=740&q=80']
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [styles, setStyles] = useState([]);
    const [myCharacters, setMyCharacters] = useState([]);
    const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsStyleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

                    const currentStyles = Array.isArray(prev.characterStyle) ? prev.characterStyle : [];
                    const currentIds = prev.iCharacterKeywordId ? String(prev.iCharacterKeywordId).split(',').map(id => id.trim()).filter(Boolean) : [];

                    // Fill IDs from Strings
                    if (currentIds.length === 0 && currentStyles.length > 0) {
                        const matchIds = currentStyles.map(styleStr => {
                            const sMatch = fetchedStyles.find(s => (s.vKeyword || s.name) === styleStr);
                            return sMatch ? String(sMatch.iKeywordId || sMatch.iCharacterKeywordId || '') : '';
                        }).filter(Boolean);
                        if (matchIds.length > 0) newState.iCharacterKeywordId = matchIds.join(',');
                    }

                    // Fill Strings from IDs
                    if (currentStyles.length === 0 && currentIds.length > 0) {
                        const matchNames = currentIds.map(idStr => {
                            const sMatch = fetchedStyles.find(s => String(s.iKeywordId || s.iCharacterKeywordId || '') === idStr);
                            return sMatch ? (sMatch.vKeyword || s.name) : '';
                        }).filter(Boolean);
                        if (matchNames.length > 0) newState.characterStyle = matchNames;
                    }

                    // Same logic for Character Name/ID
                    if (!newState.iCharacterId && prev.character) {
                        const cMatch = fetchedChars.find(c => (c.vCharacterName || c.name) === prev.character);
                        if (cMatch) newState.iCharacterId = cMatch.iCharacterId || cMatch.id || '';
                    } else if (!prev.character && prev.iCharacterId) {
                        const cMatch = fetchedChars.find(c => String(c.iCharacterId || c.id || '') === String(prev.iCharacterId));
                        if (cMatch) newState.character = cMatch.vCharacterName || cMatch.name || '';
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
            }
            return newState;
        });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleStyleToggle = (styleObj) => {
        const styleName = styleObj.vKeyword || styleObj.name;
        const styleId = String(styleObj.iKeywordId || styleObj.iCharacterKeywordId || '');

        setFormData(prev => {
            const currentStyles = Array.isArray(prev.characterStyle) ? prev.characterStyle : [];
            const currentIds = prev.iCharacterKeywordId ? String(prev.iCharacterKeywordId).split(',').map(s => s.trim()).filter(Boolean) : [];

            let newStyles;
            let newIds;

            const isAlreadyChecked = currentStyles.includes(styleName) || (styleId && currentIds.includes(styleId));

            if (isAlreadyChecked) {
                newStyles = currentStyles.filter(s => s !== styleName);
                if (styleId) newIds = currentIds.filter(id => id !== styleId);
                else newIds = currentIds;
            } else {
                newStyles = [...currentStyles, styleName];
                if (styleId && !currentIds.includes(styleId)) {
                    newIds = [...currentIds, styleId];
                } else {
                    newIds = currentIds;
                }
            }

            return {
                ...prev,
                characterStyle: newStyles.filter(Boolean),
                iCharacterKeywordId: newIds.filter(Boolean).join(',')
            };
        });

        if (errors.characterStyle) {
            setErrors(prev => ({ ...prev, characterStyle: null }));
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));

        setFormData(prev => {
            const isReplacingOld = prev.media.length === 0;
            return {
                ...prev,
                media: isReplacingOld ? files : [...prev.media, ...files],
                previewUrls: isReplacingOld ? newPreviewUrls : [...prev.previewUrls, ...newPreviewUrls]
            };
        });

        // When new files are added, scroll to the newly added images (which is current previewUrls length)
        setTimeout(() => {
            setCurrentSlideIndex(formData.previewUrls.length);
        }, 100);

        if (errors.media) {
            setErrors(prev => ({ ...prev, media: null }));
        }
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

        // Adjust current slide index if we delete the current or a previous slide
        setCurrentSlideIndex(prevIndex => {
            if (prevIndex > index) return prevIndex - 1;
            if (prevIndex === index && index === formData.previewUrls.length - 1) return Math.max(0, index - 1);
            return prevIndex;
        });
    };

    const handleScroll = (e) => {
        const container = e.target;
        const scrollPosition = container.scrollLeft;
        const itemWidth = container.clientWidth;

        // Calculate the current index based on scroll position (adding half width for round-to-nearest behavior)
        const newIndex = Math.round(scrollPosition / itemWidth);

        if (newIndex !== currentSlideIndex) {
            setCurrentSlideIndex(newIndex);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        
        if (!formData.previewUrls || formData.previewUrls.length === 0) {
            newErrors.media = "At least one photo or video is required.";
        }
        
        if (!formData.character || !formData.character.trim()) {
            newErrors.character = "Character selection is required.";
        }
        
        if (!formData.characterStyle || formData.characterStyle.length === 0) {
            newErrors.characterStyle = "At least one character style is required.";
        }
        
        if (!formData.description || !formData.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters long.";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;
        
        try {
            setSubmitting(true);

            // This array must contain ALL images (old and new) to avoid count() error
            const txMedia = [];

            // 1. IMPORTANT: Loop through existing previewUrls
            // If the URL is from the server (doesn't start with 'blob:'), 
            // we must add it to txMedia so the backend sees it.
            if (formData.previewUrls && formData.previewUrls.length > 0) {
                formData.previewUrls.forEach((url) => {
                    if (!url.startsWith('blob:')) {
                        const cleanUrl = url.split('?')[0];
                        const extractedFilename = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);

                        // Use full URL for external fallback image, otherwise standard filename
                        const filename = url.includes('freepik.com') ? url : extractedFilename;
                        const isVideo = extractedFilename.match(/\.(mp4|mov|wmv|avi|mkv|flv)$/i);
                        const ext = extractedFilename.split('.').pop() || 'jpeg';

                        txMedia.push({
                            vMedia: filename, // Send filename for existing images (or full url for fallback)
                            vMediaName: extractedFilename,
                            vMediaType: isVideo ? 'Video' : 'Image',
                            vFileType: ext,
                            vThumb: filename
                        });
                    }
                });
            }

            // 2. Convert newly uploaded files to base64 and add them to txMedia
            for (const file of formData.media) {
                const base64 = await fileToBase64(file);
                const isVideo = file.type.startsWith('video/');
                const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpeg');

                txMedia.push({
                    vMedia: base64, // Send Base64 string for new uploads
                    vMediaName: file.name,
                    vMediaType: isVideo ? 'Video' : 'Image',
                    vFileType: ext,
                    vThumb: base64
                });
            }

            const payload = {
                iCharacterId: String(formData.iCharacterId || ""),
                iCharacterKeywordId: String(formData.iCharacterKeywordId || ""),
                vCharacterName: formData.character ? formData.character.trim() : '',
                vCharacterStyle: Array.isArray(formData.characterStyle) ? formData.characterStyle.join(',') : "",
                txDescription: formData.description ? formData.description.trim() : '',
                txMedia: txMedia // Now this array will NOT be empty
            };

            if (formData.iArtistCharacterId) {
                payload.iArtistCharacterId = formData.iArtistCharacterId;
            }

            console.log("Final Payload being sent:", payload);

            const apiCall = isEditMode ? characterApi.editCharacter : characterApi.addCharacter;
            const res = await apiCall(payload);

            if (res.data?.responseCode === 200) {
                showMessage(res.data?.responseMessage || 'Character Updated Successfully', 'success');
                navigate('/dashboard/profile/manage-profiles');
            } else {
                showMessage(res.data?.responseMessage || 'Update Failed', 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
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
            <Header title={isEditMode ? "Edit Character Profile" : "Add Character Profile"} />

            <div className="edit-character-form">
                <div className="form-group">
                    <label className="form-label">Upload Character Photos / Videos</label>
                    <div className="upload-container" onScroll={handleScroll}>
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
                        {formData.previewUrls.length > 0 ? (
                            // Total dots = number of images + 1 for "Add More"
                            Array.from({ length: formData.previewUrls.length + 1 }).map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`indicator-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                                ></span>
                            ))
                        ) : (
                            // Default 2 dots for the empty state
                            <>
                                <span className={`indicator-dot ${currentSlideIndex === 0 ? 'active' : ''}`}></span>
                                <span className={`indicator-dot ${currentSlideIndex === 1 ? 'active' : ''}`}></span>
                            </>
                        )}
                    </div>
                    {errors.media && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block', textAlign: 'center' }}>{errors.media}</span>}
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
                    {errors.character && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.character}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Select Character Style</label>
                    <div className="select-wrapper" ref={dropdownRef}>
                        <div
                            className="form-select custom-multi-select"
                            onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                        >
                            {Array.isArray(formData.characterStyle) && formData.characterStyle.length > 0
                                ? formData.characterStyle.join(', ')
                                : <span className="placeholder">Select Style</span>}
                        </div>

                        {isStyleDropdownOpen && (
                            <div className="style-dropdown-list">
                                {styles.map((styleObj, index) => {
                                    const styleName = styleObj.vKeyword || styleObj.name;
                                    const styleId = String(styleObj.iKeywordId || styleObj.iCharacterKeywordId || '');

                                    const currentStyles = Array.isArray(formData.characterStyle) ? formData.characterStyle : [];
                                    const currentIds = formData.iCharacterKeywordId ? String(formData.iCharacterKeywordId).split(',').map(s => s.trim()).filter(Boolean) : [];

                                    const isChecked = currentStyles.includes(styleName) || (styleId && currentIds.includes(styleId));

                                    return (
                                        <div key={styleId || index} className="style-option" onClick={() => handleStyleToggle(styleObj)}>
                                            <span>{styleName}</span>
                                            <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                                                {isChecked && <span className="checkmark">✓</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Fallback styles */}
                                {Array.isArray(formData.characterStyle) && formData.characterStyle.filter(styleName => !styles.some(s => (s.vKeyword || s.name) === styleName)).map((styleName, index) => (
                                    <div key={`fallback-${index}`} className="style-option" onClick={() => handleStyleToggle({ name: styleName, iKeywordId: '' })}>
                                        <span>{styleName}</span>
                                        <div className="custom-checkbox checked">
                                            <span className="checkmark">✓</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.characterStyle && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.characterStyle}</span>}
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
                    {errors.description && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
                </div>
            </div>

            <div className="form-actions">
                <button
                    className="action-btn btn-update"
                    onClick={handleUpdate}
                    disabled={submitting}
                >
                    {submitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update' : 'Add Character')}
                </button>
            </div>
        </div>
    );
}

