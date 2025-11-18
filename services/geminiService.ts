
import { GoogleGenAI } from "@google/genai";

const getGeminiResponse = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return "I'm sorry, but I'm unable to connect to my services right now. Please check the configuration.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are Sophea, a friendly and helpful AI study companion for a student organization app called EduAI. Your goal is to be encouraging, provide useful advice, and help students stay organized and motivated. Keep your responses concise, friendly, and helpful. Use emojis to make your tone more engaging. Here is the user's prompt: "${prompt}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Oops! I seem to have encountered a problem. Please try again in a moment.";
  }
};

export { getGeminiResponse };
