import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { characterApi } from '../../../api/characterApi';
import { getImageUrl } from '../../../utils/imageUtils';
import { useMessage } from '../../../context/MessageContext';
import './EditCharacterProfile.scss';

// SVG Icons
const TrashIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const PhotoIcon = () => (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

const ChevronDown = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

export default function EditCharacterProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showMessage } = useMessage();
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    const isEditMode = location.pathname.includes('edit-character');
    const profileData = location.state?.profileData || {};

    const [formData, setFormData] = useState({
        iArtistCharacterId: profileData.iCharacterId || profileData.iArtistCharacterId || profileData.id || '',
        iCharacterId: '',
        iCharacterKeywordId: (() => {
            const rawId = profileData.iCharacterKeywordId || profileData.iKeywordId;
            if (Array.isArray(rawId)) return rawId.join(',');
            return rawId ? String(rawId) : '';
        })(),
        character: profileData.vCharacterName || profileData.name || '',
        characterStyle: (() => {
            const rawStyle = profileData.vCharacterStyle || profileData.characterStyle;
            if (Array.isArray(rawStyle)) return rawStyle;
            if (typeof rawStyle === 'string') return rawStyle.split(',').map(s => s.trim()).filter(Boolean);
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
    const [styles, setStyles] = useState([]);
    const [myCharacters, setMyCharacters] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [stylesRes, charsRes] = await Promise.all([
                    characterApi.getCharacterStyles(),
                    characterApi.getMyCharactersList()
                ]);

                const fetchedStyles = stylesRes.data?.responseData || stylesRes.data?.data || stylesRes.data || [];
                const fetchedChars = charsRes.data?.responseData || charsRes.data?.data || charsRes.data || [];
                
                setStyles(Array.isArray(fetchedStyles) ? fetchedStyles : [fetchedStyles]);
                setMyCharacters(Array.isArray(fetchedChars) ? fetchedChars : [fetchedChars]);

                // Auto-fill logic (simplified version of the original)
                setFormData(prev => {
                    const newState = { ...prev };
                    const currentStyles = Array.isArray(prev.characterStyle) ? prev.characterStyle : [];
                    const currentIds = prev.iCharacterKeywordId ? String(prev.iCharacterKeywordId).split(',').map(s => s.trim()).filter(Boolean) : [];

                    if (currentIds.length === 0 && currentStyles.length > 0) {
                        const matchIds = currentStyles.map(sName => {
                            const match = fetchedStyles.find(fs => (fs.vKeyword || fs.name) === sName);
                            return match ? String(match.iKeywordId || match.iCharacterKeywordId) : null;
                        }).filter(Boolean);
                        if (matchIds.length > 0) newState.iCharacterKeywordId = matchIds.join(',');
                    }

                    if (!newState.iCharacterId && prev.character) {
                        const match = fetchedChars.find(c => (c.vCharacterName || c.name) === prev.character);
                        if (match) newState.iCharacterId = match.iCharacterId || match.id || '';
                    }

                    return newState;
                });
            } catch (err) { console.error('Error fetching data:', err); }
        };
        fetchDropdownData();

        const handleClickOutside = (e) => { 
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false); 
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'character') {
                const match = myCharacters.find(c => (c.vCharacterName || c.name) === value);
                if (match) newState.iCharacterId = match.iCharacterId || match.id || '';
            }
            return newState;
        });
    };

    const handleStyleToggle = (styleObj) => {
        const styleName = styleObj.vKeyword || styleObj.name;
        const styleId = String(styleObj.iKeywordId || styleObj.iCharacterKeywordId || '');

        setFormData(prev => {
            const currentStyles = [...prev.characterStyle];
            const currentIds = prev.iCharacterKeywordId ? prev.iCharacterKeywordId.split(',').filter(Boolean) : [];

            const idx = currentStyles.indexOf(styleName);
            if (idx > -1) {
                currentStyles.splice(idx, 1);
                if (styleId) {
                    const idIdx = currentIds.indexOf(styleId);
                    if (idIdx > -1) currentIds.splice(idIdx, 1);
                }
            } else {
                currentStyles.push(styleName);
                if (styleId && !currentIds.includes(styleId)) currentIds.push(styleId);
            }

            return { ...prev, characterStyle: currentStyles, iCharacterKeywordId: currentIds.join(',') };
        });
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const urls = files.map(file => URL.createObjectURL(file));
        setFormData(prev => {
            const isReplacing = prev.media.length === 0;
            return {
                ...prev,
                media: isReplacing ? files : [...prev.media, ...files],
                previewUrls: isReplacing ? urls : [...prev.previewUrls, ...urls]
            };
        });
    };

    const handleRemoveMedia = (index) => {
        setFormData(prev => {
            const newMedia = [...prev.media];
            const newPreviews = [...prev.previewUrls];
            if (newPreviews[index]?.startsWith('blob:')) URL.revokeObjectURL(newPreviews[index]);
            newMedia.splice(index, 1);
            newPreviews.splice(index, 1);
            return { ...prev, media: newMedia, previewUrls: newPreviews };
        });
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        try {
            setSubmitting(true);
            const txMedia = [];

            // Add existing images
            formData.previewUrls.forEach(url => {
                if (!url.startsWith('blob:')) {
                    const filename = url.split('/').pop().split('?')[0];
                    const isVid = filename.match(/\.(mp4|mov|wmv|avi|mkv|flv)$/i);
                    txMedia.push({
                        vMedia: url.includes('freepik.com') ? url : filename,
                        vMediaName: filename,
                        vMediaType: isVid ? 'Video' : 'Image',
                        vFileType: filename.split('.').pop() || 'jpeg',
                        vThumb: url.includes('freepik.com') ? url : filename
                    });
                }
            });

            // Add new media (Base64)
            for (const file of formData.media) {
                const base64 = await fileToBase64(file);
                const isVid = file.type.startsWith('video/');
                txMedia.push({
                    vMedia: base64,
                    vMediaName: file.name,
                    vMediaType: isVid ? 'Video' : 'Image',
                    vFileType: file.name.split('.').pop() || (isVid ? 'mp4' : 'jpeg'),
                    vThumb: base64
                });
            }

            const payload = {
                iCharacterId: String(formData.iCharacterId || ""),
                iCharacterKeywordId: String(formData.iCharacterKeywordId || ""),
                vCharacterName: formData.character.trim(),
                vCharacterStyle: formData.characterStyle.join(','),
                txDescription: formData.description.trim(),
                txMedia
            };
            if (formData.iArtistCharacterId) payload.iArtistCharacterId = formData.iArtistCharacterId;

            const res = await (isEditMode ? characterApi.editCharacter(payload) : characterApi.addCharacter(payload));
            if (res.data?.responseCode === 200) {
                showMessage(res.data?.responseMessage || 'Character Updated Successfully', 'success');
                navigate('/dashboard/profile/manage-profiles');
            } else {
                showMessage(res.data?.responseMessage || 'Update Failed', 'error');
            }
        } catch (err) {
            console.error('Submission error:', err);
            showMessage('Failed to process request', 'error');
        } finally { setSubmitting(false); }
    };

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = e => reject(e);
    });

    return (
        <div className="edit-profile-container">
            <Header title={isEditMode ? "Edit Profile" : "Add Profile"} onBack={() => navigate(-1)} />

            <div className="edit-profile-wrapper">
                <main className="edit-card">
                    <div className="media-section">
                        <h3>Photos & Videos</h3>
                        <div className="media-scroller">
                            {formData.previewUrls.length > 0 ? (
                                formData.previewUrls.map((url, idx) => (
                                    <div key={idx} className="media-item">
                                        <img src={url} alt="" />
                                        <button className="remove-btn" onClick={() => handleRemoveMedia(idx)}><TrashIcon /></button>
                                    </div>
                                ))
                            ) : (
                                <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                                    <PhotoIcon />
                                    <span>Upload Media</span>
                                </div>
                            )}
                            
                            {formData.previewUrls.length > 0 && (
                                <div className="add-more-box" onClick={() => fileInputRef.current?.click()}>
                                    <div className="plus">+</div>
                                    <span>Add More</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" multiple hidden />
                    </div>

                    <form className="form-group" onSubmit={handleUpdate}>
                        <div className="input-field">
                            <label>Character</label>
                            <select name="character" value={formData.character} onChange={handleInputChange} required>
                                <option value="">Select Character</option>
                                {myCharacters.map((c, i) => <option key={i} value={c.vCharacterName || c.name}>{c.vCharacterName || c.name}</option>)}
                            </select>
                        </div>

                        <div className="input-field" style={{ position: 'relative' }} ref={dropdownRef}>
                            <label>Character Style</label>
                            <div className="multi-select-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                {formData.characterStyle.length > 0 ? (
                                    <div className="tags">{formData.characterStyle.join(', ')}</div>
                                ) : (
                                    <span className="placeholder">Select Styles</span>
                                )}
                                <ChevronDown />
                            </div>
                            {isDropdownOpen && (
                                <div className="dropdown-popover">
                                    {styles.map((s, i) => (
                                        <div key={i} className="option" onClick={() => handleStyleToggle(s)}>
                                            <input type="checkbox" checked={formData.characterStyle.includes(s.vKeyword || s.name)} readOnly />
                                            <span>{s.vKeyword || s.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="input-field">
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell us about this character..." />
                        </div>

                        <button type="submit" className="submit-btn" disabled={submitting}>
                            {submitting ? 'Processing...' : (isEditMode ? 'Update Profile' : 'Add Profile')}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
