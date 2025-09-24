// src/utils/password.ts
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

interface PreviousPassword {
  hash: string;
}

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const isPasswordReused = async (
  newPassword: string,
  previousPasswords: PreviousPassword[] = []
) => {
  const checks = await Promise.all(
    previousPasswords.map((prev) => bcrypt.compare(newPassword, prev.hash))
  );
  return checks.some((match) => match);
};
