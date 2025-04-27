const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
                  You are a polite, professional health assistant.
                  - Record the symptoms users mention.
                  - Never diagnose or predict illness.
                  - Be supportive and brief.
                  - If the user mentions serious symptoms like chest pain, difficulty breathing, etc., suggest politely that they consult a doctor.
                  User symptoms: ${userMessage}
                `,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Gemini raw response:", data);

    if (data.error) {
      console.error("Gemini API error:", data.error);
      return "Sorry, the assistant couldn't be reached. Please try again later.";
    }

    // Safe check for candidates
    const firstCandidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!firstCandidate) {
      console.error("No valid AI reply received:", data);
      return "I'm sorry, I had trouble understanding your symptoms. Please try again later.";
    }

    // Return the actual Gemini reply
    return firstCandidate.trim();
  } catch (error) {
    console.error("Error in getSymptomChatbotReply:", error);
    return "Sorry, something went wrong while contacting the assistant.";
  }
}
