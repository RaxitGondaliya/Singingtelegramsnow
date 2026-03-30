import { useState, useRef } from "react";
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
    dLatitude: "",
    dLongitude: "",
    vCity: "",
    vState: "",
    vCountry: "",
    vCountryCode: "",
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef(null);
  const handleLocationFocus = () => {
    if (formData.streetAddress || (formData.dLatitude && formData.dLongitude)) return;
    if (!navigator.geolocation) return;

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
            setFormData(prev => ({
              ...prev,
              streetAddress: data?.display_name || "",
              dLatitude: lat,
              dLongitude: lng,
              vCity: data?.address?.city || data?.address?.town || data?.address?.village || "Unknown",
              vState: data?.address?.state || "Unknown",
              vCountry: data?.address?.country || "Unknown",
              vCountryCode: (data?.address?.country_code || "US").toUpperCase(),
            }));
            setLocationLoading(false);
          }).catch(() => setLocationLoading(false));
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "streetAddress") {
      setShowSuggestions(true);
      if (value.length > 2) {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=5`)
            .then(res => res.json())
            .then(data => setSuggestions(data))
            .catch(() => { });
        }, 500);
      } else setSuggestions([]);
    }
  };
  const handleSuggestionSelect = (s) => {
    setFormData(prev => ({
      ...prev,
      streetAddress: s.display_name,
      dLatitude: s.lat,
      dLongitude: s.lon,
      vCity: s?.address?.city || s?.address?.town || s?.address?.village || "Unknown",
      vState: s?.address?.state || "Unknown",
      vCountry: s?.address?.country || "Unknown",
      vCountryCode: (s?.address?.country_code || "US").toUpperCase(),
    }));
    setShowSuggestions(false);
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
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
        if (String(resData.tiMobileVerified) === "0") navigate("/verify-otp");
        else {
          localStorage.setItem('token', resData.vAuthKey);
          navigate("/dashboard");
        }
      } else navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.responseMessage || "Something went wrong during signup");
    } finally { setLoading(false); }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="box-header">
          <div className="back-arrow" onClick={() => navigate("/")}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <div className="top-link" onClick={() => navigate("/signin")}>
            Already an account? <span>Sign In</span>
          </div>
        </div>

        <h2>Sign Up to continue</h2>

        <div className="profile-placeholder">
          <div className="icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

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
          <div className="address-field">
            <input
              type="text"
              name="streetAddress"
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={handleChange}
              onFocus={handleLocationFocus}
              disabled={loading}
              autoComplete="off"
              className="input-field"
            />

            {/* Location detecting message */}
            {locationLoading && (
              <span className="detecting-msg">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Detecting your location...
              </span>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSuggestionSelect(s)}
                    className="suggestion-item"
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
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