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
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let errorMsg = "";
    const trimmedVal = typeof value === 'string' ? value.trim() : value;

    if (!trimmedVal) {
      errorMsg = "This field is required";
    } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMsg = "Please enter a valid email address";
    } else if (name === "password" && value.length < 8) {
      errorMsg = "Password must be at least 8 characters";
    }
    return errorMsg;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors(prev => ({ ...prev, email: validateField("email", value) }));
  };

  const handlePasswordChange = (e) => {
    let value = e.target.value;
    if (value.length > 15) {
      value = value.slice(0, 15);
    }
    setPassword(value);
    setErrors(prev => ({ ...prev, password: validateField("password", value) }));
  };

  const isFormValid = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = password.length >= 8 && password.length <= 15;
    return email.trim().length > 0 && isValidEmail && isValidPassword;
  };

  const handleSignin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authApi.login({ email, password });

      const { responseCode, responseMessage, responseData } = response.data;

      if (responseCode !== 200) {
        setError(responseMessage || "Invalid credentials");
        return;
      }

      const token = responseData?.vAuthKey;
      if (!token) {
        setError("Token not received from server");
        return;
      }

      // Store user data in local storage
      localStorage.setItem("userData", JSON.stringify(responseData));
      localStorage.setItem("token", token);

      navigate("/dashboard");

    } catch (err) {
      setError(
        err?.response?.data?.responseMessage ||
        err?.response?.data?.message ||
        "Something went wrong"
      );
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
            name="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleBlur}
            disabled={loading}
          />
          {errors.email && <div className="field-error message" style={{ color: '#ff4d4f', fontSize: '12px', textAlign: 'left', marginTop: '4px', marginBottom: '10px' }}>{errors.email}</div>}

          <label>Password</label>
          <div className="password">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onBlur={handleBlur}
              disabled={loading}
            />
            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? "Hide" : "Show"}
            </span>
          </div>
          {errors.password && <div className="field-error message" style={{ color: '#ff4d4f', fontSize: '12px', textAlign: 'left', marginTop: '4px', marginBottom: '10px' }}>{errors.password}</div>}

          <button
            className="signin-btn"
            onClick={handleSignin}
            disabled={loading || !email.trim() || !password.trim()}
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
