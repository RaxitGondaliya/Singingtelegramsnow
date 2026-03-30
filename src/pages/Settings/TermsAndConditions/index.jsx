import React from 'react';
import Header from '../../../components/layout/Header/Header';
import '../../../styles/components/_legal.scss';

export default function TermsAndConditions() {
    return (
        <div className="legal-container">
            <Header title="Terms & Conditions" />
            
            <div className="legal-content-wrapper">
                <main className="legal-card">
                    <h1>Terms and Conditions</h1>

                    <p>
                        Welcome to www.singingtelegramsnow.com. The www.singingtelegramsnow.com website (the "Site") is comprised of various web pages operated by Singing Telegrams Now ("STN"). www.singingtelegramsnow.com is offered to you conditioned on your acceptance without modification of the terms, conditions, and notices contained herein (the "Terms"). Your use of www.singingtelegramsnow.com constitutes your agreement to all such Terms. Please read these terms carefully, and keep a copy of them for your reference.
                    </p>

                    <p>
                        Singing Telegrams Now (STN) offers users a website for the purpose of browsing and ordering singing telegrams for entertainment purposes. Singing telegrams are ~10 minute comedy and musical acts performed by costumed entertainers for birthdays, corporate events, anniversaries, holidays, graduations, and all other special occasions.
                    </p>

                    <h2>Privacy</h2>
                    <p>
                        Your use of www.singingtelegramsnow.com is subject to STN's Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
                    </p>

                    <h2>Electronic Communications</h2>
                    <p>
                        Visiting www.singingtelegramsnow.com or sending emails to STN constitutes electronic communications. You consent to receive electronic communications including email and sms messaging, and you agree that all agreements, notices, disclosures and other communications that we provide to you electronically, via email and/or sms, and on the Site, satisfy any legal requirement that such communications be in writing.
                    </p>

                    <h2>Your Account</h2>
                    <p>
                        If you use this site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password. You may not assign or otherwise transfer your account to any other person or entity. You acknowledge that STN is not responsible for third party access to your account that results from theft or misappropriation of your account. STN and its associates reserve the right to refuse or cancel service, terminate accounts, or remove or edit content in our sole discretion.
                    </p>

                    <h2>Children Under Thirteen</h2>
                    <p>
                        STN does not knowingly collect, either online or offline, personal information from persons under the age of thirteen. If you are under 18, you may use www.singingtelegramsnow.com only with permission of a parent or guardian.
                    </p>

                    <h2>Cancellation/Refund Policy</h2>
                    <p>
                        We recognize that sometimes plans change and we will do our best to be flexible. That said, we do need to honor that our entertainers are in demand. When the entertainers accept a booking, they block their schedules, and that means that they aren't available at that time for other bookings.
                    </p>

                    <h2>No Unlawful or Prohibited Use</h2>
                    <p>
                        You are granted a non-exclusive, non-transferable, revocable license to access and use www.singingtelegramsnow.com strictly in accordance with these terms of use. As a condition of your use of the Site, you warrant to STN that you will not use the Site for any purpose that is unlawful or prohibited by these Terms.
                    </p>

                    <h2>Liability Disclaimer</h2>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}>
                        THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR TYPOGRAPHICAL ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN. SINGING TELEGRAMS NOW AND/OR ITS SUPPLIERS MAY MAKE IMPROVEMENTS AND/OR CHANGES IN THE SITE AT ANY TIME.
                    </p>

                    <div style={{ backgroundColor: '#f0f4f9', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
                        <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Contact Us</p>
                        <p>Singing Telegrams Now</p>
                        <p>118 Tocoloma Ave</p>
                        <p>San Francisco, California 94134</p>
                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Email:</strong> info@singingtelegramsnow.com</p>
                            <p><strong>Phone:</strong> 800-775-4530</p>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '2rem' }}>Effective as of November 01, 2018</p>
                    </div>
                </main>
            </div>
        </div>
    );
}
