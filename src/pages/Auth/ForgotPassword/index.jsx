import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api";
import "./ForgotPassword.scss";

// SVG Icons
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        if (e) e.preventDefault();
        if (!email) { setError("Please enter your email"); return; }
        setLoading(true); setError(""); setSuccess(false);
        try {
            const response = await authApi.forgotPassword({ email });
            if (response.data.responseCode && response.data.responseCode !== 200) {
                setError(response.data.responseMessage || "Failed to send reset email"); return;
            }
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.responseMessage || "Something went wrong");
        } finally { setLoading(false); }
    };

    return (
        <div className="signin-container"> {/* Reusing signin-container structure */}
            <div className="signin-card">
                <button className="back-btn" onClick={() => navigate("/signin")}>
                    <CloseIcon />
                </button>

                <h1>Forgot your password?</h1>
                <p className="subtitle">
                    Don't worry! Tell us your email and we'll send you a temporary password to get signed in.
                </p>

                {error && <div className="error-alert">{error}</div>}
                {success && <div className="success-alert">Email sent successfully!</div>}

                <form onSubmit={handleResetPassword} className="form-group">
                    <div className="input-field">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            disabled={loading}
                            required
                            autoFocus
                        />
                    </div>

                    <button type="submit" className="signin-btn" disabled={loading}>
                        {loading ? <div className="loading-spinner"></div> : "Send Email"}
                    </button>
                    
                    <div className="signup-prompt">
                        Remember your password? 
                        <span className="link" onClick={() => navigate("/signin")}>Sign In</span>
                    </div>
                </form>
            </div>
        </div>
    );
}