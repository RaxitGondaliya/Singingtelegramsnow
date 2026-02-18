import "./auth.css";
import { useNavigate } from "react-router-dom";

export default function AuthLanding() {
  const nav = useNavigate();

  return (
    <div className="auth-container">

      <img
        src="https://www.singingtelegramsnow.com/images/logo@2x.png"
        className="logo"
      />

      <div className="bottom">

        <button className="google">
          <img src="https://img.icons8.com/ios-filled/50/ffffff/google-logo.png" />
          <span>Continue with Google</span>
        </button>

        <button className="facebook btn">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png" />
          <span>Continue with Facebook</span>
        </button>

        <div className="row">
          <button className="outline btn" onClick={()=>nav("/signup")}>
            Sign Up
          </button>

          <button className="outline btn" onClick={()=>nav("/signin")}>
            Sign In
          </button>
        </div>

        <p className="terms">
          By signing up, I agree to <span className="link">Terms of service</span>
          <br/>
          and <span className="link">Privacy Policy</span>
        </p>

      </div>

    </div>
  );
}
