import React from 'react';
import Header from '../../../components/layout/Header/Header';
import '../../../styles/components/_legal.scss';

export default function PrivacyPolicy() {
    return (
        <div className="legal-container">
            <Header title="Privacy Policy" />
            
            <div className="legal-content-wrapper">
                <main className="legal-card">
                    <h2 style={{ color: '#d32f2f', marginBottom: '1.5rem' }}>
                        How To Delete Your User Account: Please email info+deleteaccount@singingtelegramsnow.com and your account will be deleted within 24-48 hours.
                    </h2>

                    <p style={{ textAlign: 'center' }}>***</p>

                    <p>
                        This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.
                    </p>

                    <h2>What personal information do we collect from the people that visit our blog, website or app?</h2>
                    <p>
                        When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, credit card information or other details to help you with your experience.
                    </p>

                    <h2>When do we collect information?</h2>
                    <p>
                        We collect information from you when you place an order, subscribe to a newsletter or enter information on our site.
                    </p>

                    <h2>How do we use your information?</h2>
                    <p>
                        We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, visit the website, or use certain other site features in the following ways:
                    </p>
                    <ul>
                        <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
                        <li>To improve our website in order to better serve you.</li>
                        <li>To allow us to better service you in responding to your customer service requests.</li>
                        <li>To quickly process your transactions.</li>
                        <li>To send periodic emails or SMS text messages regarding your order or other products and services.</li>
                        <li>To follow up with you after correspondence (live chat, email, SMS text message, or phone inquiries)</li>
                    </ul>

                    <h2>How do we protect your information?</h2>
                    <p>Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.</p>
                    <p>We use regular Malware Scanning.</p>
                    <p>
                        Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.
                    </p>
                    <p>
                        We implement a variety of security measures when a user places an order, enters, submits, or accesses their information to maintain the safety of your personal information.
                    </p>
                    <p>All transactions are processed through a gateway provider and are not stored or processed on our servers.</p>

                    <h2>Do we use 'cookies'?</h2>
                    <p>We use cookies for tracking purposes.</p>
                    <p>
                        You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since each browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.
                    </p>
                    <p>If you turn cookies off, some features will be disabled. Features that make your site experience more efficient and may not function properly.</p>
                    <p>However, you will still be able to place orders.</p>
                    <p>
                        Our website uses Google Analytics, a service with transmits website traffic data to Google servers in the US. Google Analytics does not identify individual users or associate your IP address with any other data held by Google. We use reports provided by Google Analytics to help us understand website traffic and web page usage. You can opt-out of Google Analytics cookie by using this Google Analytics Opt-Out Add-on.
                    </p>

                    <h2>Third-party disclosure</h2>
                    <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.</p>

                    <h2>Third-party links</h2>
                    <p>We do not include or offer third-party products or services on our website.</p>

                    <h2>Google</h2>
                    <p>
                        Google's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to provide a positive experience for users. https://support.google.com/adwordspolicy/answer/1316548?hl=en
                    </p>
                    <p>We use Google AdSense Advertising on our website.</p>
                    <p>
                        Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
                    </p>
                    <p>We have implemented the following:</p>
                    <ul>
                        <li>Remarketing with Google AdSense</li>
                        <li>Google Display Network Impression Reporting</li>
                        <li>Demographics and Interests Reporting</li>
                    </ul>

                    <h2>California Online Privacy Protection Act</h2>
                    <p>
                        CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared.
                    </p>

                    <h2>Fair Information Practices</h2>
                    <p>
                        The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe.
                    </p>

                    <h2>CAN SPAM Act</h2>
                    <p>
                        The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.
                    </p>

                    <div style={{ backgroundColor: '#f0f4f9', padding: '2rem', borderRadius: '12px', marginTop: '2rem' }}>
                        <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Contacting Us</p>
                        <p>www.singingtelegramsnow.com</p>
                        <p>800-775-4530</p>
                        <p>info@singingtelegramsnow.com</p>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '2rem' }}>Last Edited on 11/5/2018</p>
                    </div>
                </main>
            </div>
        </div>
    );
}