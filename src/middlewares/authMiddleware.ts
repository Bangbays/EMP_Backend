import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = header.split(" ")[1];
  try {
    const payload = verifyToken(token);
    res.status(401).json({ message: "Invalid Token" });
    return;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
}
