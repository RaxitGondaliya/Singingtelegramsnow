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
                showMessage(response.data.responseMessage || response.data.message || 'Thank you for contacting us! We will get back to you soon.', 'success');
                setSubject('');
                setMessage('');
            } else {
                showMessage(response.data.responseMessage || response.data.message || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Contact Us Error:', error);
            showMessage('An error occurred while sending your message. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-us-container">
            <Header title="Contact Us" />

            <div className="contact-us-content">
                <div className="logo-section">
                    <img
                        src="https://www.singingtelegramsnow.com/images/logo@2x.png"
                        alt="Logo"
                        className="contact-logo"
                    />
                    <p className="app-version">App Version 1.0</p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter subject"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message"
                            required
                            disabled={loading}
                            rows={5}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`submit-btn ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
