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
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwords.current || !passwords.new || !passwords.confirm) {
            showMessage('All fields are required.', 'error');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            showMessage('New password and confirm password do not match.', 'error');
            return;
        }

        if (passwords.new.length < 6) {
            showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await settingsApi.changePassword({
                oldPassword: passwords.current,
                newPassword: passwords.new
            });

            if (response.data && (response.data.responseCode === 200 || response.data.status === '1')) {
                showMessage(response.data.responseMessage || response.data.message || 'Password changed successfully!', 'success');
                setPasswords({ current: '', new: '', confirm: '' });
                // Optional: navigate back or to profile
                // setTimeout(() => navigate('/profile'), 2000);
            } else {
                showMessage(response.data.responseMessage || response.data.message || 'Failed to change password.', 'error');
            }
        } catch (error) {
            console.error('Change Password Error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-container">
            <Header title="Change Password" />

            <form className="change-password-content" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className={`change-password-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Changing...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
}
