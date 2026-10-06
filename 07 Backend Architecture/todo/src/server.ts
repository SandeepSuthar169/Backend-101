import type { Request, Response } from "express";
import express from "express";
import dotenv from "dotenv";
import pool from "./db/pool";
import { errorHandler } from "./utils/error";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "server is healthy.",
    success: true,
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.use(errorHandler);

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err);
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  try {
    await pool.query("SELECT 1");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});