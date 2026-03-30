import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api";
import "./VerifyOtp.scss";

// SVG Icons
const BackIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export default function VerifyOtp() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(59);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState("");
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 3) document.getElementById(`otp-${index + 1}`).focus();
    };

    const isOtpComplete = otp.every(digit => digit !== "");

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        if (!isOtpComplete) return;
        setError("");
        try {
            const response = await authApi.verifyOtp({ otpCode: otp.join("") });
            if (response.data.responseCode && response.data.responseCode !== 200) {
                setError(response.data.responseMessage || "Verification failed"); return;
            }
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.responseMessage || "Invalid OTP");
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setResendLoading(true); setError("");
        try {
            const res = await authApi.resendOtp();
            if (res.data.responseCode && res.data.responseCode !== 200) {
                setError(res.data.responseMessage || "Failed to resend"); return;
            }
            setTimer(59); setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) { setError("Resend failed"); }
        finally { setResendLoading(false); }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <button className="back-btn" onClick={() => navigate(-1)}><BackIcon /></button>

                <h1>Verify Mobile Number</h1>
                <p className="subtitle">
                    A code has been sent to your registered mobile number <strong>XX806</strong>
                </p>

                {error && <div className="error-alert">{error}</div>}

                <div className="otp-timer">00:{timer < 10 ? `0${timer}` : timer}</div>

                <div className="otp-inputs">
                    {otp.map((digit, idx) => (
                        <input 
                            key={idx} id={`otp-${idx}`} 
                            type="text" value={digit}
                            onChange={e => handleChange(e.target.value, idx)}
                            maxLength={1}
                        />
                    ))}
                </div>

                <button 
                    className="resend-link" 
                    onClick={handleResend} 
                    disabled={timer > 0}
                >
                    {resendLoading ? "Resending..." : "Resend Code"}
                </button>

                <button 
                    className="signin-btn" 
                    onClick={handleVerify} 
                    disabled={!isOtpComplete}
                >
                    Next
                </button>

                <div className="signup-prompt">
                    <span className="link" onClick={() => navigate("/signup")}>
                        Do you want to change mobile number?
                    </span>
                </div>

                {showToast && <div className="toast">Code resent successfully!</div>}
            </div>
        </div>
    );
}