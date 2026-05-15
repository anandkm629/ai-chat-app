import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: body.message,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}