import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { characterApi } from '../../../api/characterApi';
import { getImageUrl } from '../../../utils/imageUtils';
import { getAllCachedImages } from '../../../utils/imageCache';
import { useMessage } from '../../../context/MessageContext';
import './ManageProfiles.scss';

export default function ManageProfiles() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showMessage, showConfirm } = useMessage();
    const [characters, setCharacters] = useState([]);
    // IndexedDB cache (survives logout) merged with localStorage fallback
    const [localImageOverrides, setLocalImageOverrides] = useState(() => {
        try { return JSON.parse(localStorage.getItem('_stn_char_imgs') || '{}'); }
        catch { return {}; }
    });

    // Load IndexedDB cache on mount and merge into overrides
    useEffect(() => {
        getAllCachedImages().then(cached => {
            if (Object.keys(cached).length > 0) {
                setLocalImageOverrides(prev => ({ ...cached, ...prev }));
            }
        });
    }, []);

    useEffect(() => {
        const { updatedCharacterId, coverPreviewUrl } = location.state || {};
        if (updatedCharacterId && coverPreviewUrl) {
            setLocalImageOverrides(prev => {
                const updated = { ...prev, [updatedCharacterId]: coverPreviewUrl };
                // Blob URLs expire with the session — only persist stable URLs to localStorage
                if (!coverPreviewUrl.startsWith('blob:')) {
                    try { localStorage.setItem('_stn_char_imgs', JSON.stringify(updated)); } catch { /* localStorage full */ }
                }
                return updated;
            });
        }
    }, [location.state]);

    // Infinite Scroll States
    const [loading, setLoading] = useState(true); // Initial full-page load
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false); // Background next-page load
    const [offset, setOffset] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef();

    // Intersection Observer Callback for the bottom element
    const lastElementRef = useCallback(node => {
        if (loading || isFetchingNextPage) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchCharacters(offset);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loading, isFetchingNextPage, hasMore, offset]);

    const fetchCharacters = async (currentOffset) => {
        try {
            if (!currentOffset) setLoading(true);
            else setIsFetchingNextPage(true);

            const res = await characterApi.getCharactersList(currentOffset);

            let newPageData = [];
            if (res.data?.responseData) {
                newPageData = Array.isArray(res.data.responseData)
                    ? res.data.responseData
                    : [res.data.responseData];
            } else if (res.data?.data) {
                newPageData = Array.isArray(res.data.data)
                    ? res.data.data
                    : [res.data.data];
            } else if (Array.isArray(res.data)) {
                newPageData = res.data;
            }

            if (newPageData.length > 0) {
                console.log("Character list raw data:", newPageData.map(c => ({ id: c.iArtistCharacterId, name: c.vCharacterName, vImage: c.vImage, txCharacterPic: c.txCharacterPic })));
                setCharacters(prev => {
                    const getCharId = (c) => c.iArtistCharacterId || c.iCharacterId || c.id;
                    const existingIds = new Set(prev.map(getCharId).filter(Boolean));
                    const uniqueNewData = newPageData.filter(c => {
                        const id = getCharId(c);
                        return !id || !existingIds.has(id);
                    });
                    return [...prev, ...uniqueNewData];
                });
            }

            const returnedOffset = res.data?.responseDataOffset;

            if (newPageData.length > 0 && returnedOffset !== undefined && returnedOffset > 0 && String(returnedOffset) !== String(currentOffset)) {
                setOffset(String(returnedOffset));
                setHasMore(true);
            } else {
                setHasMore(false);
            }

        } catch (error) {
            console.error('Error fetching characters:', error);
            showMessage('Failed to load characters.', 'error');
        } finally {
            setLoading(false);
            setIsFetchingNextPage(false);
        }
    };

    useEffect(() => {
        fetchCharacters('');
    }, []);

    const getStatusLabel = (tiStatus) => {
        const val = Number(tiStatus);
        switch (val) {
            case 1: return 'Active';
            case 2: return 'Inactive';
            default: return tiStatus || 'Active';
        }
    };

    const getStatusClass = (tiStatus) => {
        const val = Number(tiStatus);
        switch (val) {
            case 1: return 'active';
            case 2: return 'inactive';
            default: return 'active';
        }
    };

    const handleDelete = async (characterId) => {
        if (!characterId) {
            showMessage('Character ID not found.', 'error');
            return;
        }

        const confirmed = await showConfirm('Are you sure you want to delete this character?');
        if (confirmed) {
            try {
                const res = await characterApi.deleteCharacter(characterId);

                if (res.data?.responseCode === 200) {
                    showMessage(res.data?.responseMessage || 'Character deleted successfully.', 'success');
                    // Remove from list
                    setCharacters(prev => prev.filter(c => (c.iArtistCharacterId || c.id || c.iCharacterId) !== characterId));
                } else {
                    showMessage(res.data?.responseMessage || 'Failed to delete character.', 'error');
                }
            } catch (error) {
                console.error('Error deleting character:', error);
                showMessage('An error occurred while deleting the character.', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="manage-profiles-container">
                <Header title="Manage Character Profiles" />
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading characters...</div>
            </div>
        );
    }

    return (
        <div className="manage-profiles-container">
            <Header title="Manage Character Profiles" />

            <div className="profiles-list">
                {characters.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', width: '100%' }}>
                        No character profiles found.
                    </div>
                ) : (
                    characters.map((char, index) => {
                        const charId = char.iArtistCharacterId || char.iCharacterId || char.id || `temp-${index}`;
                        const charName = char.vCharacterName || char.name || 'Unknown';
                        const charDesc = char.txDescription || char.description || '';
                        const charPrice = char.fPrice || char.price || '0.00';
                        const charStatus = char.eStatus || getStatusLabel(char.tiStatus);
                        const charStatusClass = char.eStatus
                            ? char.eStatus.toLowerCase()
                            : getStatusClass(char.tiStatus);

                        // Always prefer locally cached preview — backend may return a truncated base64 in vImage
                        let rawImage = localImageOverrides[String(charId)] || '';

                        if (!rawImage) {
                            const apiImage = char.vImage || char.txCharacterPic || char.txCharacterThumb || char.vCharacterImage || char.vCharacterPic || char.image;
                            // Skip base64 values shorter than 500 chars — they are almost certainly truncated/corrupt
                            if (apiImage && apiImage.startsWith('data:') && apiImage.length < 500) {
                                rawImage = '';
                            } else {
                                rawImage = apiImage || '';
                            }
                        }

                        // Handle txMedia array or stringified JSON
                        if (!rawImage && char.txMedia) {
                            try {
                                const media = typeof char.txMedia === 'string' ? JSON.parse(char.txMedia) : char.txMedia;
                                if (Array.isArray(media) && media.length > 0) {
                                    rawImage = media[0].vThumb || media[0].vMedia || media[0].vMediaName;
                                }
                            } catch (e) {
                                console.warn('Failed to parse txMedia:', e);
                            }
                        }

                        const charImage = getImageUrl(rawImage);

                        return (
                            <div key={charId} className="profile-card">
                                <div className="card-content">
                                    <div className="profile-image-wrapper">
                                        <img
                                            src={charImage}
                                            alt={charName}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/100x100';
                                            }}
                                        />
                                    </div>
                                    <div className="profile-info">
                                        <h3 className="profile-name">{charName}</h3>
                                        <p className="profile-description">{charDesc}</p>
                                        <div className="profile-price-status">
                                            <span className="profile-price">${parseFloat(charPrice).toFixed(2)}</span>
                                            <span className={`status-badge ${charStatusClass}`}>
                                                {charStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="action-btn btn-delete"
                                        onClick={() => handleDelete(char.iArtistCharacterId || char.id || charId)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="action-btn btn-edit"
                                        onClick={() => navigate('/dashboard/profile/edit-character', { state: { profileData: char } })}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Sentinel element for infinite scroll */}
                {hasMore && !loading && (
                    <div ref={lastElementRef} style={{ width: '100%', padding: '20px', textAlign: 'center' }}>
                        {isFetchingNextPage ? 'Loading more characters...' : ''}
                    </div>
                )}
            </div>

            <div className="manage-profiles-footer">
                <button
                    className="add-profile-btn"
                    onClick={() => navigate('/dashboard/profile/add-character')}
                >
                    + Add Another Character Profile
                </button>
            </div>
        </div>
    );
}
