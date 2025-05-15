import { Request } from "express";
import { IUserPayload } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
