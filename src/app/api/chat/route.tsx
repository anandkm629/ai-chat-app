import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content =
            chunk.choices[0]?.delta?.content || "";

          controller.enqueue(
            encoder.encode(content)
          );
        }

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