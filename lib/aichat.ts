import { NextResponse } from "next/server";

const NEXT_GEMINI_API_KEY = process.env.NEXT_GEMINI_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${NEXT_GEMINI_API_KEY}`;

export async function POST(req: Request) {
  const { message } = await req.json();

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

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { reply: "Error contacting the assistant." },
      { status: 500 }
    );
  }
}




