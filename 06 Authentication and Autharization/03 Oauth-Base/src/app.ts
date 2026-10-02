import cors from "cors";
import connectPgSimple from "connect-pg-simple";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "./auth/passport";
import { env } from "./config/env";
import { pool } from "./db/pool";
import { requireAuth } from "./middleware/requireAuth";
import authRoutes from "./routes/auth";

const PgStore = connectPgSimple(session);

export const app = express();

if (env.isProd) app.set("trust proxy", 1); // needed for secure cookies behind a proxy

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());

app.use(
  session({
    name: "sid",
    store: new PgStore({ pool, tableName: "session" }),
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.isProd,
      sameSite: "lax", // use "none" (+ secure) only if frontend is on a different site
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);

// Example protected route
app.get("/api/profile", requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user!.name ?? req.user!.email}`, user: req.user });
});

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});