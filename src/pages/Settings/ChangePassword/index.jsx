import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import { useMessage } from '../../../context/MessageContext';
import { settingsApi } from '../../../api';
import './ChangePassword.scss';

export default function ChangePassword() {
    const navigate = useNavigate();
    const { showMessage } = useMessage();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwords.current || !passwords.new || !passwords.confirm) {
            showMessage('All fields are required.', 'error');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            showMessage('Passwords do not match.', 'error');
            return;
        }

        if (passwords.new.length < 6) {
            showMessage('Password must be at least 6 characters.', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await settingsApi.changePassword({
                oldPassword: passwords.current,
                newPassword: passwords.new
            });

            if (response.data && (response.data.responseCode === 200 || response.data.status === '1')) {
                showMessage(response.data.responseMessage || 'Password changed successfully!', 'success');
                setPasswords({ current: '', new: '', confirm: '' });
                setTimeout(() => navigate('/dashboard/settings'), 1500);
            } else {
                showMessage(response.data.responseMessage || 'Failed to change password.', 'error');
            }
        } catch (error) {
            console.error('Change Pass error:', error);
            showMessage('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-container">
            <Header title="Change Password" onBack={() => navigate(-1)} />

            <div className="change-password-wrapper">
                <main className="change-card">
                    <h2>Update Password</h2>

                    <form className="change-form" onSubmit={handleSubmit}>
                        <div className="input-field">
                            <label>Current Password</label>
                            <input 
                                type="password" 
                                name="current"
                                value={passwords.current}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-field">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                name="new"
                                value={passwords.new}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-field">
                            <label>Confirm New Password</label>
                            <input 
                                type="password" 
                                name="confirm"
                                value={passwords.confirm}
                                onChange={handleChange}
                                placeholder="Re-type new password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={loading}
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
