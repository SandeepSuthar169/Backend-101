import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

 const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
  console.log("PostgreSQL client connected successfully");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected PostgreSQL pool error:", err.message);
});

export const checkDatabaseConnection = async () => {
  const result = await pool.query("SELECT NOW()");
  return result.rows[0];
};

export default pool;

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  console.log("PostgreSQL table is ready");
}