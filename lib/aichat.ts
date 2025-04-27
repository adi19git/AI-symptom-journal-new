import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,  // Add this line
});

export async function getSymptomChatbotReply(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a friendly assistant...",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

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
