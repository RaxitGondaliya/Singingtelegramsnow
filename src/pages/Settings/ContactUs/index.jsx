import React, { useState } from 'react';
import Header from '../../../components/layout/Header/Header';
import { useMessage } from '../../../context/MessageContext';
import { settingsApi } from '../../../api';
import './ContactUs.scss';

export default function ContactUs() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { showMessage } = useMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!subject.trim() || !message.trim()) {
            showMessage('Please fill in both subject and message.', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await settingsApi.contactUs({
                subject,
                message
            });

            if (response.data && (response.data.responseCode === 200 || response.data.status === '1')) {
                showMessage(response.data.responseMessage || response.data.message || 'Thank you for contacting us!', 'success');
                setSubject('');
                setMessage('');
            } else {
                showMessage(response.data.responseMessage || response.data.message || 'Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Contact error:', error);
            showMessage('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-container">
            <Header title="Contact Us" />

            <div className="contact-wrapper">
                <main className="contact-card">
                    <div className="logo-section">
                        <img 
                            src="https://www.singingtelegramsnow.com/images/logo@2x.png" 
                            alt="Singing Telegrams" 
                        />
                        <span>App Version 1.0</span>
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="input-field">
                            <label>Subject</label>
                            <input 
                                type="text"
                                name="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="What is this regarding?"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-field">
                            <label>Message</label>
                            <textarea 
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="How can we help you?"
                                required
                                disabled={loading}
                                rows={5}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Submit Message'}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}
