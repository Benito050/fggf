import { GoogleGenAI, Type, Modality, Chat } from "@google/genai";
import { ProductData } from "../types";

// Initialize the Google AI SDK
// The API key is provided via an environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Extracts frames from a video file at regular intervals.
 * This function creates video and canvas elements in memory to process the video.
 * @param videoFile The video file to process.
 * @returns A promise that resolves to an array of base64 encoded image strings (data URLs).
 */
export const extractFramesFromVideo = (videoFile: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return reject(new Error('Could not get canvas context. Your browser might not be supported.'));
    }

    const frames: string[] = [];
    const maxFrames = 6; // We aim to extract up to 6 frames for selection.

    video.onloadedmetadata = async () => {
      // Ensure video dimensions are available before proceeding.
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        // Fallback for browsers that need a little push.
        video.currentTime = 0.1; 
        await new Promise(r => setTimeout(r, 200)); // wait a bit
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const duration = video.duration;
      // If duration is not available, reject.
      if (!isFinite(duration) || duration <= 0) {
        URL.revokeObjectURL(video.src);
        return reject(new Error("Could not determine video duration. The video file may be corrupt."));
      }

      const interval = duration / (maxFrames + 1); // Space frames evenly, avoiding the very start/end.

      const captureFrame = (time: number): Promise<void> => {
        return new Promise((resolveFrame, rejectFrame) => {
          video.currentTime = time;
          // 'seeked' event fires when the seeking operation is complete.
          video.onseeked = () => {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            frames.push(canvas.toDataURL('image/jpeg', 0.8)); // Use JPEG for smaller size.
            resolveFrame();
          };
          // Handle cases where seeking fails.
          video.onerror = () => rejectFrame(new Error("Error seeking to a frame in the video."));
        });
      };

      try {
        for (let i = 1; i <= maxFrames; i++) {
          const time = interval * i;
          if (time < duration) {
            await captureFrame(time);
          }
        }
        URL.revokeObjectURL(video.src); // Clean up the object URL.
        resolve(frames);
      } catch (error) {
        URL.revokeObjectURL(video.src);
        reject(error);
      }
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata. The file might be in an unsupported format.'));
    };
  });
};


/**
 * Generates product details for all visible products in an image using the Gemini API.
 * @param base64Image A base64 encoded data URL of the product image.
 * @returns A promise that resolves to an array of generated ProductData.
 */
export const generateProductDetails = async (base64Image: string): Promise<ProductData[]> => {
    const model = 'gemini-2.5-flash';

    // Schema for a single product object.
    const productSchema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A short, catchy, and SEO-friendly title for the product (under 60 characters)."
        },
        description: {
          type: Type.STRING,
          description: "A detailed and compelling product description (2-3 sentences) highlighting key features and benefits."
        },
        price: {
          type: Type.NUMBER,
          description: "A competitive market price for the product, as a number without currency symbols."
        },
        material: { 
          type: Type.STRING, 
          description: "The primary material of the product (e.g., 'Cotton', 'Stainless Steel'). Make a reasonable guess." 
        },
        dimensions: { 
          type: Type.STRING, 
          description: "Estimated dimensions in a common format (e.g., '15\" x 10\"'). Make a reasonable guess." 
        },
        features: {
          type: Type.ARRAY,
          description: "A list of 2-4 key feature bullet points.",
          items: { type: Type.STRING }
        }
      },
      required: ['title', 'description', 'price']
    };

    // The top-level schema is now an array of the product schema.
    const responseSchema = {
        type: Type.ARRAY,
        items: productSchema
    };

    const imageData = base64Image.split(',')[1];
    if (!imageData) {
      throw new Error("Invalid base64 image format.");
    }

    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: 'image/jpeg',
      },
    };

    const textPart = {
      text: `Analyze the image for an e-commerce store. Identify ALL distinct products visible. For each product, generate a title, a detailed description, a suggested price, the primary material, estimated dimensions, and a list of 2-4 key features. Be descriptive. If the image is blurry, focus on general shapes and assumed materials. Return the result as a JSON array, where each object represents one product. If only one product is visible, return an array with a single object. Ensure every object in the array contains at least a title, description, and price.`,
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    const generatedDataArray = JSON.parse(jsonText);

    if (!Array.isArray(generatedDataArray)) {
        throw new Error("AI response was not a valid array of products.");
    }

    // Validate and map the data, filtering out any malformed entries.
    return generatedDataArray
      .map((product: any, index: number): ProductData | null => {
        // Ensure all required fields are present and have the correct type.
        if (typeof product.title === 'string' && typeof product.description === 'string' && typeof product.price === 'number') {
           const parsedMaterial = typeof product.material === 'string' ? product.material : undefined;
           const parsedDimensions = typeof product.dimensions === 'string' ? product.dimensions : undefined;
           const parsedFeatures = Array.isArray(product.features) && product.features.every(f => typeof f === 'string') 
               ? product.features 
               : undefined;

          return {
            title: product.title,
            description: product.description,
            price: product.price,
            id: `product-${Date.now()}-${index}`,
            image: base64Image,
            material: parsedMaterial,
            dimensions: parsedDimensions,
            features: parsedFeatures,
          };
        }
        return null; // Mark invalid objects for removal.
      })
      .filter((product): product is ProductData => product !== null); // Filter out nulls and satisfy TypeScript.
};

