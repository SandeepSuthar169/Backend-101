import "dotenv/config";
import process from "node:process";

const required = (name: string): string => {
  const value = process.env[name];

  if (!value) throw new Error(`Missing required env, ${name}`);

  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 4000),
  isProd: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  googleClientId: required("GOOGLE_CLIENT_ID"),
  googleClientSecret: required("GOOGLE_CLIENT_SECRET"),
  googleCallbackUrl: required("GOOGLE_CALLBACK_URL"),
  sessionSecret: required("SESSION_SECRET"),
  clientUrl: required("CLIENT_URL"),
};
