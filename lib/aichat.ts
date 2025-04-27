const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Make sure you set this in .env or Vercel

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export async function getSymptomChatbotReply(userMessage: string): Promise<string> {
  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a friendly, professional assistant for tracking health symptoms. Your job is to politely record the symptoms users mention. Never diagnose or predict. Always stay supportive.\n\nUser: ${userMessage}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data || !data.candidates || data.candidates.length === 0) {
      console.error("No valid AI response candidates found.");
      return "I'm sorry, I couldn't understand. Could you try again?";
    }

    return data.candidates[0].content.parts[0].text ?? "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error in getSymptomChatbotReply:", error);
    return "Sorry, something went wrong contacting the assistant.";
  }
}
