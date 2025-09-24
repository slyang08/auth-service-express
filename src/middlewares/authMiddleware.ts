// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import Account from "../models/Account.js";
import { getUserById } from "../utils/userClient.js";

export interface CustomRequest extends Request {
  userId?: string;
  accountId?: string;
  user?: any;
  account?: any;
}

// JWT Mandatory Verification
export const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      accountId: string;
    };

    // Get user
    const user = await getUserById(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    const account = await Account.findById(decoded.accountId).select("-password");
    if (!account) throw new Error("Account not found");

    // Check account status
    if (account.status !== "Active") {
      return res.status(403).json({ message: `Account is ${account.status}` });
    }

    // attach to request
    req.userId = decoded.userId;
    req.accountId = decoded.accountId;
    req.user = user;
    req.account = account;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token failed or expired" });
  }
};

// Optional JWT validation
export async function optionalJwt(req: CustomRequest, res: Response, next: NextFunction) {
  let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
        accountId: string;
      };
      req.userId = decoded.userId;
      req.accountId = decoded.accountId;
    } catch (err) {
      console.error("JWT verification failed:", err);
    }
  }
  next();
}

// Automatically hang accounts (for session authentication)
export async function attachAccount(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    if (req.user && !req.account) {
      let account = await Account.findOne({ user: req.user._id });
      if (!account) {
        // Automatically create an account
        account = await Account.create({
          user: req.user._id,
          password: "google-oauth", // Marked with a special string
          status: "Active",
        });
      }
      req.account = account;
    } else if (req.userId && !req.account) {
      let account = await Account.findById(req.accountId);
      if (!account) {
        return res.status(401).json({ message: "Account not found" });
      }
      req.account = account;
    }
    next();
  } catch (err) {
    next(err);
  }
}
