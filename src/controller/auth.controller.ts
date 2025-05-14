import { Request, Response, NextFunction } from "express";
import { register as registerService } from "../service/auth.service";
import { login as loginService } from "../service/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, user } = await loginService(req.body);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};
