"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  ChevronDown,
  Info,
  Brain,
  Cpu
} from "lucide-react";
import { toast } from "sonner";
import { ALL_AVAILABLE_MODELS, getProviderForModel, validateProviderConfig } from "@/lib/llm-providers";

interface ModelStatusProps {
  currentModel?: string;
  originalModel?: string;
  fallbackActivated?: boolean;
  retryCount?: number;
  onModelChange?: (modelId: string) => void;
  className?: string;
}

interface ModelInfo {
  id: string;
  name: string;
  provider: 'openrouter' | 'gemini';
  reliability: 'high' | 'medium' | 'low';
  rateLimitResistant: boolean;
  priority: number;
  free: boolean;
}

export function ModelStatus({ 
  currentModel, 
  originalModel, 
  fallbackActivated = false, 
  retryCount = 0,
  onModelChange,
  className = ""
}: ModelStatusProps) {
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [providerStatus, setProviderStatus] = useState({ openrouter: false, gemini: false });

  // Load available models and provider status
  useEffect(() => {
    const loadModelData = () => {
      try {
        const models = ALL_AVAILABLE_MODELS;
        const status = validateProviderConfig();
        setAvailableModels(models);
        setProviderStatus(status);
      } catch (error) {
        console.error('Error loading model data:', error);
      }
    };

    loadModelData();
  }, []);

  const currentModelInfo = availableModels.find(m => m.id === currentModel);
  const isUsingFallback = fallbackActivated && currentModel !== originalModel;

  const handleModelSelect = (modelId: string) => {
    onModelChange?.(modelId);
    const modelName = availableModels.find(m => m.id === modelId)?.name || modelId;
    toast.success(`Switched to ${modelName}`);
  };

  const getProviderIcon = (provider: 'openrouter' | 'gemini') => {
    switch (provider) {
      case 'openrouter':
        return <Brain className="h-3 w-3" />;
      case 'gemini':
        return <Cpu className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const getProviderColor = (provider: 'openrouter' | 'gemini') => {
    switch (provider) {
      case 'openrouter':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gemini':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReliabilityIcon = (reliability: string) => {
    switch (reliability) {
      case 'high': return <CheckCircle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <AlertTriangle className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter models by available providers
  const filteredModels = availableModels.filter(model => {
    const provider = model.provider;
    return providerStatus[provider];
  });

  const currentProvider = currentModel ? getProviderForModel(currentModel) : 'openrouter';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Current Model Indicator */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              {isUsingFallback ? (
                <>
                  <Shield className="h-3 w-3 text-blue-500" />
                  <span className="text-blue-600">Backup Active</span>
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 text-green-500" />
                  <span>Active</span>
                </>
              )}
              <div className="flex items-center gap-1">
                {currentProvider && getProviderIcon(currentProvider)}
                <span className="truncate max-w-[100px]">
                  {currentModelInfo?.name || currentModel?.split('/').pop() || 'Unknown'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80">
          <DropdownMenuLabel className="font-medium">
            AI Models ({filteredModels.length} available)
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {filteredModels.map((model) => {
            const isCurrentModel = model.id === currentModel;
            
            return (
              <DropdownMenuItem 
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`flex items-center justify-between p-3 cursor-pointer ${
                  isCurrentModel ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getProviderIcon(model.provider)}
                    <span className="font-medium">{model.name}</span>
                  </div>
                  {isCurrentModel && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getProviderColor(model.provider)}`}
                  >
                    {model.provider}
                  </Badge>
                  {model.free && (
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                      Free
                    </Badge>
                  )}
                  {model.rateLimitResistant && (
                    <Badge variant="outline" className="text-xs">
                      Rate Limit Resistant
                    </Badge>
                  )}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getReliabilityColor(model.reliability)}`}
                  >
                    {model.reliability}
                  </Badge>
                </div>
              </DropdownMenuItem>
            );
          })}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDetails(!showDetails)}
            className="cursor-pointer"
          >
            <Settings className="h-4 w-4 mr-2" />
            {showDetails ? 'Hide' : 'Show'} Model Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Retry Count Indicator */}
      {retryCount > 0 && (
        <Badge variant="outline" className="h-6 px-2 text-xs">
          Retry {retryCount}
        </Badge>
      )}

      {/* Provider Status Indicators */}
      <div className="flex items-center gap-1">
        {providerStatus.openrouter && (
          <div
            className="w-2 h-2 rounded-full bg-purple-400"
            title="OpenRouter available"
          />
        )}
        {providerStatus.gemini && (
          <div
            className="w-2 h-2 rounded-full bg-blue-400"
            title="Gemini available"
          />
        )}
      </div>

      {/* Detailed Model Status */}
      {showDetails && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-background border rounded-lg shadow-lg w-96 z-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Provider & Model Status</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetails(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2">
              {/* Provider Status */}
              <div className="text-sm">
                <div className="font-medium mb-1">Providers:</div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      providerStatus.openrouter ? 'bg-purple-400' : 'bg-gray-300'
                    }`} />
                    <span>OpenRouter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      providerStatus.gemini ? 'bg-blue-400' : 'bg-gray-300'
                    }`} />
                    <span>Gemini</span>
                  </div>
                </div>
              </div>
              
              {/* Current Model Info */}
              {currentModelInfo && (
                <div className="text-sm">
                  <div className="font-medium mb-1">Current Model:</div>
                  <div className="flex items-center gap-2">
                    {getProviderIcon(currentModelInfo.provider)}
                    <span>{currentModelInfo.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {currentModelInfo.provider}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Model Count */}
              <div className="text-sm">
                <div className="font-medium mb-1">Available Models:</div>
                <div className="text-muted-foreground">
                  {filteredModels.length} models across {Object.values(providerStatus).filter(Boolean).length} providers
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}