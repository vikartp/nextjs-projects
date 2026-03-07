import { streamText, UIMessage, convertToModelMessages } from "ai";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-5"),
      messages: convertToModelMessages(messages),
      providerOptions: {
        openai: {
          reasoningEffort: "low",
          reasoningSummary: "auto",
        },
      },
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
