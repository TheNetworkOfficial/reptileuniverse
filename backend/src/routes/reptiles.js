// routes/reptiles.js
const express = require('express');
const router = express.Router();
const Reptile = require('../models/reptile');
const multer = require('multer');
const path = require('path');

// ─── 1) Set up multer storage engine ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save all files into “backend/uploads/”
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    // Give every file a unique prefix + original extension:
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // e.g. “.png”
    cb(null, uniqueSuffix + ext);
  },
});

// (Optional) Only allow images
function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
}

// Create multer instance: at most 5 files, each ≤ 5 MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ─── 2) GET /api/reptiles ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const reptiles = await Reptile.findAll();
    res.json(reptiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 3) POST /api/reptiles ─────────────────────────────────────────────────────
// “upload.array('images', 5)” handles up to 5 files from <input name="images" multiple>
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    // 3.1) Text fields: found in req.body
    const {
      name,
      species,
      age,
      location,
      sex,
      traits,
      bio,
      requirements,
    } = req.body;

    // 3.2) File uploads: found in req.files (array of file‐info objects)
    // Build an array of URLs that the frontend can use. Because we set up:
    // app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
    // a file saved as “uploads/1628-1234.jpg” is available at “/uploads/1628-1234.jpg”
    const imageUrls = (req.files || []).map((file) => `/uploads/${file.filename}`);

    // 3.3) Consolidate into a single object for Sequelize
    const reptileData = {
      name,
      species,
      age,
      location,
      sex,
      traits,
      bio,
      requirements,
      image_urls: imageUrls, // JSON array of strings
    };

    // 3.4) Create the record
    const newReptile = await Reptile.create(reptileData);
    res.status(201).json(newReptile);
  } catch (err) {
    console.error('Error creating reptile:', err);
    res.status(400).json({ error: err.message });
  }
});

// ─── 4) PUT /api/reptiles/:id ──────────────────────────────────────────────────
// If you want to allow updating existing reptiles (including changing images),
// you can do something similar. For example, replace old images or append new ones:
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const reptile = await Reptile.findByPk(req.params.id);
    if (!reptile) {
      return res.status(404).json({ error: 'Reptile not found' });
    }

    // 4.1) Gather text fields
    const {
      name,
      species,
      age,
      location,
      sex,
      traits,
      bio,
      requirements,
    } = req.body;

    // 4.2) If new files were uploaded, build their URLs
    const newImageUrls = (req.files || []).map((file) => `/uploads/${file.filename}`);

    // 4.3) Decide your logic: overwrite the old array, or append to it? Here’s an example
    let imageUrls = reptile.image_urls || [];
    if (newImageUrls.length > 0) {
      // For instance, append new ones onto existing array:
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    // 4.4) Update fields
    await reptile.update({
      name,
      species,
      age,
      location,
      sex,
      traits,
      bio,
      requirements,
      image_urls: imageUrls,
    });

    res.json(reptile);
  } catch (err) {
    console.error('Error updating reptile:', err);
    res.status(400).json({ error: err.message });
  }
});

// ─── 5) DELETE /api/reptiles/:id ──────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Reptile.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Deleted' });
    } else {
      res.status(404).json({ error: 'Reptile not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
