import React from 'react';
import Header from '../../../components/layout/Header/Header';
import '../../../styles/components/_legal.scss';

export default function AboutUs() {
    return (
        <div className="legal-container">
            <Header title="About Us" />
            <div className="legal-content-wrapper">
                <main className="legal-card">
                    <h1>Singing Telegrams Now</h1>
                    <p>
                        Our mission is to create unforgettable celebrations for our clients. We provide the highest quality entertainment designed to surprise and delight our recipients, making their special occasions spectacular.
                    </p>
                    <p>
                        We are committed to giving our customers easy, seamless, dependable, and fun experiences.
                    </p>
                    <p>
                        We are committed to treating our entertainers with respect; giving them a joyful and profitable way to perform frequently, while maintaining flexibility.
                    </p>
                    <p>
                        We are committed to growing Singing Telegrams Now to every major city in the US and making the world a more jovial place.
                    </p>
                </main>
            </div>
        </div>
    );
}
