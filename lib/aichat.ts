// Import OpenAI package
import { OpenAI } from "openai";

// Initialize OpenAI with your API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Very important: NEVER hardcode key
});

// Create a function to get AI response
export async function getSymptomChatbotReply(userMessage: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",   // Model to use (GPT-4o = fastest and best)
    messages: [
      {
        role: "system", // System message tells AI how to behave
        content: `
          You are a friendly, professional assistant for tracking health symptoms.
          Your job is to politely record the symptoms users mention.
          If symptoms sound serious (like chest pain, breathing problems, etc.), 
          gently suggest seeing a doctor. NEVER diagnose, predict, or give medical advice.
          Always stay polite, brief, and supportive.
        `,
      },
      {
        role: "user",  // The user's actual message
        content: userMessage,
      },
    ],
  });

  // Return only the AI's message text
  return response.choices[0].message.content;
}
