import { Request, Response, NextFunction } from "express";
import * as svc from "../service/profile.service";

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: any = { ...req.body };
    if ((req.file as any)?.url) data.avatarUrl = (req.file as any).url;
    const user = await svc.updateProfile(req.user!.id, data);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await svc.changePassword(
      req.user!.id,
      req.body.oldPassword,
      req.body.newPassword
    );
    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    next(error);
  }
};

export const requestResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await svc.requestResetPassword(req.body.email);
    res.json({ message: "Link reset password telah dikirim ke email Anda" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        await svc.resetPassword(req.body.token, req.body.newPassword);
        res.json({message: "Password berhasil di reset"});
    } catch (error) {
        next(error)
    }
  }