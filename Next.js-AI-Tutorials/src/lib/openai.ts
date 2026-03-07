import { createOpenAI } from "@ai-sdk/openai";

const provider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// Default to Chat Completions API (/chat/completions) instead of Responses API (/responses)
// since the proxy endpoint does not support the Responses API.
export const openai = Object.assign(
  (modelId: Parameters<typeof provider.chat>[0]) => provider.chat(modelId),
  provider
);
