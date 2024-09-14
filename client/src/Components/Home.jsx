import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <h1>Welcome to the Home Page</h1>
      <div className="mt-4">
        {/* Navigation Buttons */}
        <button
          className="btn btn-primary me-3"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
