
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.NEXT_GEMINI_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!GEMINI_API_KEY) {
    console.error("❌ NEXT_GEMINI_API_KEY is missing in .env.local");
    return NextResponse.json(
      { reply: "Server error: API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Gemini Response:", data);

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    return NextResponse.json(
      { reply: "Something went wrong contacting the assistant." },
      { status: 500 }
    );
  }
}
