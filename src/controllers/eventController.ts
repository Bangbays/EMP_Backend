import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as evtService from "../services/eventServices";
import { IEvent } from "../interface/event";
import multer from "multer";
import { uploadImage } from "../utils/cloudinary";

const upload = multer();

export const listEvents = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await evtService.listEvents(_req.query);
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await evtService.getEvent(req.params.id);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const createEvent = [
  upload.single("image"),
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as IEvent;
      if (!req.file) {
        throw new Error("File is required");
      }
      const imageURL = await uploadImage(req.file.buffer, "events");
      payload.imageURL = imageURL;
      const event = await evtService.createEvent(req.userId!, payload);
      res.status(201).json({ message: "Event Created Succes!" });
    } catch (error) {
      next(error);
    }
  },
];
