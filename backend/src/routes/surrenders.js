// routes/surrenders.js
const express = require("express");
const router = express.Router();
const Surrender = require("../models/surrender");

// POST /api/surrenders
router.post("/", async (req, res) => {
  try {
    // req.body will hold all your form fields
    const record = await Surrender.create({
      ...req.body,
      // convert “Yes”/“No” to boolean
      haveVet: req.body.haveVet === "Yes",
    });
    return res.status(201).json(record);
  } catch (err) {
    console.error("Error creating surrender:", err);
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/surrenders
router.get("/", async (req, res) => {
  try {
    const where = {};
    if (req.query.formStatus) where.formStatus = req.query.formStatus;
    const forms = await Surrender.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });
    res.json(forms);
  } catch (err) {
    console.error("Error fetching surrenders:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/surrenders/:id/status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const form = await Surrender.findByPk(req.params.id);
    if (!form) return res.status(404).json({ error: "Form not found" });
    await form.update({ formStatus: status });
    res.json(form);
  } catch (err) {
    console.error("Error updating surrender status:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;