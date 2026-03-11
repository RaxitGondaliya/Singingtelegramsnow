import React from 'react';
import Header from '../../../components/layout/Header/Header';
import './CancellationPolicy.scss';

const CancellationPolicy = () => {
    return (
        <div className="cancellation-policy-page">
            <Header title="Cancellation Policy" />
            <div className="cancellation-policy-content">
                <p>
                    <strong>Please note:</strong> Because we are a new company and we are in the process of defining systems, this policy is subject to change. All performers will be alerted by email to changes in policy.
                </p>

                <p>
                    Performers are required to keep their availability up to date in the STN performer's app. Cancellations on the performer end should be very, very rare. There are certain cases where cancellations are understandable.
                </p>

                <p>
                    Whenever there is a cancellation, the performer must provide text detail on the reason for the cancellation within the app.
                </p>

                <p className="section-title"><strong>Performer Cancellation Reasons:</strong></p>
                <ul className="reasons-list">
                    <li>
                        <strong>Illness</strong>
                        <ul className="sub-list">
                            <li>The performer can cancel a performances for illness without penalty up to 2 times per calendar year. Cancellations of multiple performances in the same day count as one incident. (If an performer is sick and needs to 3 cancel jobs for the same day, that only counts as one of the 2 times they can cancel due to illness.)</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Scheduling Conflict</strong>
                        <ul className="sub-list">
                            <li>The performer can cancel a performances for scheduling conflict without penalty up to 1 time per calendar year.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Discomfort with performance situation</strong>
                        <ul className="sub-list">
                            <li>Case by case basis. The admin will review the order and the messages between customer and performer.</li>
                        </ul>
                    </li>
                </ul>

                <p className="section-title"><strong>Penalties:</strong></p>
                <ul className="penalties-list">
                    <li>
                        <strong>When the maximum number of cancellations in a calendar year is reached, the performer will be docked pay from next job at this rate:</strong>
                        <ul className="sub-list">
                            <li>Illness: 10% pay penalty on next job</li>
                            <li>Scheduling Conflict: 50% pay penalty on next job</li>
                            <li>Discomfort: case by case</li>
                        </ul>
                    </li>
                    <li>
                        <strong>When an performer cancels 4 iobs in a single year, they will be placed on probation and not appear in search results until the admin reistates their profile.</strong>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CancellationPolicy;
