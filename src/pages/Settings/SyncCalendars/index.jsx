import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { settingsApi } from '../../../api/settingsApi'; // Ensure path is correct
import './SyncCalendars.scss';
import Header from '../../../components/layout/Header/Header';
import ToggleSwitch from '../../../components/common/ToggleSwitch/ToggleSwitch';

export default function SyncCalendars() {
    const navigate = useNavigate();
    const location = useLocation();
    const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Initial log to check component mount
    console.log("SyncCalendars component rendered. Current State:", { googleSyncEnabled });

    const handleGoogleLogin = () => {
        console.log("Initiating Google Login Redirect...");
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
            console.log("✅ Step 1: Auth Code received from Google:", authCode);

            const completeSyncProcess = async () => {
                setIsSyncing(true);
                try {
                    // Step 2: Update Token
                    console.log("⏳ Step 2: Calling updateSyncCalendarToken API...");
                    const tokenResponse = await settingsApi.updateSyncCalendarToken(authCode);
                    console.log("✅ Token API Success:", tokenResponse.data);

                    // Step 3: Update Flag
                    console.log("⏳ Step 3: Calling updateSyncCalendarFlag API (Value: 1)...");
                    const flagResponse = await settingsApi.updateSyncCalendarFlag('1', authCode);
                    console.log("✅ Flag API Success:", flagResponse.data);

                    setGoogleSyncEnabled(true);
                    console.log("🎉 Sync Process Completed Successfully!");

                    // Clean the URL to avoid re-triggering the effect on refresh
                    navigate('/dashboard/sync-calendars', { replace: true });
                    console.log("URL cleaned (code removed)");

                } catch (error) {
                    console.error("❌ Sync Process Failed!");
                    console.error("Error details:", error.response ? error.response.data : error.message);
                    alert("Sync failed. Check console for details.");
                } finally {
                    setIsSyncing(false);
                }
            };
            completeSyncProcess();
        } else {
            console.log("ℹ️ No auth code found in URL. Waiting for user action.");
        }
    }, [location, navigate]);

    const handleToggle = async () => {
        if (!googleSyncEnabled) {
            handleGoogleLogin();
        } else {
            console.log("⏳ Disabling Sync: Calling API with flag '0'...");
            try {
                await settingsApi.updateSyncCalendarFlag('0', '');
                setGoogleSyncEnabled(false);
                console.log("✅ Sync Disabled successfully.");
            } catch (error) {
                console.error("❌ Failed to disable sync:", error);
            }
        }
    };

    return (
        <div className="sync-calendars-container">
            <Header title="Sync Calendars" />

            <div className="sync-calendars-content">
                <p className="description">
                    It'll help to auto update booking availability of Singing Telegrams Now.
                </p>

                <div className="calendar-sync-item">
                    <div className="calendar-icon-wrapper">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg"
                            alt="Google Calendar"
                            className="calendar-icon"
                        />
                    </div>
                    <span className="calendar-name">
                        {isSyncing ? "Syncing (Check Console)..." : "Google Calendar"}
                    </span>
                    <ToggleSwitch
                        active={googleSyncEnabled}
                        onClick={handleToggle}
                        disabled={isSyncing}
                    />
                </div>

                <div className="footer-note">
                    You can sync calendar under app settings.
                </div>
            </div>
        </div>
    );
}