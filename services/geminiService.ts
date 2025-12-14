
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

// export const analyzeGrowthData = async (data: GrowthData[], language: Language): Promise<string> => {
//     try {
//         const client = getAiClient();
//         const langPrompt = language === 'mm' ? 'Burmese language (Myanmar)' : 'English language';
//         const dataStr = data.map(d => `Month: ${d.month}, Height: ${d.height}cm, Weight: ${d.weight}kg`).join('\n');
        
//         const prompt = `
//           Act as a friendly pediatrician assistant. Analyze this growth data for a child:
//           ${dataStr}
          
//           Provide a very short, encouraging summary (max 2-3 sentences) in ${langPrompt} for the parent. 
//           Focus on the steady progress. Do not give medical advice, just general encouragement about their growth trend.
//         `;

//         const response = await client.models.generateContent({
//             model: 'gemini-2.5-flash',
//             contents: prompt,
//             config: {
//                 temperature: 0.5,
//             }
//         });

//         return response.text || (language === 'mm' ? "အချက်အလက်များကို ဆန်းစစ်မရနိုင်ပါ။" : "Could not analyze data.");
//     } catch (error) {
//         console.error("Error analyzing growth:", error);
//         return language === 'mm' 
//             ? "ကွန်ဟက်ချိတ်ဆက်မှု အခက်အခဲရှိနေပါသည်။" 
//             : "Connection error. Please try again.";
//     }
// }

export const analyzeGrowthData = async (
    data: GrowthData[],
    language: Language,
    childAgeMonths: number,
    childGender: 'male' | 'female'
): Promise<string> => {
    try {
        const client = getAiClient();
        const langPrompt = language === 'mm' ? 'Burmese language (Myanmar)' : 'English language';
        const dataStr = data.map(d => `Month: ${d.month}, Height: ${d.height}cm, Weight: ${d.weight}kg`).join('\n');
        
        // နှိုင်းယှဉ်ချက်အတွက် နောက်ခံအကြောင်းအရာ (Context)
        const genderText = childGender === 'male' ? 'boy' : 'girl';

        // Prompt ကို HK Growth Study ဖြင့် တိုက်ရိုက် အစားထိုး ညွှန်ကြားခြင်း
        const growthStandardPrompt = `
            The analysis must be done by comparing the child's data against **Hong Kong Growth Study (HK2020) standards** for Asian children. 
            
            Focus on assessing the trend compared to the expected growth curve for a Hong Kong / Asian ${genderText} child of ${childAgeMonths} months. 
            
            Key analysis points: 
            1. Is the Height and Weight gain consistent over the months according to HK2020 charts? 
            2. Does the child's overall growth trajectory look stable and typical based on these recognized local Asian standards?
            
            Strictly do not give specific medical advice.
        `;

        const prompt = `
            Act as a friendly pediatrician assistant. Analyze the child's growth data:
            
            --- CHILD DATA ---
            Age: ${childAgeMonths} months, Gender: ${childGender}
            Growth History:
            ${dataStr}
            --- END OF DATA ---

            ${growthStandardPrompt}
            
            Provide a very short, encouraging summary (max 2-3 sentences) in ${langPrompt} for the parent. 
            Highlight the stability of the growth and provide a mild, positive comparison to the expected HK2020 growth trend. 
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("AI Growth Analysis Error:", error);
        return language === 'mm' 
            ? "ခွဲခြမ်းစိတ်ဖြာမှုတွင် အမှားဖြစ်ပွားပါသည်။ ကျေးဇူးပြု၍ ခဏကြာမှ ပြန်လည်ကြိုးစားပါ။"
            : "An error occurred during analysis. Please try again later.";
    }
};

export const generateGuidance = async (
    data: GrowthData[],
    language: Language,
    childAgeMonths: number,
    childGender: 'male' | 'female',
    analysisSummary: string // ယခင် AI ခေါ်ဆိုမှုမှ ရရှိသော အနှစ်ချုပ် (Title + Summary Sentence)
): Promise<string> => {
    try {
        const client = getAiClient();
        const langPrompt = language === 'mm' ? 'Burmese language (Myanmar)' : 'English language';
        const dataStr = data.map(d => `Month: ${d.month}, Height: ${d.height}cm, Weight: ${d.weight}kg`).join('\n');
        
        const prompt = `
            Act as a supportive, non-medical health assistant. Based on the following growth data and analysis:
            
            --- CHILD DATA ---
            Age: ${childAgeMonths} months, Gender: ${childGender}
            Growth History:
            ${dataStr}
            --- END OF DATA ---

            Previous Growth Analysis Summary: ${analysisSummary}

            Provide a very short, actionable list of **"Next Steps" or "Recommendations"** for the parent in ${langPrompt}. 
            The recommendations MUST be non-medical, focusing ONLY on healthy lifestyle habits, documentation, and when to seek professional medical advice.
            
            Output Format: A numbered list (1., 2., 3., ...) of no more than 3 to 4 points. 
            Do not include any title or introductory text.
        `;

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("AI Guidance Generation Error:", error);
        return language === 'mm' 
            ? "နောက်ထပ်လုပ်ဆောင်ရန် လမ်းညွှန်ချက်များကို ထုတ်လုပ်ရာတွင် အမှားဖြစ်ပွားပါသည်။"
            : "An error occurred while generating guidance.";
    }
};
