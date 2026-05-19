import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { characterApi } from '../../../api/characterApi';
import { getImageUrl } from '../../../utils/imageUtils';
import { useMessage } from '../../../context/MessageContext';
import './ManageProfiles.scss';

export default function ManageProfiles() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { showMessage, showConfirm } = useMessage();

    const [characters,        setCharacters]        = useState([]);
    const [loading,           setLoading]           = useState(true);
    const [isFetchingNextPage,setIsFetchingNextPage] = useState(false);
    const [offset,            setOffset]            = useState('');
    const [hasMore,           setHasMore]           = useState(true);
    // Incrementing this key causes a full list reset + re-fetch from page 1.
    const [refreshKey,        setRefreshKey]        = useState(0);

    const observerRef = useRef();

    // ── Detect return from add/edit and trigger a fresh list fetch ────────────
    // This mirrors Android: after saving, the list screen always re-fetches
    // from the server so the correct S3 filenames are shown — no guessing.
    useEffect(() => {
        if (!location.state?.needsRefresh) return;
        // Clear the signal from history so a manual page refresh doesn't re-trigger
        navigate(location.pathname, { replace: true, state: {} });
        setRefreshKey(k => k + 1);
    }, [location.state]);

    // ── Fetch one page of characters ─────────────────────────────────────────
    const fetchCharacters = useCallback(async (currentOffset) => {
        try {
            if (!currentOffset) setLoading(true);
            else setIsFetchingNextPage(true);

            const res = await characterApi.getCharactersList(currentOffset);

            let pageData = [];
            if (res.data?.responseData) {
                pageData = Array.isArray(res.data.responseData) ? res.data.responseData : [res.data.responseData];
            } else if (res.data?.data) {
                pageData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            } else if (Array.isArray(res.data)) {
                pageData = res.data;
            }

            if (pageData.length > 0) {
                setCharacters(prev => {
                    const getId = c => c.iArtistCharacterId || c.iCharacterId || c.id;
                    const seen  = new Set(prev.map(getId).filter(Boolean));
                    return [...prev, ...pageData.filter(c => { const id = getId(c); return !id || !seen.has(id); })];
                });
            }

            const nextOffset = res.data?.responseDataOffset;
            if (pageData.length > 0 && nextOffset && nextOffset > 0 && String(nextOffset) !== String(currentOffset)) {
                setOffset(String(nextOffset));
                setHasMore(true);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error fetching characters:', err);
            showMessage('Failed to load characters.', 'error');
        } finally {
            setLoading(false);
            setIsFetchingNextPage(false);
        }
    }, [showMessage]);

    // ── Reset list and re-fetch from page 1 whenever refreshKey changes ───────
    // refreshKey = 0 on initial mount, incremented after each add/edit save.
    useEffect(() => {
        setCharacters([]);
        setOffset('');
        setHasMore(true);
        fetchCharacters('');
    }, [refreshKey]);

    // ── Infinite scroll sentinel ──────────────────────────────────────────────
    const lastElementRef = useCallback(node => {
        if (loading || isFetchingNextPage) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) fetchCharacters(offset);
        });
        if (node) observerRef.current.observe(node);
    }, [loading, isFetchingNextPage, hasMore, offset]);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const getStatusLabel = (tiStatus) => {
        const v = Number(tiStatus);
        return v === 1 ? 'Active' : v === 2 ? 'Inactive' : (tiStatus || 'Active');
    };
    const getStatusClass = (tiStatus) => {
        const v = Number(tiStatus);
        return v === 1 ? 'active' : v === 2 ? 'inactive' : 'active';
    };

    const handleDelete = async (characterId) => {
        if (!characterId) { showMessage('Character ID not found.', 'error'); return; }
        const confirmed = await showConfirm('Are you sure you want to delete this character?');
        if (!confirmed) return;
        try {
            const res = await characterApi.deleteCharacter(characterId);
            if (res.data?.responseCode === 200) {
                showMessage(res.data?.responseMessage || 'Deleted successfully.', 'success');
                setCharacters(prev => prev.filter(c => (c.iArtistCharacterId || c.id || c.iCharacterId) !== characterId));
            } else {
                showMessage(res.data?.responseMessage || 'Failed to delete.', 'error');
            }
        } catch (err) {
            console.error('Delete error:', err);
            showMessage('An error occurred while deleting.', 'error');
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
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
                        const charId        = char.iArtistCharacterId || char.iCharacterId || char.id || `temp-${index}`;
                        const charName      = char.vCharacterName || char.name || 'Unknown';
                        const charDesc      = char.txDescription  || char.description || '';
                        const charPrice     = char.fPrice || char.price || '0.00';
                        const charStatus    = char.eStatus || getStatusLabel(char.tiStatus);
                        const charStatusCls = char.eStatus ? char.eStatus.toLowerCase() : getStatusClass(char.tiStatus);
                        const rawImage      = char.vImage || char.vThumbImage || char.txCharacterPic || char.txCharacterThumb || char.image || '';
                        const charImage     = getImageUrl(rawImage);

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
                                            <span className={`status-badge ${charStatusCls}`}>{charStatus}</span>
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
