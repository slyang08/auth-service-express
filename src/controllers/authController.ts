// src/controllers/authController.ts
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { getUserByEmail, getUserById, registerNewUser } from "../utils/userClient.js";
import Account from "../models/Account.js";
import { Payload, generateToken } from "../utils/generateToken.js";
import { setTokenCookie } from "../utils/setTokenCookie.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response) => {
  const { nickname, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Call the User Service to register a user or retrieve a user
    const response = await registerNewUser(nickname, email);
    const userId = response.data.userId;

    // Add Account Information (Password)
    await Account.create({ user: userId, password });

    res.status(201).json({ message: "Registration successful. Please verify your email." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Register error:", error.message);
      res.status(500).json({
        message: "Registration failed",
        error: error.message,
      });
    } else {
      console.error("Unknown register error:", error);
      res.status(500).json({
        message: "Registration failed",
        error: "Unknown error",
      });
    }
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Check if the email address has been verified
    if (!user.verified)
      return res.status(401).json({ message: "Account not verified. Please check your email." });

    const account = await Account.findOne({ user: user._id }).select("+password");
    if (!account) return res.status(401).json({ message: "Sorry, cannot find the account" });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const maybeAccountId: unknown = account?._id;
    const payload: Payload = {
      userId: user._id.toString(),
      accountId:
        typeof maybeAccountId === "string"
          ? maybeAccountId
          : typeof maybeAccountId === "object" &&
              maybeAccountId !== null &&
              "toString" in maybeAccountId
            ? (maybeAccountId as { toString: () => string }).toString()
            : undefined,
    };

    const token = generateToken(payload);
    // Set the token in a cookie
    setTokenCookie(res, token);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        name: user.name,
        email: user.email,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
      },
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

/**
 * @desc    Get current user info
 * @route   GET /api/auth/me
 * @access  Private (valid JWT required)
 */
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const userResponse = await getUserById(req.userId);
    const user = userResponse.data;
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};
