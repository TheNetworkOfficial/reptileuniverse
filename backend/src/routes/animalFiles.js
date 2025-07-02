const express = require("express");
const router = express.Router();
const AnimalFile = require("../models/animalFile");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

router.get("/:reptileId", async (req, res) => {
  try {
    const list = await AnimalFile.findAll({
      where: { reptile_id: req.params.reptileId },
      order: [["id", "DESC"]],
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:reptileId", upload.array("files", 10), async (req, res) => {
  try {
    const rid = req.params.reptileId;
    const created = [];
    for (const f of req.files) {
      const file = await AnimalFile.create({
        reptile_id: rid,
        filename: f.originalname,
        url: `/uploads/${f.filename}`,
      });
      created.push(file);
    }
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const file = await AnimalFile.findByPk(req.params.id);
    if (!file) return res.status(404).json({ error: "Not found" });
    const filename = file.url.split("/").pop();
    const filepath = path.join(__dirname, "../uploads", filename);
    await file.destroy();
    fs.unlink(filepath, () => {});
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
