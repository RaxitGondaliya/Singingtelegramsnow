import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header';
import '../../../styles/components/_legal.scss';

const CancellationPolicy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingId] = useState(location.state?.bookingId || null);
    
    return (
        <div className="legal-container">
            <Header title="Cancellation Policy" />
            
            <div className="legal-content-wrapper">
                <main className="legal-card">
                    <p>
                        <strong>Please note:</strong> Because we are a new company and we are in the process of defining systems, this policy is subject to change. All performers will be alerted by email to changes in policy.
                    </p>

                    <p>
                        Performers are required to keep their availability up to date in the STN performer's app. Cancellations on the performer end should be very, very rare. There are certain cases where cancellations are understandable.
                    </p>

                    <p>
                        Whenever there is a cancellation, the performer must provide text detail on the reason for the cancellation within the app.
                    </p>

                    <h2>Performer Cancellation Reasons:</h2>
                    
                    <ul>
                        <li>
                            <strong>Illness</strong>
                            <ul>
                                <li style={{ fontSize: '0.9rem', color: '#666' }}>
                                    The performer can cancel a performances for illness without penalty up to 2 times per calendar year. Cancellations of multiple performances in the same day count as one incident.
                                </li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong>Scheduling Conflict</strong>
                            <ul>
                                <li style={{ fontSize: '0.9rem', color: '#666' }}>
                                    The performer can cancel a performances for scheduling conflict without penalty up to 1 time per calendar year.
                                </li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong>Discomfort with performance situation</strong>
                            <ul>
                                <li style={{ fontSize: '0.9rem', color: '#666' }}>
                                    Case by case basis. The admin will review the order and the messages between customer and performer.
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <h2 style={{ color: '#d32f2f' }}>Penalties:</h2>
                    
                    <ul>
                        <li>
                            <strong>When the maximum number of cancellations in a calendar year is reached, the performer will be docked pay from next job at this rate:</strong>
                            <ul>
                                <li style={{ fontSize: '0.9rem', color: '#666' }}>Illness: 10% pay penalty on next job</li>
                                <li style={{ fontSize: '0.9rem', color: '#666' }}>Scheduling Conflict: 50% pay penalty on next job</li>
                                <li style={{ fontSize: '0.9rem', color: '#666' }}>Discomfort: case by case</li>
                            </ul>
                        </li>
                        
                        <li>
                            <strong>When an performer cancels 4 jobs in a single year, they will be placed on probation and not appear in search results until the admin reinstates their profile.</strong>
                        </li>
                    </ul>

                    {bookingId && (
                        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                            <button 
                                className="submit-btn" 
                                onClick={() => navigate('/dashboard/profile/cancel-booking', { state: { bookingId } })}
                                style={{ maxWidth: '300px' }}
                            >
                                Agree & Continue
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CancellationPolicy;
