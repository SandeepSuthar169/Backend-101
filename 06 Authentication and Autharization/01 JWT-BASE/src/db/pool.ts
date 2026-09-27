import { Pool } from "pg";
import { env } from "../config/env"

export const pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password
})

// pool.on("connect", () => {
//     console.log("PostgreSQL connection successfully");
// })

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL error:", error);
})

