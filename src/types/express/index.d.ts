// src/types/express/index.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id?: string;
        nickname?: string;
        phone?: string;
        preferredLanguage?: string;
      };
      userId?: string;
      validatedBody?: any;
    }
  }
}
