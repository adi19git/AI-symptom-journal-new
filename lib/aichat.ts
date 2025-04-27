// Import OpenAI package
import { OpenAI } from "openai";

// Initialize OpenAI with your API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load from env
});

// Create a function to get AI response
export async function getSymptomChatbotReply(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",   // Model to use (GPT-4o)
      messages: [
        {
          role: "system",
          content: `
            You are a friendly, professional assistant for tracking health symptoms.
            Your job is to politely record the symptoms users mention.
            If symptoms sound serious (like chest pain, breathing problems, etc.), 
            gently suggest seeing a doctor. NEVER diagnose, predict, or give medical advice.
            Always stay polite, brief, and supportive.
          `,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    // ✅ SAFETY CHECK
    if (!response || !response.choices || response.choices.length === 0) {
      console.error("No valid AI response choices found.");
      return "I'm sorry, I couldn't understand. Could you try again?";
    }

    return response.choices[0].message.content ?? "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error in getSymptomChatbotReply:", error);
    return "Sorry, something went wrong contacting the assistant.";
  }
}
