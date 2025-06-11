const express = require("express");
const router = express.Router();
const AdoptionApp = require("../models/adoptionApp");
const Reptile = require("../models/reptile");

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

// List all pending applications
router.get("/pending", async (req, res) => {
  try {
    const apps = await AdoptionApp.findAll({
      where: { status: "pending" },
      order: [["createdAt", "DESC"]],
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update application status
router.put("/:id/status", async (req, res) => {
  try {
    const app = await AdoptionApp.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: "Application not found" });
    const { status, reptileId } = req.body;
    if (!["approved", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    await app.update({ status });

    if (status === "approved" && reptileId) {
      const reptile = await Reptile.findByPk(reptileId);
      if (reptile) {
        await reptile.update({ status: "owned", owner_id: app.user_id });
      }
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;