import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Registration = () => {
  // State for form inputs
  const [name, setName] = useState(""); // User's name
  const [email, setEmail] = useState(""); // User's email
  const [password, setPassword] = useState(""); // User's password
  const [error, setError] = useState(""); // State for error messages

  const navigate = useNavigate(); // Hook for navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Send user data to the server
      const response = await axios.post("http://localhost:3001/register", { name, email, password });
      console.log("Registration successful:", response.data); // Log success response
      setName(""); // Clear name field
      setEmail(""); // Clear email field
      setPassword(""); // Clear password field
      setError(""); // Clear error message
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message); // Log errors
      setError("Registration failed. Please try again."); // Set error message
    }
  };

  return (
    <div className="d-flex p-4 justify-content-center align-items-center bg-secondary vh-100">
      {/* Form container */}
      <div className="bg-white p-4 rounded w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center">Register</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>} {/* Error message */}
        <form onSubmit={handleSubmit}>
          {/* Name input */}
          <div className="mb-3">
            <label><strong>Name</strong></label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)} // Update name state
              required
            />
          </div>

          {/* Email input */}
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-3">
            <label><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>

        {/* Login link */}
        <p className="text-center mt-3">Already have an account?</p>
        <button
          className="btn btn-light w-100"
          onClick={() => navigate("/login")} // Navigate to login on click
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Registration;
