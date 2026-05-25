import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // 1. Existing form visibility state
  const [showForm, setShowForm] = useState(false); 
  
  // 2. New state to toggle between Login (true) and Sign Up (false)
  const [isLoginView, setIsLoginView] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Additional validation if the user is signing up
    if (!isLoginView && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    if (isLoginView) {
      console.log("Logging in user:", { email, password });
      // Authentication logic goes here
      navigate("/dashboard"); 
    } else {
      console.log("Registering new user:", { email, password });
      // Registration logic goes here
      navigate("/dashboard"); 
    }
  };

  // Helper function to reset form states when switching tabs
  const handleToggleView = (isLogin) => {
    setIsLoginView(isLogin);
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  // Case 1: If showForm is false, give them the initial choice to Sign In or Sign Up
  if (!showForm) {
    return (
      <div className="landing-container">
        <h2>Welcome</h2>
        <div className="landing-actions">
          <button 
            onClick={() => { setShowForm(true); handleToggleView(true); }} 
            className="btn-signin"
          >
            Sign In
          </button>
          <button 
            onClick={() => { setShowForm(true); handleToggleView(false); }} 
            className="btn-signup"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // Case 2: If showForm is true, render the dynamic form
  return (
    <div className="form-container">
      {/* Dynamic Header based on state */}
      <h2>{isLoginView ? "Sign In" : "Create Account"}</h2>
      
      {/* Toggle tabs inside the form wrapper so they can switch easily */}
      <div className="form-tabs">
        <button 
          type="button"
          onClick={() => handleToggleView(true)}
          className={isLoginView ? "tab-active" : "tab-inactive"}
        >
          Login
        </button>
        <button 
          type="button"
          onClick={() => handleToggleView(false)}
          className={!isLoginView ? "tab-active" : "tab-inactive"}
        >
          Register
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <main>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="psw"><b>Password</b></label>
            <input
              type="password"
              id="psw"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Conditional Input: Only shows up during Sign Up */}
          {!isLoginView && (
            <div className="input-group">
              <label htmlFor="confirm-psw"><b>Confirm Password</b></label>
              <input
                type="password"
                id="confirm-psw"
                placeholder="Repeat Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {isLoginView ? "Login" : "Sign Up"}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;