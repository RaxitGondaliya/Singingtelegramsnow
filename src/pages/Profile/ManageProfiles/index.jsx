import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { characterApi } from '../../../api/characterApi';
import { getImageUrl } from '../../../utils/imageUtils';
import './ManageProfiles.scss';

export default function ManageProfiles() {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                setLoading(true);
                const res = await characterApi.getCharactersList();
                console.log('Characters list response:', res.data);

                let data = [];
                if (res.data?.responseData) {
                    data = Array.isArray(res.data.responseData)
                        ? res.data.responseData
                        : [res.data.responseData];
                } else if (res.data?.data) {
                    data = Array.isArray(res.data.data)
                        ? res.data.data
                        : [res.data.data];
                } else if (Array.isArray(res.data)) {
                    data = res.data;
                }

                setCharacters(data);
            } catch (error) {
                console.error('Error fetching characters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
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
                        const charId = char.iCharacterId || char.id || index;
                        const charName = char.vCharacterName || char.name || 'Unknown';
                        const charDesc = char.txDescription || char.description || '';
                        const charPrice = char.fPrice || char.price || '0.00';
                        const charStatus = char.eStatus || getStatusLabel(char.tiStatus);
                        const charStatusClass = char.eStatus
                            ? char.eStatus.toLowerCase()
                            : getStatusClass(char.tiStatus);

                        const charImage = getImageUrl(char.vImage || char.txCharacterPic || char.image);

                        return (
                            <div key={charId} className="profile-card">
                                <div className="card-content">
                                    <div className="profile-image-wrapper">
                                        <img src={charImage} alt={charName} />
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
                                    <button className="action-btn btn-delete">Delete</button>
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
