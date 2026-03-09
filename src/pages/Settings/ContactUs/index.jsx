import React, { useState } from 'react';
import Header from '../../../components/layout/Header/Header';
import { useMessage } from '../../../context/MessageContext';
import './ContactUs.scss';

export default function ContactUs() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const { showMessage } = useMessage();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { subject, message });
        showMessage('Thank you for contacting us! We will get back to you soon.', 'success');
        setSubject('');
        setMessage('');
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
                            placeholder=""
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <input
                            type="text"
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            </div>
        </div>
    );
}
