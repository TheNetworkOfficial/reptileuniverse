// 1) Load .env as early as possible
require("dotenv").config();

// — Sanity check: ensure SESSION_SECRET is set —
if (!process.env.SESSION_SECRET) {
  console.error("🔥 SESSION_SECRET is not defined! Check your .env file or PM2 --update-env.");
  process.exit(1);
}

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const cors = require("cors");

// ─── 2) Create the Express app ────────────────────────────────────────────────
const app = express();

// ─── 3) If behind Lightsail/Nginx proxy, trust it so req.secure is correct ──────
app.set("trust proxy", 1);

// ─── 4) Security & parsing middleware ──────────────────────────────────────────
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── 5) Static file serving ────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "../client/assets")));

// ─── 6) CORS (allow credentials + your origin) ─────────────────────────────────
app.use(
  cors({
    origin: "https://reptileuniverse.org", // adjust if different
    credentials: true,
  })
);

// ─── 7) Session middleware ─────────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET,       // ← must be defined
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,             // 1 day
    },
  })
);

// ─── 8) (Optional) A quick debug endpoint ───────────────────────────────────────
app.get("/api/test-session", (req, res) => {
  if (!req.session.count) req.session.count = 0;
  req.session.count++;
  res.json({ visits: req.session.count });
});

// ─── 9) Rate-limiters & route mounting ──────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many attempts, please try again later" },
});
const recoveryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many recovery attempts, please try again later" },
});

const authRoutes = require("./routes/auth");
const reptileRoutes = require("./routes/reptiles");
const adoptionRoutes = require("./routes/adoptions");
const surrenderRoutes = require("./routes/surrenders");
const healthInspectionRoutes = require("./routes/healthInspections");
const adoptionAppRoutes = require("./routes/adoptionApps");
const clientsRoutes = require("./routes/clients");
const recoveryRoutes = require("./routes/accountRecovery");

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/reptiles", reptileRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/surrenders", surrenderRoutes);
app.use("/api/health-inspections", healthInspectionRoutes);
app.use("/api/adoption-apps", adoptionAppRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/account-recovery", recoveryLimiter, recoveryRoutes);

// ─── 10) Database sync & start ─────────────────────────────────────────────────
const sequelize = require("./config/database");
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.error("Postgres connection error", err));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
