import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook for navigation

  // Ensure Axios sends cookies with requests
  axios.defaults.withCredentials = true;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });
      if (response.data) {
        console.log("Login successful:", response.data); // Log success
        navigate("/dashboard"); // Redirect to dashboard on success
      } else {
        console.error("Login failed: No valid response"); // Log failure
        navigate("/"); // Redirect to homepage on failure
      }
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message); // Log error
      setError("Login failed. Please check your credentials and try again."); // Set error message
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-4 rounded" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              id="email"
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>

        {/* Registration Link */}
        <p className="text-center mt-3">Don't have an account?</p>
        <button
          className="btn btn-light w-100"
          onClick={() => navigate("/register")} // Navigate to register page
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
