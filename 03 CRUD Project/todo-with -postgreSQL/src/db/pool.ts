import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});


pool.on("connect", () => {
    console.log("Connect to PosgtreSQL");
})

pool.on("error", (err: Error) => {
    console.error("PostgreSQL connect to faild!", err);  
})

export default pool;