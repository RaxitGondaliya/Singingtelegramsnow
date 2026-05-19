import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { characterApi } from '../../../api/characterApi';
import imageCompression from 'browser-image-compression';
import { getImageUrl } from '../../../utils/imageUtils';
import { useMessage } from '../../../context/MessageContext';
import './EditCharacterProfile.scss';

// ── S3 constants (display only — for existing uploaded media) ─────────────────
const S3_BASE     = 'https://s3.us-east-1.amazonaws.com/stn-deployments-mobilehub-1291405271/';
const IMG_FOLDER  = 'character_images/';
const VID_FOLDER  = 'character_videos/';
const THUMB_FOLDER = 'character_thumb_images/';
const OTHER_CHARACTER_VALUE = '__other__';

// ── Base64 helpers ────────────────────────────────────────────────────────────
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function compressImageBase64(file) {
    const compressed = await imageCompression(file, { maxSizeMB: 0.05, maxWidthOrHeight: 800, useWebWorker: true });
    return fileToBase64(compressed);
}

async function generateThumbBase64(file) {
    const thumb = await imageCompression(file, { maxSizeMB: 0.01, maxWidthOrHeight: 100, useWebWorker: true });
    return fileToBase64(thumb);
}

function generateVideoThumbBase64(videoFile) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(videoFile);
        video.currentTime = 0.1;
        video.onloadeddata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
    });
}

const mapExistingMedia = (apiMedia) =>
    apiMedia.map((item, i) => {
        const isBase64Name  = item.vMediaName?.startsWith('data:');
        const isBase64Thumb = item.vThumb?.startsWith('data:');
        const folder        = item.vMediaType !== 'image' ? VID_FOLDER : IMG_FOLDER;
        return {
            localFile:    null,
            isVideo:      item.vMediaType !== 'image',
            isCover:      String(item.tiMarkAsCoverPhoto) === '1' || i === 0,
            s3Key:        isBase64Name  ? null : `${folder}${item.vMediaName}`,
            thumbS3Key:   isBase64Thumb ? null : `${THUMB_FOLDER}${item.vThumb}`,
            base64Data:   isBase64Name  ? item.vMediaName : null,
            thumbBase64:  isBase64Thumb ? item.vThumb     : null,
            previewUrl:   isBase64Name  ? item.vMediaName : `${S3_BASE}${folder}${item.vMediaName}`,
            alreadyUploaded: true,
        };
    });

