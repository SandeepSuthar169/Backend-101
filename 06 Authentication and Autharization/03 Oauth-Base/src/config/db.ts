import { env } from "./env";
import { Pool, QueryResultRow, Submittable } from "pg";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

export async function query<T extends any[] | QueryResultRow | Submittable = any>(
  text: string,
  params?: unknown[]
) {
  return pool.query<T>(text, params);
}