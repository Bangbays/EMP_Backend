import { Request, Response, NextFunction } from "express";
import { referralService } from "../service/referral.service";

export const useReferral = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await referralService(req.user!.id, req.body.referralCode);
    res.status(200).json({ message: "Referral berhasil digunakan" });
  } catch (error) {
    next(error);
  }
};
