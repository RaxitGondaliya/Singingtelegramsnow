import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthLanding.scss";

export default function AuthLanding() {
    const navigate = useNavigate();

    return (
        <div className="auth-landing-container">
            <div className="auth-landing-wrapper">
                <img 
                    src="https://www.singingtelegramsnow.com/images/logo@2x.png" 
                    alt="Singing Telegrams Now" 
                    className="landing-logo"
                />

                <div className="landing-card">
                    <div className="auth-actions">
                        <button 
                            className="primary" 
                            onClick={() => navigate("/signup")}
                        >
                            Sign Up
                        </button>
                        <button 
                            className="secondary" 
                            onClick={() => navigate("/signin")}
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="landing-footer">
                        By signing up, I agree to <span className="link" onClick={() => navigate("/terms-and-conditions")}>Terms of service</span>
                        <br />
                        and <span className="link" onClick={() => navigate("/privacy-policy")}>Privacy Policy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
