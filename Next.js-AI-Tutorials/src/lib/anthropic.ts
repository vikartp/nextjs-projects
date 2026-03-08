import { createAnthropic } from "@ai-sdk/anthropic"

const anthropicProvider = createAnthropic({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

export const anthropic = Object.assign(
  (modelId: Parameters<typeof anthropicProvider.chat>[0]) =>
    anthropicProvider.chat(modelId),
  anthropicProvider
)