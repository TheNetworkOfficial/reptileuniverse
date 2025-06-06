require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/database');
require('./config/mongoose'); // auto-connect to MongoDB

// ─── 1) Create the Express app ────────────────────────────────────────────────
const app = express();

// ─── 2) Body parsing ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── 2.5) Serve uploaded files statically ────────────────────────────────────
// If someone visits “/uploads/foo.jpg”, Express will look for “backend/uploads/foo.jpg”
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ─── 3) Session middleware (no Redis) ─────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // (MemoryStore is fine for development; it auto-expires on restart)
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ─── 4) Test session route (optional) ─────────────────────────────────────────
app.get('/api/test-session', (req, res) => {
  if (!req.session.count) req.session.count = 0;
  req.session.count += 1;
  res.json({ visits: req.session.count });
});

// ─── 5) Mount your route modules ───────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const reptileRoutes = require('./routes/reptiles');
const adoptionRoutes = require('./routes/adoptions');

app.use('/api/auth', authRoutes);
app.use('/api/reptiles', reptileRoutes);
app.use('/api/adoptions', adoptionRoutes);

// ─── 6) Test PostgreSQL connection & sync ──────────────────────────────────────
sequelize
  .authenticate()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Postgres connection error', err));

// Load models so Sequelize knows about them. The variables are not used
// directly, so we avoid unused variable lint errors by not assigning them.
require('./models/user');
require('./models/reptile');
require('./models/adoption');

sequelize
  .sync({ alter: true })
  .then(() => console.log('All tables synced'))
  .catch(err => console.error('Sync error', err));

// ─── 7) Start the server ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