/**
 * Edits an image using a text prompt with the Gemini Flash Image model.
 * @param base64Image The original base64 encoded image data URL.
 * @param prompt The user's text instruction for the edit.
 * @returns A promise that resolves to the new base64 encoded image data URL.
 */
export const editImageWithPrompt = async (base64Image: string, prompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';

    const imageData = base64Image.split(',')[1];
    if (!imageData) {
      throw new Error("Invalid base64 image format.");
    }
    
    const mimeType = base64Image.match(/data:(.*);base64,/)?.[1] || 'image/jpeg';

    const imagePart = {
      inlineData: { data: imageData, mimeType },
    };

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the generated image data from the response.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const newBase64Data = part.inlineData.data;
            const newMimeType = part.inlineData.mimeType;
            return `data:${newMimeType};base64,${newBase64Data}`;
        }
    }

    throw new Error("AI did not return an image. Please try a different prompt.");
};

/**
 * Creates and initializes a new chat session with the Gemini API.
 * @returns A Chat session object.
 */
export const createChatSession = (): Chat => {
  const model = 'gemini-2.5-flash';
  const systemInstruction = `You are a proactive and insightful AI assistant for small business owners using this e-commerce storefront generator. Your primary goal is to empower them with actionable advice through engaging, two-way conversations.

When a user asks a question, follow this two-step process:
1.  **Answer Clearly:** Provide a direct and helpful answer to their immediate question.
2.  **Engage with a Tip and a Question:** After answering, offer a relevant, unsolicited tip. **Crucially, end your response by asking a follow-up question** to encourage conversation and gauge their interest. This makes the interaction feel like a real dialogue, not just a Q&A session.

**Example Interaction:**
-   **User:** "How long should my product description be?"
-   **Your Response:** "A good rule of thumb is 2-3 short paragraphs. That's usually enough to cover the key features and benefits without overwhelming the customer. Speaking of descriptions, a great tip is to include 1-2 relevant keywords to help with search engine visibility. **Is SEO something you'd like to explore more?**"

Your areas of expertise include:
- E-commerce best practices: SEO, product photography, writing compelling descriptions.
- Marketing: Social media strategies, email marketing basics.
- Customer Service: Handling customer queries, building loyalty.
- Operations: Simple inventory management tips.
- Using this tool: Explaining how the AI generator works.

Keep your tone friendly, encouraging, and easy to understand. Always aim to turn a simple answer into a helpful, ongoing conversation.`;
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction,
    },
  });
  return chat;
};