import { Pool } from "pg";
import { env } from "../config/env.js";

export const pool = new Pool({
  connectionString: await env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (error) => {
    console.error(`Unexprected Postgres Pool error, ${error}`);
})

