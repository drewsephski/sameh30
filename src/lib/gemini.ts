// Gemini AI SDK provider configuration with intelligent fallback and health monitoring
import { google } from '@ai-sdk/google';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

// Google provider configuration
export const googleConfig = {
  apiKey: process.env.GEMINI_API_KEY,
};

// Model tier classification
export type ModelTier = 'pro' | 'flash' | 'flash-lite';
export type ModelGeneration = '2.5' | '2.0' | '1.5';
export type ModelReliability = 'high' | 'medium' | 'low';

interface GeminiModelConfig {
  id: string;
  name: string;
  tier: ModelTier;
  generation: ModelGeneration;
  priority: number;
  reliability: ModelReliability;
  rateLimitResistant: boolean;
  hasFreeQuota: boolean;
  contextWindow: number; // in tokens
  maxOutputTokens: number;
  supportsThinking: boolean;
  supportsCodeExecution: boolean;
  supportsFunctionCalling: boolean;
  supportsGrounding: boolean;
  deprecated?: boolean;
}

// Current Gemini models ordered by priority (best first)
export const GEMINI_MODELS: GeminiModelConfig[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tier: 'flash',
    generation: '2.5',
    priority: 1,
    reliability: 'high',
    rateLimitResistant: true,
    hasFreeQuota: true,
    contextWindow: 1_048_576,
    maxOutputTokens: 65_536,
    supportsThinking: true,
    supportsCodeExecution: true,
    supportsFunctionCalling: true,
    supportsGrounding: true,
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite',
    tier: 'flash-lite',
    generation: '2.5',
    priority: 2,
    reliability: 'high',
    rateLimitResistant: true,
    hasFreeQuota: true,
    contextWindow: 1_048_576,
    maxOutputTokens: 65_536,
    supportsThinking: true,
    supportsCodeExecution: true,
    supportsFunctionCalling: true,
    supportsGrounding: true,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    tier: 'flash',
    generation: '2.0',
    priority: 3,
    reliability: 'high',
    rateLimitResistant: true,
    hasFreeQuota: true,
    contextWindow: 1_048_576,
    maxOutputTokens: 8_192,
    supportsThinking: false, // experimental only
    supportsCodeExecution: true,
    supportsFunctionCalling: true,
    supportsGrounding: true,
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    tier: 'flash-lite',
    generation: '2.0',
    priority: 4,
    reliability: 'high',
    rateLimitResistant: true,
    hasFreeQuota: true,
    contextWindow: 1_048_576,
    maxOutputTokens: 8_192,
    supportsThinking: false,
    supportsCodeExecution: false,
    supportsFunctionCalling: true,
    supportsGrounding: false,
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    tier: 'pro',
    generation: '2.5',
    priority: 5,
    reliability: 'high',
    rateLimitResistant: false,
    hasFreeQuota: true,
    contextWindow: 1_048_576,
    maxOutputTokens: 65_536,
    supportsThinking: true,
    supportsCodeExecution: true,
    supportsFunctionCalling: true,
    supportsGrounding: true,
  },
];

// Model usage tracking with enhanced metrics
interface ModelUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastUsed: Date;
  rateLimitFailures: number;
  consecutiveFailures: number;
  averageResponseTime: number;
  isHealthy: boolean;
  cooldownUntil?: Date;
}

const modelStats: Record<string, ModelUsageStats> = {};

// Initialize model stats
for (const model of GEMINI_MODELS) {
  modelStats[model.id] = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    lastUsed: new Date(),
    rateLimitFailures: 0,
    consecutiveFailures: 0,
    averageResponseTime: 0,
    isHealthy: true,
  };
}

// Configuration for health checks
const HEALTH_CHECK_CONFIG = {
  MAX_CONSECUTIVE_FAILURES: 3,
  FAILURE_RATE_THRESHOLD: 0.6,
  MIN_REQUESTS_FOR_RATE_CHECK: 5,
  COOLDOWN_BASE_MS: 60_000, // 1 minute
  COOLDOWN_MAX_MS: 600_000, // 10 minutes
};

// Calculate exponential backoff cooldown
const calculateCooldown = (consecutiveFailures: number): number => {
  const cooldown = Math.min(
    HEALTH_CHECK_CONFIG.COOLDOWN_BASE_MS * (2 ** (consecutiveFailures - 1)),
    HEALTH_CHECK_CONFIG.COOLDOWN_MAX_MS
  );
  return cooldown;
};

