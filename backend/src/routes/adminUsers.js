const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { ensureAdmin } = require("./auth");

// List current admins
router.get("/", ensureAdmin, async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { isAdmin: true },
      attributes: ["id", "username", "email"],
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all users (for selecting new admins)
router.get("/all", ensureAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "isAdmin"],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Promote user to admin
router.post("/:id", ensureAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.isAdmin = true;
    await user.save();
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove admin rights
router.delete("/:id", ensureAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.isAdmin = false;
    await user.save();
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;