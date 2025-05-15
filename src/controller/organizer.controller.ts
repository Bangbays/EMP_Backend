import { Request, Response, NextFunction } from "express";
import * as svc from "../service/organizer.service";

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await svc.fetchDashboard(req.user!.id, req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const list = await svc.fethTransaction(req.user!.id);
    res.json({ transactions: list });
  } catch (error) {
    next(error);
  }
};

export const acceptTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await svc.processTransaction(req.params.id, true);
    res.json({ message: "Pembayaran diterima" });
  } catch (error) {
    next(error);
  }
};

export const rejectTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await svc.processTransaction(req.params.id, false);
    res.json({ message: "Pembayaran ditolak" });
  } catch (error) {
    next(error);
  }
};

export const getAttendees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const attendees = await svc.fetchAttendees(req.params.id);
    res.json({ attendees });
  } catch (error) {
    next(error);
  }
};
