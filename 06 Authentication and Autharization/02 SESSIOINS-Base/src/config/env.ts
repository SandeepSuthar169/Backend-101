import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}`
    );
  }

  return value;
}

export const env = {
  nodeEnv:
    process.env.NODE_ENV ?? "development",

  port: Number(
    process.env.PORT ?? 5000
  ),

  db: {
    host: required("DB_HOST"),
    port: Number(required("DB_PORT")),
    database: required("DB_NAME"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD")
  },

  session: {
    secret: required("SESSION_SECRET"),

    maxAge: Number(
      process.env.SESSION_MAX_AGE ??
        86400000
    )
  }
};