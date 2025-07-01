const express = require("express");
const router = express.Router();
const { ensureAdmin } = require("./auth");

router.get("/check", ensureAdmin, (req, res) => {
  res.json({ admin: true });
});

module.exports = router;