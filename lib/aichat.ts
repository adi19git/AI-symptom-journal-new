

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=AIzaSyASY8F69YNua0HXO08zsZg-7S9UIXm13SE
`;

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
                text: `You are a friendly health assistant. Record the user's symptoms politely without diagnosing.\n\nUser: ${userMessage}`,
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
      return "Sorry, the assistant couldn't be reached.";
    }

    if (!data.candidates || data.candidates.length === 0) {
      console.error("No valid candidates from Gemini API:", data);
      return "I'm sorry, I couldn't understand. Could you try again?";
    }

    return data.candidates[0].content.parts[0].text ?? "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error in getSymptomChatbotReply:", error);
    return "Sorry, something went wrong.";
  }
}
