import { CookieOptions } from "express";
import argon2 from "argon2";

export const sessionStoreUrl =
  process.env["REDIS_URL"] ?? "redis://localhost:6379";
export const sessionSecret = process.env["SESSION_SECRET"] ?? "keyboard cat";
export const isProd = process.env["NODE_ENV"] === "production";
export const cookieSettings: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
};
export const port = process.env["PORT"] ?? 1337;
export const databaseUrl =
  process.env["DATABASE_URL"] ?? "postgres://postgres:reimar@localhost";
export const threeYears = 1000 * 60 * 60 * 24 * 365 * 3;
export const clientUrl = process.env["CLIENT_URL"] ?? "http://localhost:3000";
export const hashingSettings = {
  type: argon2.argon2id,
  memoryCost: 2 ** 14, // 16MB
};
