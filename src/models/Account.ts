// src/models/Account.ts
import bcrypt from "bcryptjs";
import mongoose, { Document, model, Schema, Types } from "mongoose";

import { hashPassword, isPasswordReused } from "../utils/password.js";

export interface AccountAttrs {
  user: Types.ObjectId;
  password: string;
  status?: "Active" | "Closed" | "Frozen";
  previousPasswords?: PreviousPassword[];
}

interface PreviousPassword {
  hash: string;
  changedAt: Date;
}

export interface AccountDoc extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  password: string;
  status: "Active" | "Closed" | "Frozen";
  previousPasswords: PreviousPassword[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const accountSchema = new Schema<AccountDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Use .select('+password') when needed
    },
    status: {
      type: String,
      enum: ["Active", "Closed", "Frozen"],
      default: "Active",
      index: true,
    },
    previousPasswords: [
      {
        hash: String,
        changedAt: Date,
      },
    ],
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

// Composite Index
accountSchema.index({ user: 1, status: 1 });

// Password encryption middleware
accountSchema.pre<AccountDoc>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    if (await isPasswordReused(this.password, this.previousPasswords)) {
      return next(new Error("New password cannot be the same as previous passwords."));
    }

    // Hash the password
    const hashed = await hashPassword(this.password);
    this.password = hashed;
    this.previousPasswords.push({ hash: hashed, changedAt: new Date() });

    // Keep up to 3 records
    if (this.previousPasswords.length > 3) this.previousPasswords.shift(); // Delete the oldest password record

    next();
  } catch (err) {
    if (err instanceof Error) {
      next(err);
    } else {
      next(new Error(String(err)));
    }
  }
});

// Add password comparison method (for login verification)
accountSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Account = model<AccountDoc>("Account", accountSchema);

export default Account;
