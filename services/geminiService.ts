
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGeminiFeedback = async (word: string, isCorrect: boolean): Promise<string> => {
  try {
    const prompt = isCorrect 
      ? `Give a very short (1 sentence), enthusiastic, and kid-friendly fun fact or encouraging comment about the word "${word}" in Portuguese. Make it playful!`
      : `The child tried to say "${word}" in Portuguese but missed. Give a very short, kind, and encouraging tip or a silly joke about why that word is tricky. Be super friendly for a 6-year-old.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are 'Bico', a friendly talking parrot that helps kids learn Portuguese. You are cheerful, funny, and use lots of emojis. Keep responses under 20 words.",
        temperature: 0.9,
      }
    });

    return response.text || (isCorrect ? "¡Increíble! ¡Lo lograste! 🌟" : "¡Casi! ¡Tú puedes! 🦜");
  } catch (error) {
    console.error("Gemini Error:", error);
    return isCorrect ? "¡Muy bien! 🥳" : "¡Inténtalo de nuevo amiguito! 💪";
  }
};
