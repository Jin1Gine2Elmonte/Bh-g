
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("لم يتم إنشاء أي صورة. يرجى المحاولة مرة أخرى.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("حدث خطأ أثناء إنشاء الصورة.");
  }
};


export const editImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:image/png;base64,${base64ImageBytes}`;
        }
      }
    }

    throw new Error("لم يتم العثور على صورة معدلة في الاستجابة.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("حدث خطأ أثناء تعديل الصورة.");
  }
};
