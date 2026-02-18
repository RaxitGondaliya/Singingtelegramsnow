import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';
import Header from '../../components/Header';

export default function AboutUs() {
    const navigate = useNavigate();

    return (
        <div className="about-us-container">
            <Header title="About Us" />

            <div className="about-us-content">
                <h2 className="company-name">Singing Telegrams Now</h2>

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
            </div>
        </div>
    );
}
