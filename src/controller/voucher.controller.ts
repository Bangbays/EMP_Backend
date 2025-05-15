import { Request, Response, NextFunction } from "express";
import { getUserPoints, getUserCoupons } from "../service/voucher.service";

export const getPoints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const result = await getUserPoints(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const coupons = await getUserCoupons(userId);
    res.json({ coupons });
  } catch (error) {
    next(error);
  }
};
