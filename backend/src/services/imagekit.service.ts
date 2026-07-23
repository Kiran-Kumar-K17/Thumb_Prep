import { imagekit } from "../config/imagekit.js";

export class ImageKitService {
  static async upload(file: Express.Multer.File) {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "/thumbprep/originals",
    });
    return { url: response.url };
  }
}
