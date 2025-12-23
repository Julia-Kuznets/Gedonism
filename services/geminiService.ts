import { GoogleGenAI, Type } from "@google/genai";
import { ImageGenerationConfig } from "../types";

const apiKey = process.env.API_KEY || '';

// We create a new instance per call to ensure we pick up the key if it changes (though here it is env based)
// But for the 'key selection' requirement in other contexts, dynamic creation is safer. 
// Here we just use the simple initialization.
const getAI = () => new GoogleGenAI({ apiKey });

export const generateSlideContent = async (topic: string, currentContent: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful assistant creating a presentation slide about: ${topic}. 
      Current content: "${currentContent}".
      Enhance this content or provide more accurate details using Google Search. 
      Keep it concise and suitable for a presentation slide.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an expert on philosophy, specifically Hedonism and Aristippus. Provide accurate, engaging text.",
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string) => !!uri);

    return { text, urls };
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, config: ImageGenerationConfig) => {
  const ai = getAI();
  try {
    // Guidelines: Use gemini-3-pro-image-preview for high quality images and size control
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  try {
    // Guidelines: Use gemini-2.5-flash-image for editing
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for generated images, or generic
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image returned");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};
