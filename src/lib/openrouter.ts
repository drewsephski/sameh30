// OpenRouter client configuration
import { createOpenAI } from '@ai-sdk/openai';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('Missing OPENROUTER_API_KEY environment variable');
}

export const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Available models
export const OPENROUTER_MODELS = [
  { id: 'minimax/minimax-m2:free', name: 'MiniMax M2 (Free)' },
  { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B (Free)' },
  { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B (Free)' },
  { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air (Free)' },
  { id: process.env.OPENROUTER_MODEL, name: 'Default Model' },
].filter(Boolean) as Array<{ id: string; name: string }>;