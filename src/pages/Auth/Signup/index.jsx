import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../../api";
import "./Signup.scss";

// SVG Icons
const BackIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const PersonIcon = () => (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

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
                        .catch(() => {});
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
        <div className="signup-container">
            <div className="signup-card">
                <div className="auth-header">
                    <button className="back-btn" onClick={() => navigate("/")}><BackIcon /></button>
                    <div className="signin-link" onClick={() => navigate("/signin")}>
                        Already an account? <span>Sign In</span>
                    </div>
                </div>

                <h1>Sign Up to continue</h1>

                <div className="avatar-circle">
                    <PersonIcon />
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form className="form-grid" onSubmit={handleSignup}>
                    <div className="input-field">
                        <label>First Name</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange} disabled={loading} required placeholder="First Name" />
                    </div>
                    <div className="input-field">
                        <label>Last Name</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange} disabled={loading} required placeholder="Last Name" />
                    </div>
                    
                    <div className="input-field full-width">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} required placeholder="Email" />
                    </div>

                    <div className="input-field full-width">
                        <label>Street Address</label>
                        <input name="streetAddress" value={formData.streetAddress} onChange={handleChange} onFocus={handleLocationFocus} disabled={loading} required placeholder="Street Address" autoComplete="off" />
                        {locationLoading && <span className="detecting-msg">📍 Detecting your location...</span>}
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((s, idx) => <li key={idx} onClick={() => handleSuggestionSelect(s)}>{s.display_name}</li>)}
                            </ul>
                        )}
                    </div>

                    <div className="input-field full-width">
                        <label>Mobile Number</label>
                        <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} disabled={loading} required placeholder="Mobile Number" />
                    </div>

                    <div className="input-field">
                        <label>Zip Code</label>
                        <input name="zipCode" value={formData.zipCode} onChange={handleChange} disabled={loading} required placeholder="Zip Code" />
                    </div>
                    <div className="input-field">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} disabled={loading}>
                            <option value="0">Gender</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Other</option>
                        </select>
                    </div>

                    <div className="input-field full-width">
                        <label>Password</label>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} disabled={loading} required placeholder="Password" />
                    </div>

                    <div className="full-width">
                        <button type="submit" className="signup-btn" disabled={loading}>
                            {loading ? <div className="loading-spinner"></div> : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}