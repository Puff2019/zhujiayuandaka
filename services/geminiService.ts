import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDailyEnglishSentence = async (): Promise<{ sentence: string; translation: string }> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate a simple, inspiring, or useful English sentence for a primary school student to practice speaking. Include the Chinese translation. Return ONLY JSON.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentence: { type: Type.STRING },
            translation: { type: Type.STRING },
          },
          required: ["sentence", "translation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails or key is missing
    return {
      sentence: "Practice makes perfect.",
      translation: "熟能生巧。"
    };
  }
};
