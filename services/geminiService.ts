import { GoogleGenAI, Type, Chat, Modality } from '@google/genai';
import { ProductData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const base64ToPart = (base64: string, mimeType: string) => {
    return {
        inlineData: {
            data: base64.split(',')[1],
            mimeType
        }
    };
};

export const extractFramesFromVideo = (videoFile: File, frameCount = 6): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const videoElement = document.createElement('video');
        videoElement.muted = true;
        videoElement.crossOrigin = "anonymous";
        videoElement.src = URL.createObjectURL(videoFile);

        videoElement.onloadedmetadata = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(videoElement.src);
                reject(new Error("Unable to get canvas context"));
                return;
            }

            const frames: string[] = [];
            const duration = videoElement.duration;
            if (duration < 1 && frameCount > 1) frameCount = 1;

            for (let i = 0; i < frameCount; i++) {
                const time = (i / (frameCount > 1 ? frameCount - 1 : 1)) * duration;
                videoElement.currentTime = Math.min(time, duration);
                
                await new Promise(r => {
                    const listener = () => {
                        videoElement.removeEventListener('seeked', listener);
                        r(null);
                    };
                    videoElement.addEventListener('seeked', listener, { once: true });
                });

                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                frames.push(canvas.toDataURL('image/jpeg', 0.8));
            }
            
            URL.revokeObjectURL(videoElement.src);
            if (frames.length > 0) {
                resolve(frames);
            } else {
                reject(new Error("Could not extract any frames. The video might be too short or in an unsupported format."));
            }
        };
        videoElement.onerror = () => {
            URL.revokeObjectURL(videoElement.src);
            reject(new Error("Error loading video. It may be corrupt or in an unsupported format."));
        };
    });
};


export const generateProductDetails = async (frame: string): Promise<ProductData[]> => {
    const imagePart = base64ToPart(frame, 'image/jpeg');
    const prompt = `Analyze this image and identify all distinct e-commerce products. For each product:
1. Provide a unique ID, a concise and appealing title, and a short but compelling description (under 150 characters).
2. A reasonable, competitive price in INR.
3. The primary material (e.g., "Cotton", "Wood", "Leather").
4. Estimated dimensions as a string (e.g., "15cm x 10cm x 5cm").
5. A list of 2-3 key features.
6. Use the search tool to find 2-3 price comparisons from other online stores.

Your response must be a valid JSON array. Each object must have "id", "title", "description", "price", "material", "dimensions", "features", and "priceComparisons". If a field cannot be determined, provide a reasonable default or null.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            tools: [{ googleSearch: {} }]
        }
    });

    let jsonString = response.text.trim();
    
    // The model might wrap the JSON in markdown backticks, so we extract it.
    const jsonMatch = jsonString.match(/```(json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[2]) {
        jsonString = jsonMatch[2];
    }

    try {
        const products = JSON.parse(jsonString);
        // Basic validation
        if (!Array.isArray(products)) throw new Error("Response is not an array");
        
        return products.filter(p => p && p.id && p.title && p.price).map((p: any) => ({ ...p, image: frame }));
    } catch (e) {
        console.error("Failed to parse product JSON:", jsonString);
        throw new Error("The AI returned an invalid response. Please try again.");
    }
};

export const generateUniqueImagesForProducts = async (products: ProductData[]): Promise<ProductData[]> => {
    const updatedProducts = await Promise.all(
        products.map(async (product) => {
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [{ text: `A professional, clean product photo of a "${product.title}" on a neutral studio background.` }],
                    },
                    config: {
                        responseModalities: [Modality.IMAGE],
                    },
                });

                const firstPart = response.candidates?.[0]?.content?.parts?.[0];
                if (firstPart?.inlineData) {
                    const base64ImageBytes = firstPart.inlineData.data;
                    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                    return { ...product, image: imageUrl };
                }
                return product;
            } catch (error) {
                console.error(`Failed to generate image for ${product.title}:`, error);
                return product;
            }
        })
    );
    return updatedProducts;
};


export const editImageWithPrompt = async (base64Image: string, prompt: string): Promise<string> => {
    const mimeType = base64Image.substring(base64Image.indexOf(":") + 1, base64Image.indexOf(";"));
    const imagePart = base64ToPart(base64Image, mimeType);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart?.inlineData) {
        const base64ImageBytes = firstPart.inlineData.data;
        return `data:image/png;base64,${base64ImageBytes}`;
    }

    throw new Error("Failed to edit image. The AI did not return an image.");
};

export const createChatSession = (): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and friendly AI assistant for an e-commerce business owner. Your goal is to provide actionable advice, marketing tips, and answer business-related questions. When asked about locations, use your tools to provide accurate information.',
            tools: [{ googleMaps: {} }],
        },
    });
    return chat;
};