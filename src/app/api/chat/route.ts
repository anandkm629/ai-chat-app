import { groq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response(
        "Unauthorized",
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const { message, chatId } = body;

    // Save user message
    await prisma.message.create({
      data: {
        content: message,
        role: "user",
        chatId,
      },
    });

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant.",
          },
          {
            role: "user",
            content: message,
          },
        ],

        model: "llama-3.1-8b-instant",

        stream: true,
      });

    const encoder = new TextEncoder();

    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content =
            chunk.choices[0]?.delta
              ?.content || "";

          fullResponse += content;

          controller.enqueue(
            encoder.encode(content)
          );
        }

        // Save AI response
        await prisma.message.create({
          data: {
            content: fullResponse,
            role: "assistant",
            chatId,
          },
        });

        controller.close();
      },
    });

    return new Response(stream);
  } catch (error) {
    console.log(error);

    return new Response(
      "Something went wrong",
      {
        status: 500,
      }
    );
  }
}