import { JWT_SECRET_KEY } from "../config";
import jwt from "jsonwebtoken";

const JWT_SECRET = JWT_SECRET_KEY || "";
const EXPIRE = "2h";

export const signToken = (userId: string): string =>
  jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: EXPIRE });

export const verifyToken = (token: string): { sub: string } =>
  jwt.verify(token, JWT_SECRET) as { sub: string };
