import { useState } from "react";
import "./Signin.scss";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api";


export default function Signin() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="back" onClick={() => navigate("/")}>
        ←
      </div>

      <div className="signin-box">
        <div className="form-area">
          <h2>Sign In using Email</h2>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <label>Password</label>
          <div className="password">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? "Hide" : "Show"}
            </span>
          </div>

          <button
            className="signin-btn"
            onClick={handleSignin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>


          <p className="forgot">Forgot Password?</p>

          <div className="signup-link">
            Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span>
          </div>
        </div>

      </div>
    </div>
  );
}
