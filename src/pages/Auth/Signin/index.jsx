import { useState } from "react";
import "./Signin.scss";
import { useNavigate, Link } from "react-router-dom";
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

      // Handle custom API error codes with 200 OK status
      if (response.data.responseCode && response.data.responseCode !== 200) {
        setError(response.data.responseMessage || "Invalid credentials");
        return;
      }

      const resData = response.data.data || response.data;
      const token = resData.vAuthKey || resData.token;

      if (token) {
        localStorage.setItem('token', token);
        navigate("/dashboard");
      } else {
        setError("Token not received from server");
      }
    } catch (err) {
      setError(err.response?.data?.responseMessage || err.response?.data?.message || "Something went wrong");
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


          <Link to="/forgot-password" className="forgot">Forgot Password?</Link>

          <div className="signup-link">
            Don't have an account? <span onClick={() => navigate("/signup")}>Sign Up</span>
          </div>
        </div>

      </div>
    </div>
  );
}
