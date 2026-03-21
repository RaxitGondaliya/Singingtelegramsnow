import React, { useState, useEffect } from 'react';
import './RatingsAndReviews.scss';
import Header from '../../../components/layout/Header/Header';
import { ratingApi } from '../../../api/ratingApi';

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

                if (response.data && response.data.responseCode === 200 && response.data.responseData) {
                    const responseData = response.data.responseData;

                    if (Array.isArray(responseData.reviews)) {
                        data = responseData.reviews;
                    } else if (Array.isArray(responseData)) {
                        data = responseData;
                    }

                    average = parseFloat(responseData.fAvgRating || responseData.dAverageRating) || 0;
                    total = parseInt(responseData.iTotalReviews) || data.length;

                } else if (response.data && Array.isArray(response.data.data)) {
                    data = response.data.data;
                    total = data.length;
                }

                if (total > 0 && average === 0 && data.length > 0) {
                    const sum = data.reduce((acc, curr) => acc + (parseFloat(curr.dRating || curr.rating || 0)), 0);
                    average = sum / data.length;
                }

                setReviews(data);
                setStats({ average: average, total: total });

            } catch (error) {
                console.error('Error fetching ratings and reviews:', error);
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
            // Handle timestamp or ISO date
            const parsedDate = !isNaN(reviewDateStr) ? parseInt(reviewDateStr) : reviewDateStr;
            dateObj = new Date(parsedDate);
            // Quick check if dealing with unix epoch seconds instead of milliseconds
            if (dateObj.getFullYear() < 1980 && !isNaN(reviewDateStr)) {
                dateObj = new Date(parsedDate * 1000);
            }
        }

        const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Use a placeholder URL if no image is present
        let imageSrc = req.vReviewerImage || req.vProfilePic || req.txProfilePic || req.imageUrl;

        return {
            id: req.id || req.iRatingId || req.iReviewId || Math.random() + idx,
            name: req.vReviewerName || req.vUserName || req.name || 'Unknown User',
            tag: req.vTag || req.vCharacterName || req.tag || '',
            rating: parseFloat(req.fRating || req.dRating || req.rating || 0),
            text: req.txReview || req.text || req.vReview || req.txDescription || '',
            date: formattedDate,
            image: imageSrc
        };
    };

    const renderStars = (rating) => {
        return (
            <div className="stars">
                {[...Array(5)].map((_, index) => (
                    <span key={index} className={index < Math.floor(rating) ? 'star filled' : 'star'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const formattedReviews = reviews.map((r, i) => formatReview(r, i));

    if (loading) {
        return (
            <div className="ratings-reviews-page">
                <Header title="Ratings & Reviews" />
                <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: '16px', color: '#666' }}>
                    Loading reviews...
                </div>
            </div>
        );
    }

    return (
        <div className="ratings-reviews-page">
            <Header title="Ratings & Reviews" />

            <div className="ratings-content">
                <div className="overall-rating-section">
                    <div className="overall-stars">
                        {renderStars(stats.average)}
                        <span className="rating-score">{stats.average.toFixed(1)}</span>
                    </div>
                    <div className="divider-vertical"></div>
                    <div className="total-reviews">
                        <span>{stats.total} Reviews</span>
                    </div>
                </div>

                <div className="reviews-list">
                    {formattedReviews.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                            No ratings or reviews found.
                        </div>
                    ) : (
                        formattedReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="reviewer-avatar">
                                        {review.image ? (
                                            <img src={review.image} alt={review.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="reviewer-details-container">
                                        <div className="name-and-tag">
                                            <h3 className="reviewer-name">{review.name}</h3>
                                            {review.tag && <span className="review-tag">{review.tag}</span>}
                                        </div>
                                        <div className="reviewer-rating">
                                            {renderStars(review.rating)}
                                            <span className="rating-score">{review.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="review-body">
                                    <p>{review.text}</p>
                                </div>
                                <div className="review-footer">
                                    <span className="review-date">{review.date}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
