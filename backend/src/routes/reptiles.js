const express = require("express");
const router = express.Router();
const Reptile = require("../models/reptile");

// GET /api/reptiles - return all reptiles
router.get("/", async (req, res) => {
  try {
    const reptiles = await Reptile.findAll();
    res.json(reptiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const reptileData = req.body; // ensure it has name, species, age, etc.
    const newReptile = await Reptile.create(reptileData);
    res.status(201).json(newReptile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/reptiles/:id - update reptile by id
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Reptile.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const reptile = await Reptile.findByPk(req.params.id);
      res.json(reptile);
    } else {
      res.status(404).json({ error: "Reptile not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/reptiles/:id - delete reptile by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Reptile.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: "Deleted" });
    } else {
      res.status(404).json({ error: "Reptile not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;