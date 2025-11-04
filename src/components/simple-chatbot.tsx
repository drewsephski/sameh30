'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { TypingIndicator } from '@/components/ai-elements/typing-indicator';
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputHeader,
} from '@/components/ai-elements/prompt-input';

// Model configuration with updated IDs and metadata
interface ModelConfig {
  id: string;
  name: string;
  provider: 'gemini' | 'openrouter';
  tier?: 'pro' | 'flash' | 'flash-lite';
  contextWindow?: number;
  free?: boolean;
}

const models: ModelConfig[] = [
  // Current Gemini 2.5 models (recommended)
  { 
    id: 'gemini-2.5-flash-lite', 
    name: 'Gemini 2.5 (Free)', 
    provider: 'gemini',
    tier: 'flash-lite',
    contextWindow: 1_048_576,
    free: true
  },
  
  // OpenRouter paid models
  { 
    id: 'minimax/minimax-m2:free', 
    name: 'MiniMax M2 (Paid)', 
    provider: 'openrouter',
    free: false 
  },
  { 
    id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', 
    name: 'Dolphin Mistral 24B (Paid)', 
    provider: 'openrouter',
    free: false 
  },
  { 
    id: 'openai/gpt-oss-20b:free', 
    name: 'GPT OSS 20B (Paid)', 
    provider: 'openrouter',
    free: false 
  },
  { 
    id: 'z-ai/glm-4.5-air:free', 
    name: 'GLM 4.5 Air (Paid)', 
    provider: 'openrouter',
    free: false 
  },
];

// Local storage keys
const STORAGE_KEYS = {
  SELECTED_MODEL: 'chatbot-selected-model',
  CONVERSATION_HISTORY: 'chatbot-conversation-history',
} as const;

const SimpleChatbot = () => {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Load saved model preference or use latest Gemini 2.5 Flash as default
  const [model, setModel] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL);
      if (saved && models.some(m => m.id === saved)) {
        return saved;
      }
    }
    return 'gemini-2.5-flash-lite';
  });

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  // Save model preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, model);
    }
  }, [model]);

  // Debug logging in development only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Chatbot] Status:', status);
      console.log('[Chatbot] Messages count:', messages.length);
      if (error) {
        console.error('[Chatbot] Error:', error);
      }
    }
  }, [status, messages.length, error]);

  // Memoize current model info
  const currentModelInfo = useMemo(() => {
    return models.find(m => m.id === model);
  }, [model]);

  // Handle message submission with validation and error handling
  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text?.trim());
      const hasAttachments = Boolean(message.files?.length);

      if (!(hasText || hasAttachments)) {
        return;
      }

      // Validate model selection
      if (!model) {
        console.error('[Chatbot] No model selected');
        return;
      }

      try {
        // Send message with current model configuration
        sendMessage(
          {
            text: message.text || 'Sent with attachments',
          },
          {
            body: { model },
          }
        );
        
        // Clear input after successful submission
        setText('');
      } catch (err) {
        console.error('[Chatbot] Failed to send message:', err);
      }
    },
    [model, sendMessage]
  );

  // Handle model change with validation
  const handleModelChange = useCallback((value: string) => {
    const selectedModel = models.find(m => m.id === value);
    if (selectedModel) {
      setModel(value);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[Chatbot] Model changed to:', selectedModel.name);
      }
    }
  }, []);

  // Handle text change
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  // Handle transcription change
  const handleTranscriptionChange = useCallback((transcription: string) => {
    setText(transcription);
  }, []);

  // Check if submit should be disabled
  const isSubmitDisabled = useMemo(() => {
    return !text.trim() || status === 'streaming';
  }, [text, status]);

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    // Handle different part types safely
                    if (part.type === 'text') {
                      return (
                        <Response key={`${message.id}-${i}`}>
                          {part.text}
                        </Response>
                      );
                    }
                    
                    // Handle other part types if needed
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))}
            
            {/* Show typing indicator during streaming */}
            {status === 'streaming' && (
              <Message from="assistant" className="opacity-75">
                <MessageContent className="py-2">
                  <TypingIndicator className="ml-2" />
                </MessageContent>
              </Message>
            )}
            
            {/* Show error state if exists */}
            {error && (
              <Message from="assistant" className="opacity-75">
                <MessageContent className="py-2 text-red-500">
                  <Response>
                    Error: {error.message || 'Failed to process request. Please try again.'}
                  </Response>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput 
          onSubmit={handleSubmit} 
          className="mt-4" 
          globalDrop 
          multiple
        >
          
          <PromptInputBody>
            <PromptInputTextarea
              onChange={handleTextChange}
              value={text}
              ref={textareaRef}
              placeholder="Type your message..."
              aria-label="Message input"
            />
          </PromptInputBody>
          
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputSpeechButton
                onTranscriptionChange={handleTranscriptionChange}
                textareaRef={textareaRef}
              />
              
              <PromptInputModelSelect
                onValueChange={handleModelChange}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((modelItem) => (
                    <PromptInputModelSelectItem 
                      key={modelItem.id} 
                      value={modelItem.id}
                    >
                      {modelItem.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            
            <PromptInputSubmit 
              disabled={isSubmitDisabled} 
              status={status}
              aria-label="Send message"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default SimpleChatbot;