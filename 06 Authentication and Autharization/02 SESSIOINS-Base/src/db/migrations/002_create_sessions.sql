CREATE TABLE IF NOT EXISTS "user_sessions" (
    "sid" varchar NOT NULL PRIMARY KEY,
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_user_sessions_expire"
ON "user_sessions" ("expire");