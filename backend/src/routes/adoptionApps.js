const express = require("express");
const router = express.Router();
const AdoptionApp = require("../models/adoptionApp");

function ensureAuth(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// Submit a new adoption application
router.post("/", ensureAuth, async (req, res) => {
  try {
    const record = await AdoptionApp.create({
      ...req.body,
      user_id: req.session.userId,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List applications for the current user
router.get("/my", ensureAuth, async (req, res) => {
  try {
    const apps = await AdoptionApp.findAll({
      where: { user_id: req.session.userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;