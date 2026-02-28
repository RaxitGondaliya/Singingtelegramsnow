import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api";
import "./VerifyOtp.scss";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

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

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleResend = () => {
    setTimer(59);
    setShowToast(true);
    setError("");

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleVerify = async () => {
    console.log("handleVerify called, isOtpComplete:", isOtpComplete, "otp:", otp);
    if (!isOtpComplete) return;

    setError("");
    try {
      const otpCode = otp.join("");
      const response = await authApi.verifyOtp({ otpCode });

      if (response.data.responseCode && response.data.responseCode !== 200) {
        setError(response.data.responseMessage || "Verification failed");
        return;
      }

      // Successfully verified! Redirect to dashboard or next specific screen.
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.responseMessage || err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-box">
        <div className="box-header">
          <div className="back-arrow" onClick={() => navigate(-1)}>←</div>
        </div>

        <div className="content-area">
          <h2>Verify Mobile Number</h2>
          <p className="description">
            A verification code has been sent to your registered mobile number <strong>XX806</strong>
          </p>

          {error && <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}

          <div className="timer-display">
            00:{timer < 10 ? `0${timer}` : timer}
          </div>

          <div className="otp-input-wrapper">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
              />
            ))}
          </div>

          <div className="resend-link" onClick={handleResend}>Resend Code</div>

          <button
            className={`next-btn ${isOtpComplete ? "active" : ""}`}
            disabled={!isOtpComplete}
            onClick={handleVerify}
          >
            Next
          </button>
        </div>

        <div className="bottom-link" onClick={() => navigate("/signup")}>
          Do you want to change mobile number?
        </div>

        {showToast && (
          <div className="toast-message">
            We have resent your verification code.
          </div>
        )}
      </div>
    </div>
  );
}