import { useNavigate } from "react-router-dom";
import "./Signup.scss";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="signup-wrapper">

      {/* Top bar (mobile only) */}
      <div className="top-bar">
        <div className="back" onClick={() => navigate("/")}>←</div>
      </div>

      <div className="signup-box">
        {/* Top link: always right-aligned (Visible on all screens) */}
        <div className="top-link" onClick={() => navigate("/signin")}>
          Already an account? <span>Sign In</span>
        </div>

        <h2>Sign Up to continue</h2>

        {/* Profile icon */}
        <div className="profile-icon">👤</div>

        {/* Name fields */}
        <div className="name-fields">
          <input placeholder="First Name" />
          <input placeholder="Last Name" />
        </div>

        {/* Other fields */}
        <input placeholder="Email" />
        <input placeholder="Street Address" />
        <input placeholder="Mobile Number" />
        <div className="zip-gender">
          <input placeholder="Zip Code" />
          <select>
            <option>Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <button className="create-btn">Create Account</button>
      </div>
    </div>
  );
}
