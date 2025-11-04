// OpenRouter client configuration using Context7 @ai-sdk/openai approach
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('Missing OPENROUTER_API_KEY environment variable');
}

// Create OpenRouter provider instance
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Available models
export const OPENROUTER_MODELS = [
  { id: 'minimax/minimax-m2:free', name: 'MiniMax M2 (Free)' },
  { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B (Free)' },
  { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B (Free)' },
  { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air (Free)' },
  { id: process.env.OPENROUTER_MODEL, name: 'Default Model' },
].filter(Boolean) as Array<{ id: string; name: string }>;

// Helper function to get chat model
export const getChatModel = (modelId: string = 'minimax/minimax-m2:free') => {
  return openrouter.chat(modelId);
};

// Helper function to get completion model
export const getCompletionModel = (modelId: string = 'minimax/minimax-m2:free') => {
  return openrouter.completion(modelId);
};