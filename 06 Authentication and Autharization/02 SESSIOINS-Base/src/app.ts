import express from "express";
import session from "express-session";
import pgSesstion from "connect-pg-simple";
import { env } from "./config/env";
import { pool } from "./db/pool";

import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

const PgSession = pgSesstion(session);

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),

    secret: env.secret.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: env.nodeENV === "production",
      sameSite: env.nodeENV === "production" ? "none" : "lax",
      maxAge: Number(env.secret.SESSION_MAX_AGE),
    },
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRouter);

pool.query("SELECT 1");

console.log("PostgreSQL connected Successfully!");

app.listen(env.port, () => {
  console.log("Server running on ", env.port);
});
