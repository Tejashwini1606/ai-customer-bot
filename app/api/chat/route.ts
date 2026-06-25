import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// This is the NEW combined prompt that handles EVERYTHING
const SYSTEM_PROMPT = `
You are a helpful, all-purpose Customer Support AI for "SmartStore Electronics". 

GENERAL KNOWLEDGE:
- You can answer ANY general questions the user has (e.g., "What is the capital of France?", "Write a poem", "Help with math").

COMPANY SPECIFIC INFO (SmartStore):
- Shipping: We deliver within 2-4 business days. Shipping is free for orders over $50.
- Returns: Customers can return items within 14 days of delivery.
- Contact: Email us at support@smartstore.com or call 1-800-SMART.
- Services: We sell smartphones, laptops, and smart home devices.

INSTRUCTIONS:
- If a user asks about our company, use the info above.
- If they ask anything else, use your general knowledge to help them.
- If a user is angry or wants to file a complaint, tell them to click the "Talk to Human" button.
- Always remain polite and professional.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7, 
    });

    const aiMessage = response.choices[0].message.content;

    return NextResponse.json({ content: aiMessage });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { error: "AI logic failed. Did you add your API Key to .env.local?" },
      { status: 500 }
    );
  }
}