export default function EditCharacterProfile() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { showMessage } = useMessage();
    const fileInputRef      = useRef(null);
    const dropdownRef       = useRef(null);
    const scrollContainerRef = useRef(null);

    const isEditMode  = location.pathname.includes('edit-character');
    const profileData = location.state?.profileData || {};

    // ── Form state ────────────────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        iArtistCharacterId: profileData.iArtistCharacterId || profileData.id || '',
        iCharacterId:       profileData.iCharacterId || profileData.icharacterId || profileData.icharacterid || '',
        iCharacterKeywordId: (() => {
            const raw = profileData.iCharacterKeywordId || profileData.iKeywordId;
            if (Array.isArray(raw)) return raw.join(',');
            return raw != null ? String(raw) : '';
        })(),
        character:      profileData.vOtherCharacterName ? OTHER_CHARACTER_VALUE : (profileData.vCharacterName || profileData.name || ''),
        otherCharacterName: profileData.vOtherCharacterName || '',
        characterStyle: (() => {
            const raw = profileData.vCharacterStyle || profileData.characterStyle;
            if (Array.isArray(raw)) return raw;
            if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
            if (typeof raw === 'number') return [String(raw)];
            return [];
        })(),
        description: profileData.txDescription || profileData.description || '',
    });

    // Step 4 — Media list: { localFile, isVideo, isCover, s3Key, thumbS3Key, previewUrl, alreadyUploaded }
    const [mediaList, setMediaList] = useState([]);

    const [loadingDetails,      setLoadingDetails]      = useState(isEditMode);
    const [submitting,          setSubmitting]          = useState(false);
    const [errors,              setErrors]              = useState({});
    const [styles,              setStyles]              = useState([]);
    const [myCharacters,        setMyCharacters]        = useState([]);
    const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
    const [currentSlideIndex,   setCurrentSlideIndex]   = useState(0);

    // ── Step 7: load characterdetails on edit page open ───────────────────────
    // This gives us artistCharacterMedia with the exact S3 filenames for all
    // existing media — same call Android makes when opening the edit screen.
    useEffect(() => {
        if (!isEditMode) return;

        const artistCharacterId = profileData.iArtistCharacterId || profileData.id || '';
        if (!artistCharacterId) {
            setLoadingDetails(false);
            return;
        }

        const fetchDetails = async () => {
            try {
                const res = await characterApi.getCharacterDetails(artistCharacterId);
                const data = res.data?.responseData || res.data?.data || res.data || {};

                // Normalise — API may return single object or array
                const detail = Array.isArray(data) ? data[0] : data;
                if (!detail) { setLoadingDetails(false); return; }

                // Pre-fill form fields from the detailed response
                setFormData(prev => ({
                    ...prev,
                    iArtistCharacterId: detail.iArtistCharacterId || prev.iArtistCharacterId,
                    iCharacterId:       detail.vOtherCharacterName ? '' : (detail.iCharacterId || prev.iCharacterId),
                    iCharacterKeywordId: (() => {
                        const raw = detail.iCharacterKeywordId || detail.iKeywordId;
                        if (raw == null) return prev.iCharacterKeywordId;
                        return Array.isArray(raw) ? raw.join(',') : String(raw);
                    })(),
                    character:      detail.vOtherCharacterName ? OTHER_CHARACTER_VALUE : (detail.vCharacterName || prev.character),
                    otherCharacterName: detail.vOtherCharacterName || prev.otherCharacterName,
                    characterStyle: (() => {
                        const raw = detail.vCharacterStyle || detail.characterStyle;
                        if (!raw) return prev.characterStyle;
                        if (Array.isArray(raw)) return raw;
                        if (typeof raw === 'string') return raw.split(',').map(s => s.trim()).filter(Boolean);
                        return prev.characterStyle;
                    })(),
                    description: detail.txDescription || prev.description,
                }));

                // Resolve the same image the list card uses — guaranteed to display correctly
                const rawFallback = profileData.vImage || profileData.vThumbImage ||
                                    profileData.txCharacterPic || profileData.image || '';
                const knownGoodUrl = rawFallback
                    ? (rawFallback.startsWith('data:') || rawFallback.startsWith('http')
                        ? rawFallback
                        : getImageUrl(rawFallback))
                    : '';

                // Build media list from artistCharacterMedia array
                const apiMedia = detail.artistCharacterMedia || detail.txMedia || [];
                if (Array.isArray(apiMedia) && apiMedia.length > 0) {
                    const mapped = mapExistingMedia(apiMedia);
                    // Use the list-card image as previewUrl — it's the same image, known-good
                    if (knownGoodUrl && mapped.length > 0) {
                        mapped[0] = { ...mapped[0], previewUrl: knownGoodUrl };
                    }
                    setMediaList(mapped);
                } else if (knownGoodUrl) {
                    const isDataUrl = knownGoodUrl.startsWith('data:');
                    const filename  = !isDataUrl ? rawFallback.split('/').pop() : null;
                    const folder    = filename?.startsWith('thumbnail_') ? THUMB_FOLDER : IMG_FOLDER;
                    setMediaList([{
                        localFile:   null,
                        isVideo:     false,
                        isCover:     true,
                        s3Key:       !isDataUrl && filename ? `${folder}${filename}` : null,
                        thumbS3Key:  null,
                        base64Data:  isDataUrl ? knownGoodUrl : null,
                        thumbBase64: null,
                        previewUrl:  knownGoodUrl,
                        alreadyUploaded: true,
                    }]);
                }
            } catch (err) {
                console.error('characterdetails error:', err);
                showMessage('Failed to load character details', 'error');
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchDetails();
    }, []);

    // ── Dropdown data (styles + character master list) ────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                // Styles
                let fetchedStyles = [];
                const sRes = await characterApi.getCharacterStyles();
                if (sRes.data?.responseData)      fetchedStyles = sRes.data.responseData;
                else if (sRes.data?.data)         fetchedStyles = sRes.data.data;
                else if (Array.isArray(sRes.data)) fetchedStyles = sRes.data;
                setStyles(fetchedStyles);

                // Master character list (all pages)
                let allChars = [], off = '', more = true;
                while (more) {
                    const cRes = await characterApi.getMyCharactersList(off);
                    let page = [];
                    if (cRes.data?.responseData)       page = Array.isArray(cRes.data.responseData) ? cRes.data.responseData : [cRes.data.responseData];
                    else if (cRes.data?.data)          page = Array.isArray(cRes.data.data) ? cRes.data.data : [cRes.data.data];
                    else if (Array.isArray(cRes.data)) page = cRes.data;
                    allChars = [...allChars, ...page];
                    const nextOff = cRes.data?.responseDataOffset;
                    more = page.length > 0 && nextOff && nextOff > 0 && String(nextOff) !== String(off);
                    if (more) off = String(nextOff);
                }
                setMyCharacters(allChars);

                // Auto-resolve IDs ↔ names for style + character fields
                setFormData(prev => {
                    const next = { ...prev };
                    const ids   = prev.iCharacterKeywordId ? String(prev.iCharacterKeywordId).split(',').map(s => s.trim()).filter(Boolean) : [];
                    const names = Array.isArray(prev.characterStyle) ? prev.characterStyle : [];

                    if (ids.length === 0 && names.length > 0) {
                        const resolved = names.map(n => {
                            const m = fetchedStyles.find(s => (s.vKeyword || s.name) === n);
                            return m ? String(m.iKeywordId || m.iCharacterKeywordId || '') : '';
                        }).filter(Boolean);
                        if (resolved.length) next.iCharacterKeywordId = resolved.join(',');
                    }
                    if (names.length === 0 && ids.length > 0) {
                        const resolved = ids.map(id => {
                            const m = fetchedStyles.find(s => String(s.iKeywordId || s.iCharacterKeywordId || '') === id);
                            return m ? (m.vKeyword || m.name) : '';
                        }).filter(Boolean);
                        if (resolved.length) next.characterStyle = resolved;
                    }
                    if (!next.iCharacterId && prev.character) {
                        const key = prev.character.replace(/[^a-z0-9]/gi, '').toLowerCase();
                        const m   = allChars.find(c => (c.vCharacterName || c.name || '').replace(/[^a-z0-9]/gi, '').toLowerCase() === key);
                        if (m) next.iCharacterId = extractCharId(m);
                    }
                    return next;
                });
            } catch (err) {
                console.error('Dropdown load error:', err);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const close = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsStyleDropdownOpen(false); };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const extractCharId = (obj) => {
        if (!obj) return '';
        if (obj.iCharacterId) return obj.iCharacterId;
        if (obj.id) return obj.id;
        for (const k in obj) {
            if (['icharacterid','characterid','id_character','id'].includes(k.toLowerCase())) return obj[k];
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            if (name === 'character') {
                if (value === OTHER_CHARACTER_VALUE) {
                    next.iCharacterId = '';
                } else {
                    const key = value.replace(/[^a-z0-9]/gi, '').toLowerCase();
                    const m   = myCharacters.find(c => (c.vCharacterName || c.name || '').replace(/[^a-z0-9]/gi, '').toLowerCase() === key);
                    if (m) next.iCharacterId = extractCharId(m);
                    else next.iCharacterId = '';
                }
            }
            return next;
        });
        if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
        if (name === 'character' && errors.otherCharacterName) setErrors(p => ({ ...p, otherCharacterName: null }));
    };

    const handleStyleToggle = (styleObj) => {
        const styleName = styleObj.vKeyword || styleObj.name;
        const styleId   = String(styleObj.iKeywordId || styleObj.iCharacterKeywordId || '');
        setFormData(prev => {
            const curNames = Array.isArray(prev.characterStyle) ? prev.characterStyle : [];
            const curIds   = prev.iCharacterKeywordId ? String(prev.iCharacterKeywordId).split(',').map(s => s.trim()).filter(Boolean) : [];
            const checked  = curNames.includes(styleName) || (styleId && curIds.includes(styleId));
            return {
                ...prev,
                characterStyle:      checked ? curNames.filter(s => s !== styleName) : [...curNames, styleName],
                iCharacterKeywordId: checked
                    ? curIds.filter(id => id !== styleId).join(',')
                    : styleId && !curIds.includes(styleId) ? [...curIds, styleId].join(',') : curIds.join(','),
            };
        });
        if (errors.characterStyle) setErrors(p => ({ ...p, characterStyle: null }));
    };

    // Step 4 — add new files to media list
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const newItems = files.map(file => ({
            localFile: file,
            isVideo: file.type.startsWith('video/'),
            isCover: false,
            s3Key: '', thumbS3Key: '',
            previewUrl: URL.createObjectURL(file),
            alreadyUploaded: false,
        }));
        setMediaList(prev => {
            // Remove existing (default) uploaded items — replace with new selection
            const kept = prev.filter(item => !item.alreadyUploaded);
            const all  = [...kept, ...newItems];
            return all.map((item, i) => ({ ...item, isCover: i === 0 }));
        });
        setCurrentSlideIndex(0);
        if (errors.media) setErrors(p => ({ ...p, media: null }));
        e.target.value = '';
    };

    const handleRemoveMedia = (index) => {
        setMediaList(prev => {
            const next = [...prev];
            if (next[index]?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(next[index].previewUrl);
            next.splice(index, 1);
            return next.map((item, i) => ({ ...item, isCover: i === 0 }));
        });
        setCurrentSlideIndex(prev => (prev > index ? prev - 1 : prev === index && index === mediaList.length - 1 ? Math.max(0, index - 1) : prev));
    };

    const handleScroll = (e) => {
        const idx = Math.round(e.target.scrollLeft / e.target.clientWidth);
        if (idx !== currentSlideIndex) setCurrentSlideIndex(idx);
    };

    const scrollToSlide = (index) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: index * scrollContainerRef.current.clientWidth, behavior: 'smooth' });
        }
        setCurrentSlideIndex(index);
    };

    const validateForm = () => {
        const errs = {};
        if (!mediaList.length)                              errs.media          = 'At least one photo or video is required.';
        if (!formData.character?.trim())                    errs.character      = 'Character selection is required.';
        else if (formData.character === OTHER_CHARACTER_VALUE && !formData.otherCharacterName?.trim()) errs.otherCharacterName = 'Custom character name is required.';
        else if (formData.character !== OTHER_CHARACTER_VALUE && !formData.iCharacterId) errs.character = 'Please select a character from the dropdown list.';
        if (!formData.characterStyle?.length)               errs.characterStyle = 'At least one character style is required.';
        if (!formData.description?.trim())                  errs.description    = 'Description is required.';
        else if (formData.description.trim().length < 10)   errs.description    = 'Description must be at least 10 characters long.';
        setErrors(errs);
        return !Object.keys(errs).length;
    };

    // ── Steps 5–8: build txMedia and call API ─────────────────────────────────
    const handleUpdate = async () => {
        if (!validateForm()) return;
        setSubmitting(true);
        try {
            // Resolve iCharacterId
            const isOtherCharacter = formData.character === OTHER_CHARACTER_VALUE;
            let charId = isOtherCharacter ? '' : formData.iCharacterId;
            if (!isOtherCharacter && !charId && formData.character) {
                const key = formData.character.replace(/[^a-z0-9]/gi, '').toLowerCase();
                const m   = myCharacters.find(c => (c.vCharacterName || c.name || '').replace(/[^a-z0-9]/gi, '').toLowerCase() === key);
                if (m) charId = extractCharId(m);
            }
            if (!isOtherCharacter && !charId) charId = extractCharId(profileData);
            if (!isOtherCharacter && !charId) {
                showMessage('Please select a character from the dropdown before saving.', 'error');
                setSubmitting(false);
                return;
            }

            let txMedia = [];

            // Existing items — send base64 or S3 filename depending on how they were saved
            if (isEditMode) {
                mediaList.filter(m => m.alreadyUploaded).forEach(item => {
                    txMedia.push({
                        vMediaName: item.base64Data  || item.s3Key?.split('/').pop()  || '',
                        vMediaType: item.isVideo ? 'video' : 'image',
                        vFileType:  item.base64Data ? (item.isVideo ? 'video/mp4' : 'image/jpeg') : (item.isVideo ? 'video/mp4' : ''),
                        vThumb:     item.thumbBase64 || item.thumbS3Key?.split('/').pop() || '',
                        tiMarkAsCoverPhoto: item.isCover ? 1 : 0,
                    });
                });
            }

            // New items — convert to base64 (compressed to 50 KB for images)
            const newItems = isEditMode
                ? mediaList.filter(m => !m.alreadyUploaded)
                : mediaList;

            for (const item of newItems) {
                let base64Data, thumbBase64;
                if (!item.isVideo) {
                    base64Data  = await compressImageBase64(item.localFile);
                    thumbBase64 = await generateThumbBase64(item.localFile);
                } else {
                    base64Data  = await fileToBase64(item.localFile);
                    thumbBase64 = await generateVideoThumbBase64(item.localFile);
                }
                txMedia.push({
                    vMediaName: base64Data,
                    vMediaType: item.isVideo ? 'video' : 'image',
                    vFileType:  item.localFile.type || (item.isVideo ? 'video/mp4' : 'image/jpeg'),
                    vThumb:     thumbBase64,
                    tiMarkAsCoverPhoto: item.isCover ? 1 : 0,
                });
            }

            // Enforce cover on position 0
            txMedia = txMedia.map((item, i) => ({ ...item, tiMarkAsCoverPhoto: i === 0 ? 1 : 0 }));

            const payload = isEditMode
                ? {
                    iArtistCharacterId:  formData.iArtistCharacterId || profileData.iArtistCharacterId || '',
                    iCharacterId:        charId,
                    txDescription:       formData.description.trim(),
                    vOtherCharacterName: isOtherCharacter ? formData.otherCharacterName.trim() : '',
                    iCharacterKeywordId: String(formData.iCharacterKeywordId || ''),
                    txMedia,
                }
                : {
                    iCharacterId:        charId,
                    txDescription:       formData.description.trim(),
                    vOtherCharacterName: isOtherCharacter ? formData.otherCharacterName.trim() : '',
                    iCharacterKeywordId: String(formData.iCharacterKeywordId || ''),
                    txMedia,
                };

            const res = await (isEditMode ? characterApi.editCharacter : characterApi.addCharacter)(payload);

            if (res.data?.responseCode === 200) {
                showMessage(res.data?.responseMessage || 'Character saved successfully', 'success');
                // Signal ManageProfiles to re-fetch from server (Android approach)
                navigate('/dashboard/profile/manage-profiles', { state: { needsRefresh: true } });
            } else {
                showMessage(res.data?.responseMessage || 'Save failed', 'error');
            }
        } catch (err) {
            console.error('Submission error:', err);
            showMessage('Failed to save character', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    if (loadingDetails) {
        return (
            <div className="edit-character-container">
                <Header title="Edit Character Profile" />
                <div style={{ padding: '40px', textAlign: 'center' }}>Loading character details...</div>
            </div>
        );
    }

    return (
        <div className="edit-character-container">
            <Header title={isEditMode ? 'Edit Character Profile' : 'Add Character Profile'} />

            <div className="edit-character-form">

                {/* Media carousel */}
                <div className="form-group">
                    <label className="form-label">Upload Character Photos / Videos</label>
                    <div className="upload-container" ref={scrollContainerRef} onScroll={handleScroll}>
                        {mediaList.map((item, idx) => (
                            <div key={idx} className="edit-upload-box">
                                <div className="preview-wrapper">
                                    {item.isVideo
                                        ? <video src={item.previewUrl} className="media-preview" muted playsInline />
                                        : <img src={item.previewUrl} alt={`Media ${idx + 1}`} className="media-preview"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200'; }} />}
                                    <button className="remove-media" onClick={() => handleRemoveMedia(idx)}>×</button>
                                </div>
                            </div>
                        ))}
                        {mediaList.length === 0 && (
                            <div className="edit-upload-box" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                                <div className="upload-content">
                                    <span className="upload-plus">+</span>
                                    <span className="upload-hint">Upload Photo/Video</span>
                                </div>
                            </div>
                        )}
                        {mediaList.length > 0 && (
                            <div className="edit-upload-box add-more-box" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                                <div className="upload-content">
                                    <span className="upload-plus">+</span>
                                    <span className="upload-hint">Upload Photo</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" multiple style={{ display: 'none' }} />
                    <div className="upload-indicator">
                        {mediaList.length > 0
                            ? Array.from({ length: mediaList.length + 1 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`indicator-dot ${i === currentSlideIndex ? 'active' : ''}`}
                                    onClick={() => scrollToSlide(i)}
                                    style={{ cursor: 'pointer' }}
                                />
                              ))
                            : <><span className="indicator-dot active" /><span className="indicator-dot" /></>}
                    </div>
                    {errors.media && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block', textAlign: 'center' }}>{errors.media}</span>}
                </div>

                {/* Character select */}
                <div className="form-group">
                    <label className="form-label">Select Character</label>
                    <div className="select-wrapper">
                        <select name="character" value={formData.character} onChange={handleInputChange} className="form-select">
                            <option value="">Select Character</option>
                            {myCharacters.map((c, i) => {
                                const name = c.vCharacterName || c.name || `Character ${i + 1}`;
                                return <option key={c.iCharacterId || c.id || i} value={name}>{name}</option>;
                            })}
                            <option value={OTHER_CHARACTER_VALUE}>Other</option>
                            {formData.character && formData.character !== OTHER_CHARACTER_VALUE && !myCharacters.some(c => (c.vCharacterName || c.name) === formData.character) && (
                                <option value={formData.character}>{formData.character}</option>
                            )}
                        </select>
                    </div>
                    {errors.character && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.character}</span>}
                    {formData.character === OTHER_CHARACTER_VALUE && (
                        <>
                            <label className="form-label other-character-label">Character Name</label>
                            <input
                                type="text"
                                name="otherCharacterName"
                                value={formData.otherCharacterName}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Enter character name"
                            />
                            {errors.otherCharacterName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.otherCharacterName}</span>}
                        </>
                    )}
                </div>

                {/* Style multi-select */}
                <div className="form-group">
                    <label className="form-label">Select Character Style</label>
                    <div className="select-wrapper" ref={dropdownRef}>
                        <div className="form-select custom-multi-select" onClick={() => setIsStyleDropdownOpen(v => !v)}>
                            {Array.isArray(formData.characterStyle) && formData.characterStyle.length > 0
                                ? formData.characterStyle.join(', ')
                                : <span className="placeholder">Select Style</span>}
                        </div>
                        {isStyleDropdownOpen && (
                            <div className="style-dropdown-list">
                                {styles.map((s, i) => {
                                    const name    = s.vKeyword || s.name;
                                    const sid     = String(s.iKeywordId || s.iCharacterKeywordId || '');
                                    const curN    = Array.isArray(formData.characterStyle) ? formData.characterStyle : [];
                                    const curIds  = formData.iCharacterKeywordId ? String(formData.iCharacterKeywordId).split(',').map(x => x.trim()).filter(Boolean) : [];
                                    const checked = curN.includes(name) || (sid && curIds.includes(sid));
                                    return (
                                        <div key={sid || i} className="style-option" onClick={() => handleStyleToggle(s)}>
                                            <span>{name}</span>
                                            <div className={`custom-checkbox ${checked ? 'checked' : ''}`}>{checked && <span className="checkmark">✓</span>}</div>
                                        </div>
                                    );
                                })}
                                {Array.isArray(formData.characterStyle) && formData.characterStyle
                                    .filter(n => !styles.some(s => (s.vKeyword || s.name) === n))
                                    .map((n, i) => (
                                        <div key={`fb-${i}`} className="style-option" onClick={() => handleStyleToggle({ name: n, iKeywordId: '' })}>
                                            <span>{n}</span>
                                            <div className="custom-checkbox checked"><span className="checkmark">✓</span></div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                    {errors.characterStyle && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.characterStyle}</span>}
                </div>

                {/* Description */}
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-textarea" rows="8" />
                    {errors.description && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
                </div>
            </div>

            <div className="form-actions">
                <button className="action-btn btn-update" onClick={handleUpdate} disabled={submitting}>
                    {submitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update' : 'Add Character')}
                </button>
            </div>
        </div>
    );
}
