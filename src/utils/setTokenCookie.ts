// src/utils/setTokenCookie.js
import { Response } from "express";

export function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
}
