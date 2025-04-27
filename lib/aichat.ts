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
                text: `
You are an AI health assistant. 

Your tasks:
- Analyze the symptoms described by the user.
- Suggest 2–3 possible common causes based on general knowledge.
- Recommend 2–3 helpful and safe actions the user can try (e.g., rest, hydration, monitoring).
- Politely encourage the user to seek medical advice if symptoms are severe, serious, or persistent.
- Never diagnose or predict specific diseases.

Always be polite, brief, supportive, and clear.

User's symptom description: "${userMessage}"
                `.trim(),
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("Gemini raw response:", data);

    if (data.error) {
      console.error("Gemini API error:", JSON.stringify(data.error, null, 2));
      return "Sorry, the assistant couldn't be reached.";
    }

    if (!Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error("No valid AI reply candidates:", data);
      return "I'm sorry, I had trouble analyzing your symptoms. Please try again.";
    }

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
