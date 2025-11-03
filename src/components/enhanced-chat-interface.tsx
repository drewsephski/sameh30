"use client";

import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageAvatar } from "@/components/ai-elements/message";
import { EnhancedResponse } from "@/components/ai-elements/enhanced-response";
import { Loader } from "@/components/ai-elements/loader";
import { Sources, SourcesTrigger, SourcesContent } from "@/components/ai-elements/sources";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Context, ContextTrigger, ContextContent, ContextContentHeader, ContextContentBody, ContextContentFooter, ContextInputUsage, ContextOutputUsage, ContextReasoningUsage, ContextCacheUsage } from "@/components/ai-elements/context";
import { Suggestion } from "@/components/ai-elements/suggestion";
import { Button } from "@/components/ui/button";
import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputTools, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Download, Trash2, Copy, Check, User, Crown } from "lucide-react";
import Link from "next/link";
import type { LanguageModelUsage } from "ai";
import { toast } from "sonner";
import { MobileHeader } from "@/components/mobile-header";
import { MobileDrawer } from "@/components/mobile-drawer";

interface EnhancedChatInterfaceProps {
  isGuest: boolean;
}

export function EnhancedChatInterface({ isGuest }: EnhancedChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { messages, status, sendMessage } = useChat({
    transport: new TextStreamChatTransport({ api: "/api/chat" }),
    experimental_throttle: 50,
  });
  
  const isLoading = status === "submitted" || status === "streaming";
  const showPromptSuggestions = messages.length === 0;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect virtual keyboard on mobile
  useEffect(() => {
    const detectKeyboard = () => {
      if (isMobile) {
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const documentHeight = document.documentElement.clientHeight;
        setIsKeyboardVisible(viewportHeight < documentHeight * 0.75);
        return;
      }
      setIsKeyboardVisible(false);
    };

    // Throttle keyboard detection for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledDetect = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(detectKeyboard, 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', throttledDetect);
      return () => {
        clearTimeout(timeoutId);
        window.visualViewport?.removeEventListener('resize', throttledDetect);
      };
    }
    window.addEventListener('resize', throttledDetect);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', throttledDetect);
    };
  }, [isMobile]);

  const handleSuggestionSelect = (suggestion: string) => {
    setInputValue(suggestion);
    
    // Provide haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleSubmit = async (e: { text?: string }) => {
    if (isLoading) return;
    const text = (e.text ?? "").trim();
    if (!text) return;

    // Provide haptic feedback on mobile
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }

    void sendMessage({ text });
    setInputValue("");
  };

  const handleCopyConversation = async () => {
    try {
      const conversationText = messages.map(msg => {
        const role = msg.role === "user" ? "You" : "Assistant";
        return `${role}: ${getMessageText(msg as UIMessage)}`;
      }).join("\n\n");
      
      await navigator.clipboard.writeText(conversationText);
      setCopied(true);
      toast.success("Conversation copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy conversation");
    }
  };

  const handleDownloadConversation = () => {
    try {
      const conversationText = messages.map(msg => {
        const role = msg.role === "user" ? "You" : "Assistant";
        return `${role}: ${getMessageText(msg as UIMessage)}`;
      }).join("\n\n");
      
      const blob = new Blob([conversationText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `conversation-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Conversation downloaded");
    } catch {
      toast.error("Failed to download conversation");
    }
  };

  const handleClearConversation = () => {
    window.location.reload();
  };

  const getMessageText = (message: UIMessage): string => {
    const parts = (message as unknown as { parts?: { type: string; text?: string }[] })?.parts;
    if (Array.isArray(parts)) {
      return parts.map((part) => part && part.type === "text" ? String(part.text ?? "") : "").join("");
    }
    const content = (message as unknown as { content?: string })?.content;
    return typeof content === "string" ? content : "";
  };

  return (
    <div className="flex h-screen overflow-hidden chrome-fix mobile-chat-container" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Mobile Header */}
      {isMobile ? (
        <MobileHeader
          onMenuToggle={() => setSidebarOpen(true)}
          conversationTitle={showPromptSuggestions ? "AI Chat" : "New Conversation"}
          onModeChange={(modeId: string): void => {
            throw new Error("Function not implemented.");
          }}
        />
      ) : (
        <div className="absolute top-4 right-4 z-10">
          {isGuest ? (
            <div className="flex items-center gap-2 px-3 py-1.5 backdrop-blur-xl rounded-full text-xs shadow-sm mobile-focus" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid var(--border)' }}>
              <User className="h-3 w-3" />
              <span className="font-medium">Guest</span>
              <Link href="/sign-in" className="underline hover:no-underline transition-opacity hover:opacity-80" style={{ color: 'var(--accent)' }}>
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 backdrop-blur-xl rounded-full text-xs shadow-sm mobile-focus" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid var(--border)' }}>
              <Crown className="h-3 w-3" />
              <span className="font-medium">User</span>
            </div>
          )}
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80">
            <MobileDrawer
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onNewChat={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Action Bar - Only show when there are messages */}
        {messages.length > 0 && (
          <div className="shrink-0 flex items-center justify-between px-3 py-3 md:px-4 lg:px-6 lg:py-4 backdrop-blur-sm" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyConversation}
                className="h-9 px-3 text-xs md:text-sm transition-all touch-manipulation"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                <span className="hidden xs:inline text-xs">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadConversation}
                className="h-9 px-3 text-xs md:text-sm transition-all touch-manipulation"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden xs:inline text-xs">Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearConversation}
                className="h-9 px-3 text-xs md:text-sm transition-all touch-manipulation"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)', color: 'var(--destructive)' }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden xs:inline text-xs">Clear</span>
              </Button>
            </div>
          </div>
        )}

        {/* Chat Area - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {showPromptSuggestions ? (
            /* Welcome Screen */
            <main className="h-full flex flex-col" aria-label="Welcome screen">
              {/* Welcome Message - Top Section */}
              <div className="flex-1 flex items-center justify-center px-3 py-6 md:px-4 md:py-8">
                <div className="text-center max-w-2xl">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                    Welcome to AI Chat
                  </h1>
                  <p className="text-sm md:text-base" style={{ color: 'var(--muted-foreground)' }}>
                    Ask me anything about Sam's experience, skills, or the energy industry
                  </p>
                </div>
              </div>

              {/* Suggestions Grid - Above Input */}
              <div className="shrink-0 px-4 pb-14">
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mb-4">
                    <Suggestion
                      suggestion="Tell me about your experience at Oxy as a Production Engineer"
                      onClick={handleSuggestionSelect}
                      className="h-auto min-h-[60px] p-3 text-xs md:text-sm flex items-center justify-center text-center transition-all hover:scale-[1.01] mobile-suggestion-card touch-manipulation touch-feedback mobile-focus"
                      style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    />
                    <Suggestion
                      suggestion="What skills did you gain from your petroleum engineering degree?"
                      onClick={handleSuggestionSelect}
                      className="h-auto min-h-[60px] p-3 text-xs md:text-sm flex items-center justify-center text-center transition-all hover:scale-[1.01] mobile-suggestion-card touch-manipulation touch-feedback mobile-focus"
                      style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    />
                    <Suggestion
                      suggestion="How do you apply data analysis in oil and gas production?"
                      onClick={handleSuggestionSelect}
                      className="h-auto min-h-[60px] p-3 text-xs md:text-sm flex items-center justify-center text-center transition-all hover:scale-[1.01] mobile-suggestion-card touch-manipulation touch-feedback mobile-focus"
                      style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    />
                    <Suggestion
                      suggestion="What are the key challenges in reservoir engineering?"
                      onClick={handleSuggestionSelect}
                      className="h-auto min-h-[60px] p-3 text-xs md:text-sm flex items-center justify-center text-center transition-all hover:scale-[1.01] mobile-suggestion-card touch-manipulation touch-feedback mobile-focus"
                      style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    />
                    <Suggestion
                      suggestion="Can you explain your approach to production optimization?"
                      onClick={handleSuggestionSelect}
                      className="h-auto min-h-[60px] p-3 text-xs md:text-sm flex items-center justify-center text-center transition-all hover:scale-[1.01] mobile-suggestion-card touch-manipulation touch-feedback mobile-focus"
                      style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    />
                    <Suggestion
                      suggestion="What emerging technologies are you most excited about in energy?"
                      onClick={handleSuggestionSelect}
                      className="h-auto min-h-[60px] p-3 text-xs md:text-sm flex items-center justify-center text-center transition-all hover:scale-[1.01] mobile-suggestion-card touch-manipulation touch-feedback mobile-focus"
                      style={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Input Field - Bottom */}
              <div className="shrink-0 px-3 pb-4 md:px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                    <PromptInput onSubmit={handleSubmit}>
                      <PromptInputBody>
                        <PromptInputTextarea
                          placeholder="Ask about Sam's experience, skills, or the energy industry..."
                          value={inputValue}
                          onChange={(ev) => setInputValue(ev.currentTarget.value)}
                          disabled={isLoading}
                          className="min-h-[48px] md:min-h-[64px] max-h-[120px] md:max-h-[200px] resize-none px-3 py-3 md:px-4 md:py-3 text-sm md:text-base mobile-input mobile-focus"
                          style={{
                            color: 'var(--foreground)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            outline: 'none'
                          }}
                        />
                      </PromptInputBody>
                      <PromptInputTools>
                        <PromptInputSubmit
                          disabled={isLoading || inputValue.trim().length === 0}
                          className="transition-all min-h-[40px] px-3 mobile-button touch-feedback"
                          style={{
                            backgroundColor: 'var(--brand)',
                            color: 'var(--brand-foreground)'
                          }}
                        />
                      </PromptInputTools>
                    </PromptInput>
                  </div>
                </div>
              </div>
            </main>
          ) : (
            /* Conversation View */
            <Conversation className="h-full">
              <ConversationContent className="px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map((message) => (
                    <Message
                      from={message.role}
                      key={message.id}
                      className="transition-all"
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <MessageAvatar
                          src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"}
                          name={message.role === "user" ? "You" : "AI"}
                          className="size-8 md:size-9 shrink-0 ring-1"
                          style={{ '--tw-ring-color': 'var(--border)' } as React.CSSProperties}
                        />
                        <MessageContent variant="contained" className="flex-1 min-w-0">
                          {message.role === "user" ? (
                            <div className="inline-block max-w-[85%] rounded-2xl px-4 py-2.5 text-sm md:text-base" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                              <p style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {getMessageText(message as UIMessage)}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-w-[95%]">
                              <Context
                                usedTokens={12330}
                                maxTokens={128000}
                                usage={{
                                  inputTokens: 1250,
                                  outputTokens: 480,
                                  reasoningTokens: 2100,
                                  cachedInputTokens: 8500,
                                } as LanguageModelUsage}
                                modelId="gpt-4-1106-preview"
                              >
                                <ContextTrigger />
                                <ContextContent>
                                  <ContextContentHeader />
                                  <ContextContentBody>
                                    <div className="space-y-2">
                                      <ContextInputUsage />
                                      <ContextOutputUsage />
                                      <ContextReasoningUsage />
                                      <ContextCacheUsage />
                                    </div>
                                  </ContextContentBody>
                                  <ContextContentFooter />
                                </ContextContent>
                              </Context>

                              <Reasoning isStreaming={status === "streaming"} defaultOpen={false}>
                                <ReasoningTrigger />
                                <ReasoningContent>
                                  The AI is analyzing your request and formulating a comprehensive response...
                                </ReasoningContent>
                              </Reasoning>

                              <Sources>
                                <SourcesTrigger count={0} />
                                <SourcesContent />
                              </Sources>

                              {(message as UIMessage).parts?.map((part: { type: string; text?: string }, i: number) =>
                                part?.type === "text" ? (
                                  <EnhancedResponse key={`${message.id}-${i}`} className="prose prose-sm md:prose-base max-w-none">
                                    {part.text}
                                  </EnhancedResponse>
                                ) : null
                              )}
                            </div>
                          )}
                        </MessageContent>
                      </div>
                    </Message>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 py-4">
                      <Loader size={20} />
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>AI is thinking...</span>
                    </div>
                  )}
                </div>
              </ConversationContent>
            </Conversation>
          )}
        </div>

        {/* Input Area - Fixed at bottom when in chat mode */}
        {!showPromptSuggestions && (
          <div className={`shrink-0 px-3 py-3 md:px-4 backdrop-blur-sm mobile-input-area ${isMobile ? 'pb-safe' : ''}`} style={{ borderTop: '1px solid var(--border)' }}>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <PromptInput onSubmit={handleSubmit}>
                  <PromptInputBody>
                    <PromptInputTextarea
                      placeholder="Ask me anything about Sam..."
                      value={inputValue}
                      onChange={(ev) => setInputValue(ev.currentTarget.value)}
                      disabled={isLoading}
                      className="min-h-[48px] md:min-h-[64px] max-h-[120px] md:max-h-[200px] resize-none px-3 py-3 md:px-4 md:py-3 text-sm md:text-base text-start mobile-input mobile-focus"
                      style={{
                        color: 'var(--foreground)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none'
                      }}
                    />
                  </PromptInputBody>
                  <PromptInputTools>
                    <PromptInputSubmit
                      disabled={isLoading || inputValue.trim().length === 0}
                      className="transition-all min-h-[40px] px-3 mobile-button touch-feedback"
                      style={{
                        backgroundColor: 'var(--brand)',
                        color: 'var(--brand-foreground)'
                      }}
                    />
                  </PromptInputTools>
                </PromptInput>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}