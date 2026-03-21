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
  const [resendLoading, setResendLoading] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
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

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleVerify = async () => {
    if (!isOtpComplete) return;

    setError("");
    try {
      const otpCode = otp.join("");
      const response = await authApi.verifyOtp({ otpCode });

      if (response.data.responseCode && response.data.responseCode !== 200) {
        setError(response.data.responseMessage || "Verification failed");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.responseMessage ||
        err.response?.data?.message ||
        "Invalid OTP"
      );
    }
  };

  const handleResend = async () => {
    if (timer > 0) {
      return;
    }


    setResendLoading(true);
    setError("");

    try {
      const response = await authApi.resendOtp();

      if (response.data.responseCode && response.data.responseCode !== 200) {
        setError(response.data.responseMessage || "Failed to resend OTP");
        return;
      }

      setTimer(59);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.responseMessage ||
        "Resend failed"
      );
    } finally {
      setResendLoading(false);
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

          {error && (
            <div
              className="error-message"
              style={{ color: "red", textAlign: "center", marginBottom: "15px" }}
            >
              {error}
            </div>
          )}

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

          <div
            className={`resend-link ${timer > 0 ? "disabled" : ""}`}
            onClick={handleResend}
            style={{
              pointerEvents: timer > 0 ? "none" : "auto",
              opacity: timer > 0 ? 0.5 : 1,
              cursor: timer > 0 ? "not-allowed" : "pointer"
            }}
          >
            {resendLoading ? "Resending..." : "Resend Code"}
          </div>

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