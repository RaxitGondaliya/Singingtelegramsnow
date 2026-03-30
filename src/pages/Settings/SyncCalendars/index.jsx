import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { settingsApi } from '../../../api/settingsApi';
import Header from '../../../components/layout/Header/Header';
import './SyncCalendars.scss';

export default function SyncCalendars() {
    const navigate = useNavigate();
    const location = useLocation();
    const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleGoogleLogin = () => {
        const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const options = {
            client_id: "956236783328-u60u23g634bc0m11hvr3jh671urjrl4j.apps.googleusercontent.com",
            redirect_uri: "http://localhost:5173/dashboard/sync-calendars",
            response_type: "code",
            scope: "https://www.googleapis.com/auth/calendar.readonly",
            access_type: "offline",
            prompt: "consent",
        };

        const queryString = new URLSearchParams(options).toString();
        window.location.href = `${rootUrl}?${queryString}`;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const authCode = urlParams.get('code');

        if (authCode) {
            const completeSyncProcess = async () => {
                setIsSyncing(true);
                try {
                    await settingsApi.updateSyncCalendarToken(authCode);
                    await settingsApi.updateSyncCalendarFlag('1', authCode);
                    setGoogleSyncEnabled(true);
                    navigate('/dashboard/sync-calendars', { replace: true });
                } catch (error) {
                    console.error("Sync Process Failed!", error);
                    alert("Sync failed. Check console for details.");
                } finally {
                    setIsSyncing(false);
                }
            };
            completeSyncProcess();
        }
    }, [location, navigate]);

    const handleToggle = async (e) => {
        const isChecked = e.target.checked;
        if (isChecked && !googleSyncEnabled) {
            handleGoogleLogin();
        } else if (!isChecked && googleSyncEnabled) {
            try {
                await settingsApi.updateSyncCalendarFlag('0', '');
                setGoogleSyncEnabled(false);
            } catch (error) {
                console.error("Failed to disable sync:", error);
            }
        }
    };

    return (
        <div className="sync-container">
            <Header title="Sync Calendars" onBack={() => navigate(-1)} />

            <div className="sync-wrapper">
                <p className="sync-intro">
                    It'll help to auto update booking availability of Singing Telegrams Now.
                </p>

                <main className="sync-card">
                    <div className="sync-info">
                        <div className="icon-box">
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" 
                                alt="Google Calendar" 
                            />
                        </div>
                        <div className="text-box">
                            <h3>Google Calendar</h3>
                            {isSyncing && (
                                <div className="sync-status">
                                    <div className="spinner" />
                                    <span>Syncing...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <label className="custom-switch">
                        <input 
                            type="checkbox" 
                            checked={googleSyncEnabled}
                            onChange={handleToggle}
                            disabled={isSyncing}
                        />
                        <span className="slider round"></span>
                    </label>
                </main>

                <span className="sync-footer-text">
                    You can sync calendar under app settings.
                </span>
            </div>
        </div>
    );
}