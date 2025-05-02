import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as txService from "../services/transactionService";
import multer from "multer";

const upload = multer();

export const checkout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tx = await txService.checkout(req.userId!, req.body);
    res.status(201).json(tx);
  } catch (error) {
    next(error);
  }
};

export const uploadProof = [
  upload.single("file"),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new Error("File is required");
      }
      const tx = await txService.uploadProof(req.params.id, req.file.buffer);
      res.json(tx);
    } catch (error) {
      next(error);
    }
  },
];

export const getTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tx = await txService.getTransaction(req.params.id);
    res.json(tx);
  } catch (error) {
    next(error);
  }
};
