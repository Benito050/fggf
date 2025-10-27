import { GoogleGenAI, Type } from "@google/genai";
import { ProductData } from "../types";

// Helper to extract a single frame from a video element at a specific time
const extractFrame = (video: HTMLVideoElement, time: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      // Temporarily remove listeners to avoid multiple resolves
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    const onError = (e: Event | string) => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      reject(new Error(`Failed to seek to time: ${time}. Error: ${e instanceof Event ? e.type : e}`));
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    
    video.currentTime = time;
  });
};

/**
 * Extracts multiple frames from a video file from different timestamps.
 * @param videoFile The video file to process.
 * @returns A promise that resolves to an array of base64 data URLs.
 */
export const extractFramesFromVideo = (videoFile: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.crossOrigin = "anonymous";
    video.preload = "metadata";

    video.onloadedmetadata = async () => {
      const duration = video.duration;
      // Define timestamps: 1s, middle, and 90% through.
      const timestamps: number[] = [1];
      if (duration > 2) {
        timestamps.push(duration / 2);
      }
      if (duration > 3) {
        timestamps.push(duration * 0.9);
      }
      
      // Filter out timestamps that are too close and ensure they are within bounds
      const uniqueTimestamps = [...new Set(timestamps.map(t => Math.min(duration - 0.1, Math.max(0, t))))];

      try {
        // Sequentially extract frames to avoid issues with the video element
        const frames: string[] = [];
        for (const time of uniqueTimestamps) {
            const frame = await extractFrame(video, time);
            frames.push(frame);
        }
        URL.revokeObjectURL(video.src);
        resolve(frames);
      } catch (error) {
        URL.revokeObjectURL(video.src);
        reject(error);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata.'));
    };
  });
};

/**
 * Generates product details using AI from a single image.
 * @param imageDataUrl The base64 data URL of the selected product image.
 * @returns A promise that resolves to the generated product data.
 */
export const generateProductDetails = async (imageDataUrl: string): Promise<ProductData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Remove the "data:image/jpeg;base64," prefix
    const imageBase64 = imageDataUrl.split(',')[1];
    if (!imageBase64) {
        throw new Error("Invalid image data URL provided.");
    }

    const prompt = `You are an expert AI product manager for e-commerce. You create compelling product listings from a single image. Based *only* on the visual information in the provided image, please do the following:
1.  Identify the main product.
2.  Write a catchy, descriptive product title that would appeal to online shoppers.
3.  Write a detailed and compelling product description. Imagine what a shop owner might say about its features, materials, and benefits. Be creative, enthusiastic, and focus on selling the product.
4.  Suggest a competitive market price in USD. The price must be a single numerical value (e.g., 29.99), without any currency symbols or additional text.

Return the result as a single, valid JSON object with the keys "title", "description", and "price".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy product title." },
            description: { type: Type.STRING, description: "Detailed product description." },
            price: { type: Type.NUMBER, description: "Suggested price in USD." }
          },
          required: ['title', 'description', 'price']
        }
      }
    });
    
    let parsedResult: any;
    try {
        parsedResult = JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", response.text);
        throw new Error("The AI model returned a response that was not valid JSON. Please try again.");
    }

    if (
        typeof parsedResult !== 'object' ||
        parsedResult === null ||
        typeof parsedResult.title !== 'string' ||
        typeof parsedResult.description !== 'string' ||
        typeof parsedResult.price !== 'number'
    ) {
        console.error('Invalid data structure from Gemini:', parsedResult);
        throw new Error('The AI model returned data in an unexpected format. Required fields might be missing or have the wrong type.');
    }

    return {
      title: parsedResult.title,
      description: parsedResult.description,
      price: parsedResult.price,
      image: imageDataUrl // Use the full data URL for display
    };

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown error occurred while communicating with the AI model.");
  }
};