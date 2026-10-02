import dotenv from "dotenv";
import { AppError } from "../utils/error";

dotenv.config();

const required = (name: string): string => {
  const value = process.env[name];

  if (!value) throw new Error(`Missing environment variable: ${name}`);

  return value;
};

export const env = {
  PORT: Number(process.env.PORT || 5000),

  DATABASE_URL: required("DATABASE_URL"),
  
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),

  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),

  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",

  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  NODE_ENV: process.env.NODE_ENV || "development",
};
