import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api";
import "./Signup.scss";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    mobileNumber: "",
    zipCode: "",
    gender: "1",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authApi.signup(formData);

      if (response.data.responseCode && response.data.responseCode !== 200) {
        setError(response.data.responseMessage || "Signup failed");
        return;
      }

      const resData = response.data.responseData || response.data;

      if (resData.vAuthKey) {
        localStorage.setItem('vAuthKey', resData.vAuthKey);

        if (String(resData.tiMobileVerified) === "0") {
          navigate("/verify-otp");
        } else {
          localStorage.setItem('token', resData.vAuthKey);
          navigate("/dashboard");
        }
      } else {
        navigate("/verify-otp");
      }
    } catch (err) {
      setError(err.response?.data?.responseMessage || err.response?.data?.message || "Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="box-header">
          <div className="back-arrow" onClick={() => navigate("/")}>←</div>
          <div className="top-link" onClick={() => navigate("/signin")}>
            Already an account? <span>Sign In</span>
          </div>
        </div>

        <h2>Sign Up to continue</h2>

        <div className="profile-placeholder">
          <div className="icon">👤</div>
        </div>

        {error && <div className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</div>}

        <div className="form-content">
          <div className="name-fields">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="streetAddress"
            placeholder="Street Address"
            value={formData.streetAddress}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="zip-gender">
            <input
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleChange}
              disabled={loading}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="0">Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Other</option>
            </select>
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            style={{ marginTop: '10px' }}
          />

          <button
            className="create-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}