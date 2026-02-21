import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SyncCalendars.scss';
import Header from '../../../components/layout/Header/Header';
import ToggleSwitch from '../../../components/common/ToggleSwitch/ToggleSwitch';

export default function SyncCalendars() {
    const navigate = useNavigate();
    const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false);

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
                    <span className="calendar-name">Google Calendar</span>
                    <ToggleSwitch
                        active={googleSyncEnabled}
                        onClick={() => setGoogleSyncEnabled(!googleSyncEnabled)}
                    />
                </div>

                <div className="footer-note">
                    You can sync calendar under app settings.
                </div>
            </div>
        </div>
    );
}
