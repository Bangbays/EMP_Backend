import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  const status = error.statusCode || 500;
  res
    .status(status)
    .json({ message: error.message || "Internal Server Error" });
}
