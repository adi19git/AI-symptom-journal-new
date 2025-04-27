const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

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
                text: `You are a helpful, polite health assistant. Record symptoms without diagnosing.

User: ${userMessage}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("Gemini raw response:", data);

    // Safely check for error first
    if (data.error) {
      console.error("Gemini API error:", JSON.stringify(data.error, null, 2));
      return "Sorry, the assistant couldn't be reached.";
    }

    // Safely check for candidates array existence
    if (!Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error("No valid AI reply candidates:", data);
      return "I'm sorry, I had trouble analyzing your symptoms. Please try again.";
    }

    // Safely check content and parts
    const aiReply = data.candidates[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      console.error("AI reply missing:", data);
      return "I'm sorry, I couldn't generate a response.";
    }

    return aiReply.trim();
  } catch (error) {
    console.error("Error in getSymptomChatbotReply:", error);
    return "Sorry, something went wrong contacting the assistant.";
  }
}
