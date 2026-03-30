import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { characterApi } from '../../../api/characterApi';
import { getImageUrl } from '../../../utils/imageUtils';
import { useMessage } from '../../../context/MessageContext';
import './ManageProfiles.scss';

// SVG Icons
const EditIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const AddIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


export default function ManageProfiles() {
    const navigate = useNavigate();
    const { showMessage, showConfirm } = useMessage();
    const [characters, setCharacters] = useState([]);

    // Infinite Scroll States
    const [loading, setLoading] = useState(true); 
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false); 
    const [offset, setOffset] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef();

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
                newPageData = Array.isArray(res.data.responseData) ? res.data.responseData : [res.data.responseData];
            } else if (res.data?.data) {
                newPageData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            }

            if (newPageData.length > 0) {
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

    const handleDelete = async (characterId) => {
        const confirmed = await showConfirm('Are you sure you want to delete this character?');
        if (confirmed) {
            try {
                const res = await characterApi.deleteCharacter(characterId);
                if (res.data?.responseCode === 200) {
                    showMessage('Character deleted successfully.', 'success');
                    setCharacters(prev => prev.filter(c => (c.iArtistCharacterId || c.id || c.iCharacterId) !== characterId));
                } else {
                    showMessage(res.data?.responseMessage || 'Failed to delete', 'error');
                }
            } catch (error) {
                console.error('Error deleting character:', error);
                showMessage('Error occurred while deleting.', 'error');
            }
        }
    };

    const getStatusInfo = (tiStatus, eStatus) => {
        if (eStatus) return { label: eStatus, cls: eStatus.toLowerCase() === 'active' ? 'success' : 'error' };
        const val = Number(tiStatus);
        switch (val) {
            case 1: return { label: 'Active', cls: 'success' };
            case 2: return { label: 'Inactive', cls: 'error' };
            default: return { label: 'Active', cls: 'success' };
        }
    };

    return (
        <div className="manage-profiles-container">
            <Header title="Manage Character Profiles" />

            <div className="manage-profiles-grid">
                {loading && !characters.length ? (
                    <div className="loading-wrap">Loading...</div>
                ) : characters.length === 0 ? (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', color: '#666', padding: '3rem' }}>No character profiles found.</div>
                ) : (
                    <>
                        {characters.map((char, index) => {
                            const charId = char.iArtistCharacterId || char.iCharacterId || char.id || `temp-${index}`;
                            const charName = char.vCharacterName || char.name || 'Unknown';
                            const charDesc = char.txDescription || char.description || '';
                            const charPrice = char.fPrice || char.price || '0.00';
                            const status = getStatusInfo(char.tiStatus, char.eStatus);

                            let rawImage = char.vImage || char.txCharacterPic || char.vCharacterImage || char.image;
                            if (!rawImage && char.txMedia) {
                                try {
                                    const media = typeof char.txMedia === 'string' ? JSON.parse(char.txMedia) : char.txMedia;
                                    if (Array.isArray(media) && media.length > 0) {
                                        rawImage = media[0].vMedia || media[0].vMediaName || media[0].vThumb;
                                    }
                                } catch (e) {}
                            }
                            const charImage = getImageUrl(rawImage);

                            return (
                                <div className="profile-card" key={charId}>
                                    <div className="card-body">
                                        <div className="info-layout">
                                            <img src={charImage} alt="" />
                                            <div className="details">
                                                <div className="name-row">
                                                    <h4>{charName}</h4>
                                                    <div className={`status-chip ${status.cls}`}>{status.label}</div>
                                                </div>
                                                <p className="description">{charDesc}</p>
                                                <div className="price">${parseFloat(charPrice).toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="divider" />
                                        <div className="card-actions">
                                            <button className="btn btn-outline-error" onClick={() => handleDelete(charId)}>
                                                <TrashIcon /> Delete
                                            </button>
                                            <button className="btn btn-primary" onClick={() => navigate('/dashboard/profile/edit-character', { state: { profileData: char } })}>
                                                <EditIcon /> Edit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {hasMore && (
                            <div ref={lastElementRef} style={{ gridColumn: '1/-1', textAlign: 'center', padding: '1rem' }}>
                                {isFetchingNextPage ? 'Loading more...' : ''}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="bottom-add-panel">
                <button className="add-btn" onClick={() => navigate('/dashboard/profile/add-character')}>
                    <AddIcon /> Add Another Character Profile
                </button>
            </div>
        </div>
    );
}
