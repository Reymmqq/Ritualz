import { GoogleGenAI, Type } from "@google/genai";
import { AISuggestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getHabitSuggestions = async (goal: string): Promise<AISuggestion[]> => {
  if (!apiKey) {
    console.warn("API Key missing for Gemini");
    return [
      { habitName: "Drink Water", description: "Stay hydrated", reason: "General health" },
      { habitName: "Walk 10k steps", description: "Daily movement", reason: "Cardio health" }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `I want to achieve this goal: "${goal}". Suggest 3 daily habits I can track to achieve this.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              habitName: { type: Type.STRING },
              description: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["habitName", "description", "reason"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AISuggestion[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const getMotivationalQuote = async (): Promise<string> => {
  if (!apiKey) return "Consistency is the key to success.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Give me a very short, punchy motivational quote for habit building (max 10 words).",
    });
    return response.text || "Keep going!";
  } catch (error) {
    return "Every day counts.";
  }
};
