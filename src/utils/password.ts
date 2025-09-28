// src/utils/password.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

interface PreviousPassword {
  hash: string;
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

export const isPasswordReused = async (newPassword: string, previous: PreviousPassword[]) => {
  for (const prev of previous) {
    const match = await bcrypt.compare(newPassword, prev.hash);
    if (match) return true;
  }
  return false;
};
