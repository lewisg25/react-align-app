
import React, { useState } from "react";
// import { useNavigate } from "react-router-";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    console.log("login submitted:", { email, password });
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <main>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">
              <b>Email</b>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </main>
    </div>
  );
};

export default Login;

