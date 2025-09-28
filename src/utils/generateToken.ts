// utils/generateToken.ts
import jwt, { SignOptions } from "jsonwebtoken";

export interface Payload {
  userId: string;
  accountId?: string;
  [key: string]: any;
}

export const generateToken = (payload: Payload): string => {
  const secret = process.env.JWT_SECRET as string;
  let expiresIn: SignOptions["expiresIn"] = "1d"; // default
  const options: SignOptions = {
    expiresIn,
  };
  return jwt.sign(payload, secret, options);
};
