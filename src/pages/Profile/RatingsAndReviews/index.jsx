import React, { useState, useEffect } from 'react';
import Header from '../../../components/layout/Header/Header';
import { ratingApi } from '../../../api/ratingApi';
import './RatingsAndReviews.scss';

// SVG Icons
const PersonIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const StarIcon = ({ filled, half }) => (
    <svg viewBox="0 0 24 24" width="16" height="16" 
        fill={filled ? "#FFD700" : half ? "url(#grad1)" : "none"} 
        stroke={filled || half ? "#FFD700" : "#ddd"} 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
            <linearGradient id="grad1">
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#eee" stopOpacity="1" />
            </linearGradient>
        </defs>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const StarDisplay = ({ rating }) => {
    return (
        <div className="star-display">
            {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} filled={s <= Math.floor(rating)} half={s === Math.ceil(rating) && rating % 1 !== 0} />
            ))}
        </div>
    );
};

export default function RatingsAndReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ average: 0, total: 0 });

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                setLoading(true);
                const response = await ratingApi.getRatingsAndReviews();
                let data = [];
                let total = 0;
                let average = 0;

                if (response.data?.responseCode === 200 && response.data.responseData) {
                    const resData = response.data.responseData;
                    data = Array.isArray(resData.reviews) ? resData.reviews : (Array.isArray(resData) ? resData : []);
                    average = parseFloat(resData.fAvgRating || resData.dAverageRating) || 0;
                    total = parseInt(resData.iTotalReviews) || data.length;
                }
                setReviews(data);
                setStats({ average, total });
            } catch (error) {
                console.error('Error fetching ratings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, []);

    const formatReview = (req, idx) => {
        let dateObj = new Date();
        const reviewDateStr = req.dReviewDate || req.date || req.dAddedDate || req.iCreatedAt;
        if (reviewDateStr) {
            const parsedDate = !isNaN(reviewDateStr) ? parseInt(reviewDateStr) : reviewDateStr;
            dateObj = new Date(parsedDate);
            if (dateObj.getFullYear() < 1980 && !isNaN(reviewDateStr)) dateObj = new Date(parsedDate * 1000);
        }

        return {
            id: req.id || req.iRatingId || req.iReviewId || Math.random() + idx,
            name: req.vReviewerName || req.vUserName || 'User',
            tag: req.vTag || req.vCharacterName || '',
            rating: parseFloat(req.fRating || req.dRating || 0),
            text: req.txReview || req.text || '',
            date: dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: req.vReviewerImage || req.vProfilePic || req.txProfilePic
        };
    };

    const formattedReviews = reviews.map((r, i) => formatReview(r, i));

    if (loading) {
        return (
            <div className="ratings-container">
                <Header title="Ratings & Reviews" />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10rem' }}>
                    <div className="spinner-large" />
                </div>
            </div>
        );
    }

    return (
        <div className="ratings-container">
            <Header title="Ratings & Reviews" />

            <div className="ratings-wrapper">
                <section className="stats-card">
                    <div className="stat-item">
                        <span className="stat-value">{stats.average.toFixed(1)}</span>
                        <div className="star-box">
                            <StarDisplay rating={stats.average} />
                        </div>
                        <span className="stat-label">Average Rating</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Reviews</span>
                    </div>
                </section>

                <main className="review-list">
                    {formattedReviews.length === 0 ? (
                        <div className="empty-state">No ratings or reviews found.</div>
                    ) : (
                        formattedReviews.map((review) => (
                            <article className="review-card" key={review.id}>
                                <div className="reviewer-info">
                                    <div className="avatar">
                                        {review.image ? <img src={review.image} alt={review.name} /> : <PersonIcon />}
                                    </div>
                                    <div className="review-details">
                                        <div className="top-row">
                                            <h4>
                                                {review.name}
                                                {review.tag && <span className="tag-chip">{review.tag}</span>}
                                            </h4>
                                            <span className="review-date">{review.date}</span>
                                        </div>
                                        <div className="star-row">
                                            <StarDisplay rating={review.rating} />
                                            <span className="rating-num">{review.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                {review.text && <p className="review-text">"{review.text}"</p>}
                            </article>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}
