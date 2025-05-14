import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { JWT_SECRET } from "../config";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const payload = jwt.verify(token, JWT_SECRET!) as any;
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
