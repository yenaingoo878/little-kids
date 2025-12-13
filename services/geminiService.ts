
import { GoogleGenAI } from "@google/genai";
import { Language, GrowthData } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!ai) {
        // Initialize strictly with process.env.API_KEY
        // The value is injected by Vite at build time
        const apiKey = process.env.API_KEY || '';
        if (!apiKey) {
            console.warn("Gemini API Key is missing. AI features will not work.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

// generateBedtimeStoryStream function အတွက် ပြင်ဆင်ချက်
export const generateBedtimeStoryStream = async (topic: string, childName: string, language: Language) => {
  try {
    const client = getAiClient();
    const langPrompt = language === 'mm' ? 'Burmese language (Myanmar)' : 'English language';
    
    // 1. စည်းမျဉ်းများကို System Instruction အဖြစ် သတ်မှတ်ခြင်း (ပိုမိုတိကျစေရန်)
    const systemInstruction = `
      You are a warm, gentle, and creative children's storyteller.
      Your task is to write a short, heartwarming bedtime story.
      The story must be written in the specified language and addressed to the child.
      Strictly limit the story length to 150-200 words.
      The output must ONLY contain the plain story text, with no title, no introduction, no conclusion outside the story, and absolutely no markdown (no bold, no asterisks, no hashtags).
    `;
    
    // 2. ပုံပြင်ရဲ့ အကြောင်းအရာကိုသာ Prompt အဖြစ် ထားရှိခြင်း
    const userPrompt = `
      Create a bedtime story for a child named "${childName}" about the topic: "${topic}". 
      Write the story in ${langPrompt}.
    `;

    // 3. generateContentStream ကို config တွင် systemInstruction ထည့်သွင်း၍ ခေါ်ဆိုခြင်း
    const response = await client.models.generateContentStream({
      model: 'gemini-2.5-flash', // Model ကို ဆက်လက်အသုံးပြုမည်
      contents: userPrompt,
      config: {
        temperature: 0.7,
        systemInstruction: systemInstruction, // System Instruction အသစ်ကို ထည့်သွင်းခြင်း
      }
    });

    return response;
  } catch (error) {
    console.error('Error generating story stream:', error);
    throw new Error('Failed to generate bedtime story.');
  }
};

export const analyzeGrowthData = async (data: GrowthData[], language: Language): Promise<string> => {
    try {
        const client = getAiClient();
        const langPrompt = language === 'mm' ? 'Burmese language (Myanmar)' : 'English language';
        const dataStr = data.map(d => `Month: ${d.month}, Height: ${d.height}cm, Weight: ${d.weight}kg`).join('\n');
        
        const prompt = `
          Act as a friendly pediatrician assistant. Analyze this growth data for a child:
          ${dataStr}
          
          Provide a very short, encouraging summary (max 2-3 sentences) in ${langPrompt} for the parent. 
          Focus on the steady progress. Do not give medical advice, just general encouragement about their growth trend.
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            }
        });

        return response.text || (language === 'mm' ? "အချက်အလက်များကို ဆန်းစစ်မရနိုင်ပါ။" : "Could not analyze data.");
    } catch (error) {
        console.error("Error analyzing growth:", error);
        return language === 'mm' 
            ? "ကွန်ဟက်ချိတ်ဆက်မှု အခက်အခဲရှိနေပါသည်။" 
            : "Connection error. Please try again.";
    }
}
