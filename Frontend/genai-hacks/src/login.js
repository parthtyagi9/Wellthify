import { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Dashboard from "./Dashboard"; // Import Dashboard
import "./login.css";

const GOOGLE_CLIENT_ID =
  "23212139674-c1b61g95jaf7as88m353jom7b35t6rfs.apps.googleusercontent.com"; // Replace with actual Client ID

const Login = () => {
  console.log("BP1");
  const navigate = useNavigate(); // Allows navigation
  
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(isDark));
  }, [isDark]);

  console.log("BP2");
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin && !formData.name.trim()) {
      setError("Name is required!");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setError("");
    console.log(isLogin ? "Logging in..." : "Signing up...", formData);

    // Simulate login success by redirecting
    navigate("/dashboard");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    console.log("Google User:", decoded);

    // Redirect to Dashboard
    navigate("/dashboard");
  };

  const handleGoogleFailure = () => {
    setError("Google Sign-In failed. Please try again.");
  };

  const currentTheme = isDark ? "dark" : "light";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={`theme-container ${currentTheme}`}>
        <button onClick={toggleTheme} className={`theme-toggle ${currentTheme}`}>
          {isDark ? <p>Light</p> : <p>Dark</p>}
        </button>

        <div className="main-container">
          <div className="form-container">
            <div className={`form-box ${currentTheme}`}>
              <h2 className={`title ${currentTheme}`}>
                {isLogin ? "Hello There!" : "Create Account"}
              </h2>

              {error && (
                <div className="error-message">
                  <p className="error-text">{error}</p>
                </div>
              )}

              {user ? (
                <div className="user-info">
                  <img src={user.picture} alt="User" className="user-avatar" />
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="form">
                    {!isLogin && (
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required={!isLogin}
                        className={`input-field ${currentTheme}`}
                      />
                    )}

                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`input-field ${currentTheme}`}
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`input-field ${currentTheme}`}
                    />

                    {!isLogin && (
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={`input-field ${currentTheme}`}
                      />
                    )}

                    <button type="submit" className="submit-button">
                      {isLogin ? "Sign In" : "Create Account"}
                    </button>
                  </form>

                  <div className="or-divider">OR</div>

                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
                </>
              )}

              <div className="toggle-text">
                <button onClick={() => setIsLogin(!isLogin)} className={`toggle-button ${currentTheme}`}>
                  {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

// Main App with Routing
const LoginPage = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default LoginPage