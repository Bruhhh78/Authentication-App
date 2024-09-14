import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:3001/dashboard")
      .then((res) => {
        if (res.data.valid) {
          setMessage(res.data.message);
          setError("");
        } else {
          navigate("/"); // Redirect to home if not valid
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setMessage("");
        setError("Error loading dashboard");
      });
  }, [navigate]);

  const handleLogout = () => {
    axios
      .post("http://localhost:3001/logout")
      .then(() => {
        navigate("/"); // Redirect to home on logout
      })
      .catch((err) => {
        console.error("Logout error:", err);
        setError("Error during logout");
      });
  };

  const goToUserManagement = () => {
    navigate("/user-management");
  };

  return (
    <div className="container-fluid bg-light vh-100">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-8 col-lg-6">
          <div className="card border-primary shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0 text-center">Dashboard</h3>
            </div>
            <div className="text-center card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <p className="lead">{message}</p>
              <button className="btn btn-info" onClick={goToUserManagement}>
                User Management
              </button>
            </div>
            <div className="card-footer text-center">
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
