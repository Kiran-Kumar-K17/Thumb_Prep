import { imagekit } from "../config/imagekit.js";

export class ImageKitService {
  static async uploadOriginal(file: Express.Multer.File) {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "/thumbprep/originals",
    });
    return { url: response.url };
  }

  static async uploadThumbnail(image: Buffer) {
    const response = await imagekit.upload({
      file: image,
      fileName: `thumbnail-${Date.now()}.png`,
      folder: "/thumbprep/thumbnails",
    });

    return {
      url: response.url,
    };
  }

  static async downloadImage(url: string) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to download image");
    }

    const arrayBuffer = await response.arrayBuffer();

    return Buffer.from(arrayBuffer);
  }
}
