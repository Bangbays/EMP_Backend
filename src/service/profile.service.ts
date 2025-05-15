import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { addHours } from "date-fns";
import { sendResetEmail } from "../utils/email";
import { JWT_SECRET } from "../config";

export async function updateProfile(
  userId: string,
  data: { name?: string; bio?: string; avatarUrl?: string }
) {
  return prisma.user.update({
    where: { id: userId },
    data: { ...data },
  });
}

export async function changePassword(
  userId: string,
  oldPwd: string,
  newPwd: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User tidak ditemukan");
  const match = await bcrypt.compare(oldPwd, user.passwordHash);
  if (!match) throw new Error("Password lama salah");
  const hash = await bcrypt.hash(newPwd, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hash },
  });
}

export async function requestResetPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Email tidak terdaftar");
  // token jwt khusus reset, expire 1 jam
  const token = jwt.sign({ userId: user.id }, JWT_SECRET!, { expiresIn: "1h" });
  await sendResetEmail(email, token);
}

export async function resetPassword(token: string, newPwd: string) {
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET!);
  } catch {
    throw new Error("Token reset tidak valid atau kadalawarsa");
  }
  const hash = await bcrypt.hash(newPwd, 10);
  await prisma.user.update({
    where: { id: payload.userId },
    data: { passwordHash: hash },
  });
}
