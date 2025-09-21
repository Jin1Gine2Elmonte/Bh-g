import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from '../types';
import { sleep } from "../utils";

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
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
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

export const generateVideo = async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
  try {
    onProgress("بدء عملية إنشاء الفيديو...");
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      config: {
        numberOfVideos: 1
      }
    });

    onProgress("تم إرسال الطلب. تتم معالجة الفيديو الآن...");
    
    const pollInterval = 10000; // 10 seconds
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes timeout

    while (!operation.done && attempts < maxAttempts) {
      await sleep(pollInterval);
      onProgress(`جاري التحقق من حالة الفيديو... (محاولة ${attempts + 1})`);
      operation = await ai.operations.getVideosOperation({ operation: operation });
      attempts++;
    }

    if (!operation.done) {
        throw new Error("انتهت مهلة إنشاء الفيديو. يرجى المحاولة مرة أخرى.");
    }
    
    if (operation.error) {
        throw new Error(`حدث خطأ أثناء إنشاء الفيديو: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (downloadLink) {
        onProgress("اكتمل إنشاء الفيديو!");
        // The API key is required to access the download link
        return `${downloadLink}&key=${process.env.API_KEY}`;
    } else {
        throw new Error("فشل استرداد رابط تنزيل الفيديو.");
    }

  } catch (error) {
    console.error("Error generating video:", error);
    if (error instanceof Error) {
        throw new Error(`فشل إنشاء الفيديو: ${error.message}`);
    }
    throw new Error("حدث خطأ غير متوقع أثناء إنشاء الفيديو.");
  }
};