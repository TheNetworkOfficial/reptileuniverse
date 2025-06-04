const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password_hash, email });
    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;