// Check if model is in cooldown period
const isInCooldown = (stats: ModelUsageStats): boolean => {
  if (!stats.cooldownUntil) return false;
  return new Date() < stats.cooldownUntil;
};

// Get healthy models with advanced filtering
export const getHealthyGeminiModels = (
  filterOptions?: {
    tier?: ModelTier;
    generation?: ModelGeneration;
    minContextWindow?: number;
    requiresThinking?: boolean;
    requiresCodeExecution?: boolean;
  }
): GeminiModelConfig[] => {
  return GEMINI_MODELS.filter(model => {
    // Skip deprecated models
    if (model.deprecated) return false;

    const stats = modelStats[model.id];
    
    // Skip unhealthy models
    if (!stats.isHealthy) return false;
    
    // Skip models in cooldown
    if (isInCooldown(stats)) return false;
    
    // Check failure rate for models with sufficient history
    if (stats.totalRequests >= HEALTH_CHECK_CONFIG.MIN_REQUESTS_FOR_RATE_CHECK) {
      const failureRate = stats.failedRequests / stats.totalRequests;
      if (failureRate > HEALTH_CHECK_CONFIG.FAILURE_RATE_THRESHOLD) return false;
    }
    
    // Check consecutive failures
    if (stats.consecutiveFailures >= HEALTH_CHECK_CONFIG.MAX_CONSECUTIVE_FAILURES) {
      return false;
    }

    // Apply filters
    if (filterOptions) {
      if (filterOptions.tier && model.tier !== filterOptions.tier) return false;
      if (filterOptions.generation && model.generation !== filterOptions.generation) return false;
      if (filterOptions.minContextWindow && model.contextWindow < filterOptions.minContextWindow) return false;
      if (filterOptions.requiresThinking && !model.supportsThinking) return false;
      if (filterOptions.requiresCodeExecution && !model.supportsCodeExecution) return false;
    }
    
    return true;
  });
};

// Get next available model with intelligent fallback
export const getNextAvailableGeminiModel = (
  currentModelId?: string,
  filterOptions?: Parameters<typeof getHealthyGeminiModels>[0]
): string => {
  const healthyModels = getHealthyGeminiModels(filterOptions);
  
  if (healthyModels.length === 0) {
    // Emergency fallback: reset all cooldowns and try again
    for (const stats of Object.values(modelStats)) {
      stats.cooldownUntil = undefined;
      stats.consecutiveFailures = 0;
      stats.isHealthy = true;
    }
    const fallbackModels = getHealthyGeminiModels(filterOptions);
    return fallbackModels.length > 0 ? fallbackModels[0].id : GEMINI_MODELS[0].id;
  }
  
  if (currentModelId) {
    // Find next model after current one
    const currentIndex = healthyModels.findIndex(m => m.id === currentModelId);
    if (currentIndex >= 0 && currentIndex < healthyModels.length - 1) {
      return healthyModels[currentIndex + 1].id;
    }
  }
  
  // Return highest priority healthy model
  return healthyModels[0].id;
};

// Record model usage with enhanced tracking
export const recordGeminiModelUsage = (
  modelId: string,
  success: boolean,
  responseTimeMs?: number,
  isRateLimit = false
): void => {
  const stats = modelStats[modelId];
  if (!stats) return;
  
  stats.totalRequests++;
  stats.lastUsed = new Date();
  
  if (success) {
    stats.successfulRequests++;
    stats.consecutiveFailures = 0;
    stats.cooldownUntil = undefined;
    
    // Update average response time
    if (responseTimeMs !== undefined) {
      stats.averageResponseTime = 
        (stats.averageResponseTime * (stats.successfulRequests - 1) + responseTimeMs) / 
        stats.successfulRequests;
    }
  } else {
    stats.failedRequests++;
    stats.consecutiveFailures++;
    
    if (isRateLimit) {
      stats.rateLimitFailures++;
    }
    
    // Apply cooldown on consecutive failures
    if (stats.consecutiveFailures >= HEALTH_CHECK_CONFIG.MAX_CONSECUTIVE_FAILURES) {
      stats.isHealthy = false;
      const cooldownMs = calculateCooldown(stats.consecutiveFailures);
      stats.cooldownUntil = new Date(Date.now() + cooldownMs);
    }
  }
};

