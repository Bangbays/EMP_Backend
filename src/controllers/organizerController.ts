import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as orgService from "../services/organizerService";
import { OrganizerForm } from "../interface/organizer";

export async function applyOrganizer(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await orgService.applyOrganizer(
      req.userId!,
      req.body as OrganizerForm
    );
    res.status(202).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const status = await orgService.getStatus(req.userId!);
    res.json(status);
  } catch (error) {
    next(error);
  }
}
