export interface Slide {
  id: number;
  title: string;
  content: string;
  imagePrompt: string;
  imageData?: string; // Base64 string
  groundingUrls?: string[];
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface ImageGenerationConfig {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
