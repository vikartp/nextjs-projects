import { streamText } from "ai";
import { openai } from "@/lib/openai";
// import { anthropic } from "@/lib/anthropic";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = streamText({
      // model: openai("gpt-4o-mini"), // openrouter openai model
      // model: anthropic("claude-3-haiku"), // openrouter anthropic model
      model: openai("o4-mini"), // kognitwin openai model
      prompt,
    });

    // Log token usage after streaming completes
    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text:", error);
    return new Response("Failed to stream text", { status: 500 });
  }
}
