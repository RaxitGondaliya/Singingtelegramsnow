import { useState } from "react";
import "./ForgotPassword.scss";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await authApi.forgotPassword({ email });

      if (response.data.responseCode && response.data.responseCode !== 200) {
        setError(response.data.responseMessage || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.responseMessage || err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      {/* The orange "X" back button as seen in your screenshot */}
      <div className="close-icon" onClick={() => navigate("/signin")}>
        ✕
      </div>

      <div className="forgot-password-box">
        <div className="form-area">
          <h2>Forgot your password?</h2>
          <p className="description">
            Don't worry! Tell us your email and we'll send you a temporary password to get signed in.
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Email sent successfully!</div>}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            className="send-email-btn"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}