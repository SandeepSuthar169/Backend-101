import dotenv from "dotenv";
dotenv.config();

const getENV = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const env = {
  nodeENV: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),

  db: {
    host: getENV("DB_HOST"),
    port: Number(getENV("DB_PORT")),
    database: getENV("DB_NAME"),
    user: getENV("DB_USER"),
    password: getENV("DB_PASSWORD"),
  },

  jwt: {
    secret: getENV("JWT_SECRET"),
    expireIn: getENV("JWT_EXPIRES_IN"),
  },
};
