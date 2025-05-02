import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { IRegister, ILogin } from "../interface/auth";

export async function register(
  req: Request<{}, {}, IRegister>,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = await authService.register(req.body);
    const user = await authService.getProfile(auth.accessToken);
    res.status(201).json({ ...auth, user });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<{}, {}, ILogin>,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = await authService.login(req.body);
    res.json(auth);
  } catch (error) {
    next(error);
  }
}
