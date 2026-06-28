import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Using Groq's server with your key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", 
});

const SYSTEM_PROMPT = `
You are a helpful, all-purpose Customer Support AI for "SmartStore Electronics". 
GENERAL KNOWLEDGE:
- You can answer ANY general questions the user has.
COMPANY SPECIFIC INFO:
- Shipping: 2-4 business days.
- Returns: 14 days.
- Contact: support@smartstore.com.
INSTRUCTIONS:
- Use general knowledge for general questions and company info for store questions.
- If a user is angry, tell them to click the "Talk to Human" button.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile", // This model is free and fast on Groq
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7, 
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: "AI failed to respond." }, { status: 500 });
  }
}