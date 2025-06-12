require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const path = require("path");
const sequelize = require("./config/database");
 // Mongo disabled for now; uncomment when you add a real Mongo URI
 // require("./config/mongoose");

// ─── 1) Create the Express app ────────────────────────────────────────────────
const app = express();

// ─── 2) Security middleware ───────────────────────────────────────────────────
app.use(helmet());

// ─── 3) Body parsing ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── 3.5) Serve uploaded files statically ────────────────────────────────────
// If someone visits “/uploads/foo.jpg”, Express will look for “backend/uploads/foo.jpg”
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "../client/assets")));

// ─── 4) Session middleware (no Redis) ─────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // (MemoryStore is fine for development; it auto-expires on restart)
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // in prod, require HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

// ─── 5) Test session route (optional) ─────────────────────────────────────────
app.get("/api/test-session", (req, res) => {
  if (!req.session.count) req.session.count = 0;
  req.session.count += 1;
  res.json({ visits: req.session.count });
});

// ─── 6) Mount your route modules ───────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const reptileRoutes = require("./routes/reptiles");
const adoptionRoutes = require("./routes/adoptions");
const surrenderRoutes = require("./routes/surrenders");
const healthInspectionRoutes = require("./routes/healthInspections");
const adoptionAppRoutes = require("./routes/adoptionApps");
const clientsRoutes = require("./routes/clients");
const recoveryRoutes = require("./routes/accountRecovery");

// Rate-limit auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: "Too many attempts, please try again later" },
});

const recoveryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many recovery attempts, please try again later" },
});


app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/reptiles", reptileRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/surrenders", surrenderRoutes);
app.use("/api/health-inspections", healthInspectionRoutes);
app.use("/api/adoption-apps", adoptionAppRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/account-recovery", recoveryLimiter, recoveryRoutes);

// ─── 7) Test PostgreSQL connection & sync ──────────────────────────────────────
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.error("Postgres connection error", err));

// Load models so Sequelize knows about them. The variables are not used
// directly, so we avoid unused variable lint errors by not assigning them.
require("./models/user");
require("./models/reptile");
require("./models/adoption");
require("./models/surrender");
require("./models/healthInspection");
require("./models/adoptionApp");

sequelize
  .sync({ alter: true })
  .then(() => console.log("All tables synced"))
  .catch((err) => console.error("Sync error", err));

// ─── 8) Start the server ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));