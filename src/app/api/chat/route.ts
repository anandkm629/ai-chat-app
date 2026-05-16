import { groq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    

    // SAVE USER MESSAGE
    await prisma.message.create({
      data: {
        chatId: body.chatId,
        role: "user",
        content: body.message,
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
            content: body.message,
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

        // SAVE AI RESPONSE
        await prisma.message.create({
          data: {
            chatId: body.chatId,
            role: "assistant",
            content: fullResponse,
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