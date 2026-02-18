import { useState } from "react";
import "./signin.css";
import { useNavigate } from "react-router-dom";


export default function Signin() {
  const [tab, setTab] = useState("email");
  const [showPass, setShowPass] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();

  // states for inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  // tab change + reset fields
  const changeTab = (type) => {
    setTab(type);

    // reset all fields
    setEmail("");
    setPassword("");
    setMobile("");
    setOtp("");
    setShowOtpField(false);
  };

  return (
    <div className="signin-wrapper">

      {/* MOBILE BACK ARROW */}
      <div className="back" onClick={() => navigate("/")}>
        ←
      </div>

      <div className="signin-box">

        {/* Tabs */}
        <div className="tabs">
          <button
            className={tab === "email" ? "active" : ""}
            onClick={() => changeTab("email")}
          >
            Email
          </button>

          <button
            className={tab === "phone" ? "active" : ""}
            onClick={() => changeTab("phone")}
          >
            Mobile Number
          </button>
        </div>

        <div className="form-area">
          <h2>Sign In using {tab === "email" ? "Email" : "Mobile Number"}</h2>

          {tab === "email" ? (
            <>
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Password</label>
              <div className="password">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span onClick={() => setShowPass(!showPass)}>
                  {showPass ? "Hide" : "Show"}
                </span>
              </div>

            </>
          ) : (
            <>
              <label>Mobile Number</label>
              <div className="mobile-input-wrapper">
                <span className="country-code">+1</span>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>


              {/* OTP field only after click */}
              {showOtpField && (
                <>
                  <label>OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </>
              )}
            </>
          )}

          {tab === "phone" ? (
            <button
              className="signin-btn"
              onClick={() => setShowOtpField(true)}
            >
              {showOtpField ? "Verify OTP" : "Send OTP"}
            </button>
          ) : (
            <button className="signin-btn">Sign In</button>
          )}

          {tab === "email" && <p className="forgot">Forgot Password?</p>}

          <div className="signup-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign Up</span>
          </div>
        </div>

      </div>
    </div>
  );
}