// Get detailed model status for monitoring
export const getGeminiModelStatus = () => {
  return GEMINI_MODELS.map(model => {
    const stats = modelStats[model.id];
    return {
      id: model.id,
      name: model.name,
      tier: model.tier,
      generation: model.generation,
      priority: model.priority,
      totalRequests: stats.totalRequests,
      successRate: stats.totalRequests > 0
        ? `${((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}%`
        : 'N/A',
      averageResponseTime: stats.averageResponseTime > 0
        ? `${stats.averageResponseTime.toFixed(0)}ms`
        : 'N/A',
      consecutiveFailures: stats.consecutiveFailures,
      rateLimitFailures: stats.rateLimitFailures,
      isHealthy: stats.isHealthy,
      inCooldown: isInCooldown(stats),
      cooldownEndsAt: stats.cooldownUntil?.toISOString(),
      lastUsed: stats.lastUsed.toISOString(),
      contextWindow: `${(model.contextWindow / 1_000_000).toFixed(1)}M tokens`,
      features: {
        thinking: model.supportsThinking,
        codeExecution: model.supportsCodeExecution,
        grounding: model.supportsGrounding,
      },
    };
  });
};

// Reset model stats (useful for testing or recovery)
export const resetModelStats = (modelId?: string): void => {
  if (modelId) {
    const stats = modelStats[modelId];
    if (stats) {
      stats.totalRequests = 0;
      stats.successfulRequests = 0;
      stats.failedRequests = 0;
      stats.rateLimitFailures = 0;
      stats.consecutiveFailures = 0;
      stats.averageResponseTime = 0;
      stats.isHealthy = true;
      stats.cooldownUntil = undefined;
    }
  } else {
    // Reset all models
    for (const stats of Object.values(modelStats)) {
      stats.totalRequests = 0;
      stats.successfulRequests = 0;
      stats.failedRequests = 0;
      stats.rateLimitFailures = 0;
      stats.consecutiveFailures = 0;
      stats.averageResponseTime = 0;
      stats.isHealthy = true;
      stats.cooldownUntil = undefined;
    }
  }
};

// Helper function to get model instance
export const getGeminiModel = (modelId = 'gemini-2.5-flash') => {
  return google(modelId);
};

// Get model by tier preference
export const getGeminiModelByTier = (tier: ModelTier) => {
  const model = getHealthyGeminiModels({ tier })[0];
  return model ? google(model.id) : google('gemini-2.5-flash');
};

// Get model config by ID
export const getModelConfig = (modelId: string): GeminiModelConfig | undefined => {
  return GEMINI_MODELS.find(m => m.id === modelId);
};

// Get models with free quota
export const getFreeQuotaModels = (): GeminiModelConfig[] => {
  return GEMINI_MODELS.filter(model => model.hasFreeQuota && !model.deprecated);
};

// Check if model has free quota
export const hasModelFreeQuota = (modelId: string): boolean => {
  const model = GEMINI_MODELS.find(m => m.id === modelId);
  return model?.hasFreeQuota || false;
};

// Get recommended model based on use case
export const getRecommendedModel = (useCase: {
  needsThinking?: boolean;
  needsCodeExecution?: boolean;
  needsGrounding?: boolean;
  minContextWindow?: number;
  prioritizeSpeed?: boolean;
  prioritizeCost?: boolean;
}): string => {
  let candidates = getHealthyGeminiModels({
    requiresThinking: useCase.needsThinking,
    requiresCodeExecution: useCase.needsCodeExecution,
    minContextWindow: useCase.minContextWindow,
  });

  if (useCase.needsGrounding) {
    candidates = candidates.filter(m => m.supportsGrounding);
  }

  if (candidates.length === 0) {
    return 'gemini-2.5-flash'; // Fallback
  }

  if (useCase.prioritizeSpeed) {
    // Prefer flash-lite models
    const fastModels = candidates.filter(m => m.tier === 'flash-lite');
    if (fastModels.length > 0) return fastModels[0].id;
  }

  if (useCase.prioritizeCost) {
    // Prefer 2.5 flash-lite (most cost-effective)
    const costEffective = candidates.find(m => m.id === 'gemini-2.5-flash-lite');
    if (costEffective) return costEffective.id;
  }

  // Return highest priority model
  return candidates[0].id;
};