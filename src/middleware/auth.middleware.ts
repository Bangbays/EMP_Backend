import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authenticate: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token required" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET!) as any;
    (req as any).user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
