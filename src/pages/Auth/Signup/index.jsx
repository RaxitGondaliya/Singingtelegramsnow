import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api";
import "./Signup.scss";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

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
            setErrors(prev => ({ ...prev, streetAddress: "" }));
          }).catch(() => setLocationLoading(false));
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    const trimmedVal = typeof value === 'string' ? value.trim() : value;

    if (!trimmedVal && name !== "gender") {
      errorMsg = "This field is required";
    } else {
      if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = "Please enter a valid email address";
      } else if (name === "mobileNumber" && value.length !== 10) {
        errorMsg = "Mobile number must be exactly 10 digits";
      } else if (name === "zipCode" && value.length !== 6) {
        errorMsg = "Zip code must be exactly 6 digits";
      } else if (name === "password" && value.length < 8) {
        errorMsg = "Password must be at least 8 characters";
      } else if (name === "gender" && value === "0") {
        errorMsg = "This field is required";
      }
    }
    return errorMsg;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid = () => {
    const { firstName, lastName, email, streetAddress, mobileNumber, zipCode, gender, password } = formData;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isMobileValid = /^\d{10}$/.test(mobileNumber);
    const isZipValid = /^\d{6}$/.test(zipCode);
    const isPasswordValid = password.length >= 8 && password.length <= 15;
    
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      streetAddress.trim().length > 0 &&
      isValidEmail &&
      isMobileValid &&
      isZipValid &&
      isPasswordValid &&
      gender !== "0"
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let updatedValue = value;
    if (name === "mobileNumber") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "zipCode") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    } else if (name === "password") {
      updatedValue = value.slice(0, 15);
    }

    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, updatedValue) }));
    
    if (name === "streetAddress") {
      setShowSuggestions(true);
      if (updatedValue.length > 2) {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
          fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(updatedValue)}&format=json&addressdetails=1&limit=5`)
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
    setErrors(prev => ({ ...prev, streetAddress: "" }));
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
              onBlur={handleBlur}
              disabled={loading}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
            />
          </div>
          {(errors.firstName || errors.lastName) && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '-5px', marginBottom: '10px' }}>
              <div style={{ flex: 1, color: '#ff4d4f', fontSize: '12px', textAlign: 'left', paddingLeft: '5px' }}>{errors.firstName}</div>
              <div style={{ flex: 1, color: '#ff4d4f', fontSize: '12px', textAlign: 'left', paddingLeft: '5px' }}>{errors.lastName}</div>
            </div>
          )}

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
          />
          {errors.email && <div style={{ color: '#ff4d4f', fontSize: '12px', textAlign: 'left', marginTop: '-5px', marginBottom: '10px', paddingLeft: '5px' }}>{errors.email}</div>}

          <div className="address-field">
            <input
              type="text"
              name="streetAddress"
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleLocationFocus}
              disabled={loading}
              autoComplete="off"
              className="input-field"
            />
            {errors.streetAddress && <div style={{ color: '#ff4d4f', fontSize: '12px', textAlign: 'left', marginTop: '4px', marginBottom: '10px', paddingLeft: '5px' }}>{errors.streetAddress}</div>}

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
            onBlur={handleBlur}
            disabled={loading}
          />
          {errors.mobileNumber && <div style={{ color: '#ff4d4f', fontSize: '12px', textAlign: 'left', marginTop: '-5px', marginBottom: '10px', paddingLeft: '5px' }}>{errors.mobileNumber}</div>}

          <div className="zip-gender">
            <input
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
            >
              <option value="0">Gender</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
              <option value="3">Other</option>
            </select>
          </div>
          {(errors.zipCode || errors.gender) && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '-5px', marginBottom: '10px' }}>
              <div style={{ flex: 1, color: '#ff4d4f', fontSize: '12px', textAlign: 'left', paddingLeft: '5px' }}>{errors.zipCode}</div>
              <div style={{ flex: 1, color: '#ff4d4f', fontSize: '12px', textAlign: 'left', paddingLeft: '5px' }}>{errors.gender}</div>
            </div>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
          />
          {errors.password && <div style={{ color: '#ff4d4f', fontSize: '12px', textAlign: 'left', marginTop: '-5px', marginBottom: '10px', paddingLeft: '5px' }}>{errors.password}</div>}

          <button
            className="create-btn"
            onClick={handleSignup}
            disabled={loading || !isFormValid()}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}