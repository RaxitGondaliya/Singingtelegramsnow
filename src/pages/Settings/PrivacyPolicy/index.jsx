import React from 'react';
import Header from '../../../components/layout/Header/Header';
import './PrivacyPolicy.scss';

export default function PrivacyPolicy() {
    return (
        <div className="privacy-policy-container">
            <Header title="Privacy Policy" />
            <div className="privacy-content">
                <h2>How To Delete Your User Account: Please email info+deleteaccount@singingtelegrams and your account will be deleted within 24-48 hours.</h2>

                <p className="stars">***</p>

                <p>
                    This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.
                </p>

                <h3>What personal information do we collect from the people that visit our blog, website or app?</h3>

                <p>
                    When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, credit card information or other details to help you with your experience.
                </p>

                <h3>When do we collect information?</h3>

                <p>
                    We collect information from you when you place an order, subscribe to a newsletter or enter information on our site.
                </p>

                <h3>How do we use your information?</h3>

                <p>
                    We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, visit the website, or use certain other site features in the following ways:
                </p>

                <ul>
                    <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
                </ul>
            </div>
        </div>
    );
}
