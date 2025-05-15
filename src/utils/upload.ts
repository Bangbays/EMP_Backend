import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } from "../config";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME || "",
  api_key: CLOUDINARY_KEY || "",
  api_secret: CLOUDINARY_SECRET || "",
});

const parser = multer().single("avatar");

export function uploadAvatar(req: any, res: any, next: any) {
  parser(req, res, async (error) => {
    if (error) return next(error);
    if (!req.file) return next();
    try {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "avatar" },
        (error, result) => {
          if (error) return next(error);
          req.file.url = result?.secure_url;
          next();
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (error) {
      next(error);
    }
  });
}
