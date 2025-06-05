const express = require('express');
const router = express.Router();
const Reptile = require('../models/reptile');

// GET /api/reptiles - return all reptiles
router.get('/', async (req, res) => {
  try {
    const reptiles = await Reptile.findAll();
    res.json(reptiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const reptileData = req.body; // ensure it has name, species, age, etc.
    const newReptile = await Reptile.create(reptileData);
    res.status(201).json(newReptile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;