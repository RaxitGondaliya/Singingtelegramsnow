import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../../api";
import "./Signin.scss";

// SVG Icons
const BackIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const EyeIcon = ({ show }) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {show ? (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"></path>
            </>
        ) : (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </>
        )}
    </svg>
);

export default function Signin() {
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignin = async (e) => {
        if (e) e.preventDefault();
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

            localStorage.setItem("userData", JSON.stringify(responseData));
            localStorage.setItem("token", token);
            navigate("/dashboard");

        } catch (err) {
            setError(err?.response?.data?.responseMessage || "Something went wrong");
        } finally { setLoading(false); }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <button className="back-btn" onClick={() => navigate("/")}>
                    <BackIcon />
                </button>

                <h1>Sign In using Email</h1>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSignin} className="form-group">
                    <div className="input-field">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>Password</label>
                        <input 
                            type={showPass ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            disabled={loading}
                            required
                        />
                        <button 
                            type="button" 
                            className="eye-btn" 
                            onClick={() => setShowPass(!showPass)}
                        >
                            <EyeIcon show={showPass} />
                        </button>
                    </div>

                    <button type="submit" className="signin-btn" disabled={loading}>
                        {loading ? <div className="loading-spinner"></div> : "Sign In"}
                    </button>
                    
                    <div className="forgot-link">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <div className="signup-prompt">
                        Don't have an account? 
                        <span className="link" onClick={() => navigate("/signup")}>Sign Up</span>
                    </div>
                </form>
            </div>
        </div>
    );
}
