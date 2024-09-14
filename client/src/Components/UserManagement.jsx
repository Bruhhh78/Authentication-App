import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Fetch users on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Add a new user
  const handleAddUser = () => {
    axios
      .post("http://localhost:3001/users", { name, email, password })
      .then((response) => {
        setUsers([...users, response.data]);
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  // Delete a user
  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:3001/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  // Update an existing user
  const handleUpdateUser = () => {
    axios
      .put(`http://localhost:3001/users/${selectedUser._id}`, { name, email, password })
      .then((response) => {
        setUsers(users.map((user) => (user._id === selectedUser._id ? response.data : user)));
        resetForm();
        setSelectedUser(null);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  // Logout handler
  const handleLogout = () => {
    axios
      .post("http://localhost:3001/logout")
      .then(() => {
        navigate("/"); // Redirect to home on logout
      })
      .catch((err) => {
        console.error("Logout error:", err);
      });
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">User Management</h1>

      <div className="row mb-4">
        <div className="col-md-6">
          <h2>Add User</h2>
          <div className="form-group">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <h2>User List</h2>
          <ul className="list-group">
            {users.map((user) => (
              <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                {user.name} - {user.email}
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setSelectedUser(user);
                      setName(user.name);
                      setEmail(user.email);
                      setPassword(""); // Clear password field on edit
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedUser && (
        <div className="mb-4">
          <h2>Edit User</h2>
          <div className="form-group">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-success me-2" onClick={handleUpdateUser}>
              Update
            </button>
            <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
