// app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    /**
     * Prompt engineering techniques:
     * - System instructions: Set the behavior of the assistant (e.g., "You are a helpful coding assistant. Keep responses under 3 sentences and focus on practical examples.")
     * - Few-shot examples: Provide example interactions to guide the model's responses.
     */
    const result = streamText({
      model: openai("gpt-5"),
      messages: [
        // System instructions to set the behavior of the assistant
        {
          role: "system",
          content:
            "You are a helpful coding assistant. Keep responses under 3 sentences and focus on practical examples.",
        },
        
        // Few-shot examples to guide the model's responses
        // {
        //   role: "system",
        //   content: 'Convert user questions about React into code examples.',
        // },
        // {
        //   role: "user",
        //   content: 'How to toggle a boolean?',
        // },
        // {
        //   role: "assistant",
        //   content: 'const [isOn, setIsOn] = useState(false); \n const toggle = () => setIsOn(!isOn);',
        // },
        ...convertToModelMessages(messages),
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
