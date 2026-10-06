import "dotenv/config";

import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(databaseUrl);

const result = await sql`
    INSERT INTO usersss (first_name, last_name, age)
    VALUES
    ('sandeep', 'suthar', 23);
`
console.log(result);
