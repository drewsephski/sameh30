// Unified LLM Provider Service - Supports both OpenRouter and Gemini
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { google } from '@ai-sdk/google';
import { OPENROUTER_MODELS } from './openrouter';
import { GEMINI_MODELS, isGeminiModelFree } from './gemini';

export type ProviderType = 'openrouter' | 'gemini';

export interface UnifiedModel {
  id: string;
  name: string;
  provider: ProviderType;
  priority: number;
  reliability: 'high' | 'medium' | 'low';
  rateLimitResistant: boolean;
  free: boolean;
}

// Environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;

// Combined list of all available models with priority assignments
export const ALL_AVAILABLE_MODELS: UnifiedModel[] = [
  // OpenRouter models - assign priorities
  ...OPENROUTER_MODELS.map((model, index) => ({
    id: model.id,
    name: model.name,
    provider: 'openrouter' as ProviderType,
    priority: index + 1,
    reliability: 'high' as const,
    rateLimitResistant: index === 3, // GLM-4.5 Air is rate limit resistant
    free: true
  })),
  // Gemini models - assign priorities after OpenRouter
  ...GEMINI_MODELS.map((model, index) => ({
    ...model,
    provider: 'gemini' as ProviderType,
    priority: OPENROUTER_MODELS.length + index + 1,
  })),
].sort((a, b) => a.priority - b.priority);

// Helper function to determine provider from model ID
export const getProviderForModel = (modelId: string): ProviderType => {
  if (modelId.startsWith('gemini-')) {
    return 'gemini';
  }
  return 'openrouter';
};

// Get model instance based on model ID
export const getModelInstance = (modelId: string) => {
  const provider = getProviderForModel(modelId);
  
  if (provider === 'gemini') {
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY environment variable is required for Gemini models');
    }
    return google(modelId);
  // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY environment variable is required for OpenRouter models');
    }
    const openrouter = createOpenRouter({
      apiKey: OPENROUTER_API_KEY,
    });
    return openrouter.chat(modelId);
  }
};

// Simple fallback model selection
export const getNextAvailableUnifiedModel = (
  currentModelId?: string,
  originalProvider?: ProviderType
): string => {
  const currentProvider = currentModelId ? getProviderForModel(currentModelId) : originalProvider;
  const healthyModels = ALL_AVAILABLE_MODELS.filter(model => {
    // For now, we'll consider all models as healthy
    // In a real implementation, you'd track health per model
    return true;
  });
  
  if (currentModelId) {
    const currentIndex = healthyModels.findIndex(m => m.id === currentModelId);
    if (currentIndex >= 0 && currentIndex < healthyModels.length - 1) {
      return healthyModels[currentIndex + 1].id;
    }
  }
  
  // Return first healthy model (highest priority)
  return healthyModels[0]?.id || 'gemini-1.5-flash';
};

// Record model usage statistics (simplified for now)
export const recordUnifiedModelUsage = (
  modelId: string,
  success: boolean,
  isRateLimit = false
): void => {
  // For now, just log usage
  // In a real implementation, you'd track this per model
  console.log(`Model ${modelId}: ${success ? 'success' : 'failure'}${isRateLimit ? ' (rate limit)' : ''}`);
};

// Get all healthy models across both providers
export const getAllHealthyModels = (): UnifiedModel[] => {
  // For now, return all models as healthy
  // In a real implementation, you'd filter based on health metrics
  return ALL_AVAILABLE_MODELS;
};

// Check if model is free
export const isModelFree = (modelId: string): boolean => {
  const provider = getProviderForModel(modelId);
  
  if (provider === 'gemini') {
    return isGeminiModelFree(modelId);
  }
  
  // Most OpenRouter models in our list are free
  return true;
};

// Get models by provider type
export const getModelsByProvider = (provider: ProviderType): UnifiedModel[] => {
  return ALL_AVAILABLE_MODELS.filter(model => model.provider === provider);
};

// Get only free models from both providers
export const getAllFreeModels = (): UnifiedModel[] => {
  return ALL_AVAILABLE_MODELS.filter(model => model.free);
};

// Validate provider configuration
export const validateProviderConfig = (): { openrouter: boolean; gemini: boolean } => {
  return {
    openrouter: !!OPENROUTER_API_KEY,
    gemini: !!GOOGLE_API_KEY,
  };
};

// Get model status for debugging
export const getUnifiedModelStatus = () => {
  const providerStatus = validateProviderConfig();
  
  return {
    providers: providerStatus,
    models: ALL_AVAILABLE_MODELS.map(model => ({
      id: model.id,
      name: model.name,
      provider: model.provider,
      free: model.free,
      priority: model.priority,
      reliability: model.reliability,
      rateLimitResistant: model.rateLimitResistant,
    }))
  };
};