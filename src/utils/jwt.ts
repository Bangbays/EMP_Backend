import { JWT_SECRET_KEY } from "../config";
import jwt from "jsonwebtoken";

const JWT_SECRET = JWT_SECRET_KEY || "";
const ACCESS_TOKEN_EXPIRES_IN = "2h";

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
}
