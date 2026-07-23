import { ai } from "../config/gemini.js";

export class GeminiService {
  static async generateThumbnail(
    image: Buffer,
    mimeType: string,
    prompt: string,
  ) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // Use an image-generation capable model
      contents: [
        {
          text: prompt,
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: image.toString("base64"),
          },
        },
      ],
      config: {
        // Request an image response explicitly
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData,
    );

    if (!imagePart?.inlineData?.data) {
      throw new Error("Gemini did not return an image.");
    }

    return Buffer.from(imagePart.inlineData.data, "base64");
  }
}
