const express = require("express");
const bcrypt  = require("bcrypt");
const router  = express.Router();
const User    = require("../models/user");

// Middleware to protect routes
function ensureAuth(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// — GET current user — GET /api/auth/profile
router.get("/profile", ensureAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId, {
      attributes: ["id", "username", "email"],  // only real columns
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// — REGISTER — POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Hash password
    const password_hash = await bcrypt.hash(password, 12);
    const newUser = await User.create({ username, email, password_hash });
    // Auto-login
    req.session.userId = newUser.id;
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ error: err.message });
  }
});

// — LOGIN — POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Success → set session
    req.session.userId   = user.id;
    req.session.username = user.username;
    res.json({ message: "Logged in successfully" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// — LOGOUT — POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
