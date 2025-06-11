const express = require("express");
const router = express.Router();
const User = require("../models/user");
const AdoptionApp = require("../models/adoptionApp");
const Reptile = require("../models/reptile");

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email"],
    });
    const results = [];
    for (const u of users) {
      const pending = await AdoptionApp.count({
        where: { user_id: u.id, status: "pending" },
      });
      const approved = await AdoptionApp.count({
        where: { user_id: u.id, status: "approved" },
      });
      const rejected = await AdoptionApp.count({
        where: { user_id: u.id, status: "rejected" },
      });
      const animals = await Reptile.findAll({ where: { owner_id: u.id } });
      results.push({
        id: u.id,
        username: u.username,
        email: u.email,
        pendingApps: pending,
        approvedApps: approved,
        rejectedApps: rejected,
        animals,
      });
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;