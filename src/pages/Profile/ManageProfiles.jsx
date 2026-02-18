import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './ManageProfiles.css';

const characters = [
    {
        id: 1,
        name: "Austin Powers",
        description: "Yeah, baby, yeah! This shagadelic secret agent recently defrosted from the sixties is a master of disguise and a hit with the ladies.",
        price: "10.00",
        status: "Active",
        image: "https://www.singingtelegramsnow.com/images/austinpowers.jpg" // Placeholder based on design
    }
];

export default function ManageProfiles() {
    const navigate = useNavigate();
    return (
        <div className="manage-profiles-container">
            <Header title="Manage Character Profiles" />

            <div className="profiles-list">
                {characters.map(char => (
                    <div key={char.id} className="profile-card">
                        <div className="card-content">
                            <div className="profile-image-wrapper">
                                <img src={char.image} alt={char.name} />
                            </div>
                            <div className="profile-info">
                                <h3 className="profile-name">{char.name}</h3>
                                <p className="profile-description">{char.description}</p>
                                <div className="profile-price-status">
                                    <span className="profile-price">${char.price}</span>
                                    <span className={`status-badge ${char.status.toLowerCase()}`}>
                                        {char.status}
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
                ))}
            </div>

            <div className="manage-profiles-footer">
                <button
                    className="add-profile-btn"
                    onClick={() => navigate('/dashboard/profile/add-character')}
                >
                    +Add Another Character Profile
                </button>
            </div>
        </div>
    );
}
