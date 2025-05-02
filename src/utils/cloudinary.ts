import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } from "../config";
import { Readable } from "stream";
import { error } from "console";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  cloud_key: CLOUDINARY_KEY,
  cloud_secret: CLOUDINARY_SECRET,
});

export function uploadImage(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const readStream = new Readable();
    readStream.push(buffer);
    readStream.push(null);
    const upload = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => (error ? reject(error) : resolve(result!.secure_url))
    );
    readStream.pipe(upload);
  });
}
