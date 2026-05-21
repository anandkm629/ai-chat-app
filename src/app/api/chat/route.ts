import { groq } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { message, chatId, imageUrl } = body;

    // Save current user message
    await prisma.message.create({
      data: {
        content: message,
        role: "user",
        imageUrl,
        chatId,
      },
    });

    // Fetch previous messages
    const previousMessages = await prisma.message.findMany({
      where: {
        chatId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    // Format messages for Groq
    const formattedMessages = previousMessages.map((msg) => ({
      role: msg.role as "user" | "assistant",

      content: msg.content,
    }));

    // AI completion
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",

      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that can analyze images.",
        },

        {
          role: "user",

          content: imageUrl
            ? [
                {
                  type: "text",
                  text: message || "Analyze this image",
                },

                {
                  type: "image_url",

                  image_url: {
                    url: imageUrl,
                  },
                },
              ]
            : message,
        },
      ],

      stream: true,
    });

    const encoder = new TextEncoder();

    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";

          fullResponse += content;

          controller.enqueue(encoder.encode(content));
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

    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
