import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import UserModel from "./models/User.js";

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();
const PORT = 3001;
const uri = process.env.MONGODB_URI;

// Middleware to parse JSON requests and handle CORS
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// Connect to MongoDB cluster
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to generate JWT tokens
const generateTokens = (email) => {
  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "5m" });
  return { accessToken, refreshToken };
};

// Middleware to verify user token
const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  // If no access token, try to renew it
  if (!accessToken) {
    return renewToken(req, res, next);
  }

  // Verify access token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return renewToken(req, res, next);
    }
    req.email = decoded.email;
    next();
  });
};

// Function to renew token if access token has expired
const renewToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  // If no refresh token, require login again
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token, please login again" });
  }

  // Verify refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Refresh token expired, please login again" });
    }

    // Generate new access token
    const { accessToken } = generateTokens(decoded.email);
    res.cookie("accessToken", accessToken, { maxAge: 60000, httpOnly: true, secure: false, sameSite: "strict" });
    req.email = decoded.email;
    next();
  });
};

// Route for user registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = await UserModel.create({ name, email, password: hashedPassword });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error during registration", details: error });
  }
});

// Route for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json("No user found with this email");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Generate tokens and set cookies
      const { accessToken, refreshToken } = generateTokens(user.email);
      res.cookie("accessToken", accessToken, { maxAge: 60000, httpOnly: true, secure: false, sameSite: "strict" });
      res.cookie("refreshToken", refreshToken, { maxAge: 300000, httpOnly: true, secure: false, sameSite: "strict" });
      res.json({ message: "Login Successful", accessToken, refreshToken });
    } else {
      res.status(401).json("Wrong credentials");
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error });
  }
});

// Route for user logout
app.post("/logout", (req, res) => {
  // Clear cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

// Protected route for authorized users
app.get("/dashboard", verifyUser, (req, res) => {
  res.json({ valid: true, message: "Authorized" });
});

// CRUD Routes for User Management

// Get all users
app.get("/users", verifyUser, async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users", details: err });
  }
});

// Create a new user
app.post("/users", verifyUser, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error creating user", details: err });
  }
});

// Delete a user
app.delete("/users/:id", verifyUser, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user", details: err });
  }
});

// Update a user
app.put("/users/:id", verifyUser, async (req, res) => {
  const { name, email, password } = req.body;
  const updateData = { name, email };

  try {
    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    // Update user details
    const user = await UserModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error updating user", details: err });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
