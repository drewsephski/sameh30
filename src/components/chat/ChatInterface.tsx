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
import { MobileHeader } from "@/components/mobile-header";
import { MobileDrawer } from "@/components/mobile-drawer";
import { Download, Trash2, Copy, Check, User, Crown, Menu } from "lucide-react";
import Link from "next/link";
import type { LanguageModelUsage } from "ai";
import { toast } from "sonner";

interface EnhancedChatInterfaceProps {
  isGuest: boolean;
  user: { firstName?: string } | null | undefined;
  currentModeId: string;
  onModeChange: (modeId: string) => void;
}

export function EnhancedChatInterface({ isGuest, user, currentModeId, onModeChange }: EnhancedChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { messages, status, sendMessage } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
    }),
    experimental_throttle: 50,
  });
  
  const isLoading = status === "submitted" || status === "streaming";
  const showPromptSuggestions = messages.length === 0;

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSuggestionSelect = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleSubmit = async (e: { text?: string }) => {
    if (isLoading) return;
    const text = (e.text ?? "").trim();
    if (!text) return;

    // Send message to AI
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
    <div className="flex h-screen bg-background chrome-fix mobile-chat-container">
      {/* Mobile Header */}
      {isMobile ? (
        <MobileHeader
          onMenuToggle={() => setSidebarOpen(true)}
          conversationTitle={showPromptSuggestions ? "AI Chat" : "New Conversation"}
          currentModeId={currentModeId}
          onModeChange={onModeChange}
        />
      ) : (
        /* Desktop Header */
        <div className="hidden md:flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-30 w-full">
          {/* User Status */}
          <div className="flex items-center gap-2">
            {isGuest ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-full text-xs mobile-focus">
                <User className="h-3 w-3" />
                <span>Guest Mode</span>
                <Link href="/sign-in" className="underline hover:no-underline ml-1">
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full text-xs mobile-focus">
                <Crown className="h-3 w-3" />
                <span>{user?.firstName || 'User'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSidebarOpen(false);
            }}
            tabIndex={-1}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80">
            <MobileDrawer
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onNewChat={() => {
                // Handle new chat logic
                setSidebarOpen(false);
              }}
            />
          </div>
        </>
      )}

        {/* Chat Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Action Bar */}
          {messages.length > 0 && (
            <div className="flex items-center justify-between p-3 md:p-4 border-b bg-background/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyConversation}
                  className="mobile-button h-8"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadConversation}
                  className="mobile-button h-8"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearConversation}
                  className="mobile-button h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex items-center justify-center min-h-0 p-3 md:p-4">
            <div className="w-full max-w-5xl h-full">
              <Conversation className="h-full">
                <ConversationContent className="space-y-4 md:space-y-6">
                  {messages.map((message) => (
                    <Message from={message.role} key={message.id}>
                      <MessageAvatar
                        src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"}
                        name={message.role === "user" ? String(user?.firstName || "User") : "AI Assistant"}
                        className="size-6 md:size-8"
                      />
                      <MessageContent variant="contained">
                        {message.role === "user" ? (
                          <div className="max-w-[85%] md:max-w-[70%] mx-auto lg:mx-0 rounded-2xl px-3 md:px-4 py-2 md:py-3 bg-primary text-primary-foreground leading-relaxed text-sm md:text-base shadow-sm hover:shadow-md transition-all duration-200">
                            {getMessageText(message as UIMessage)}
                          </div>
                        ) : (
                          <div className="max-w-[90%] md:max-w-[85%] mx-auto lg:mx-0 leading-relaxed space-y-3 md:space-y-4">
                            {/* Add Context component for usage tracking */}
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

                            {/* Add Reasoning component for AI thought processes */}
                            <Reasoning
                              isStreaming={status === "streaming"}
                              defaultOpen={false}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>
                                {'The AI is analyzing your request and formulating a comprehensive response...'}
                              </ReasoningContent>
                            </Reasoning>

                            {/* Add Sources component for citations */}
                            <Sources>
                              <SourcesTrigger count={0} />
                              <SourcesContent>
                              </SourcesContent>
                            </Sources>

                            {/* Render message content with enhanced response */}
                            {(message as UIMessage).parts?.map((part: { type: string; text?: string }, i: number) =>
                              part?.type === "text" ? (
                                <EnhancedResponse key={`${message.id}-${i}`} className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                                  {part.text}
                                </EnhancedResponse>
                              ) : null
                            )}
                          </div>
                        )}
                      </MessageContent>
                    </Message>
                  ))}

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex justify-center items-center gap-2">
                      <Loader size={24} />
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  )}

                  {/* Welcome State */}
                  {showPromptSuggestions && (
                    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] text-center space-y-6 md:space-y-8 px-4">
                      <div className="space-y-3 md:space-y-4">
                        <h1 className="text-2xl md:text-4xl font-semibold bg-linear-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                          Welcome to Enhanced AI Chat
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base">
                          Experience the full power of AI Elements with enhanced features...
                        </p>
                        {isGuest && (
                          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
                            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-xs md:text-sm mb-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">Guest Mode Active</span>
                            </div>
                            <p className="text-blue-700 dark:text-blue-300 text-xs">
                              Your conversation will be temporary.
                              <Link href="/sign-in" className="underline hover:no-underline ml-1">
                                Sign up
                              </Link> for permanent conversation history.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Suggestions */}
                      <div className="w-full max-w-4xl space-y-4 md:space-y-6 flex flex-col">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                          <Suggestion
                            suggestion="Show me how to use AI Elements components"
                            onClick={handleSuggestionSelect}
                          />
                          <Suggestion
                            suggestion="Create a TypeScript function with error handling"
                            onClick={handleSuggestionSelect}
                          />
                          <Suggestion
                            suggestion="Explain the benefits of using shadcn/ui components"
                            onClick={handleSuggestionSelect}
                          />
                          <Suggestion
                            suggestion="Generate example code for a React component"
                            onClick={handleSuggestionSelect}
                          />
                          <Suggestion
                            suggestion="Show me how to integrate with the Vercel AI SDK"
                            onClick={handleSuggestionSelect}
                          />
                          <Suggestion
                            suggestion="Create a complete Next.js app with AI chat"
                            onClick={handleSuggestionSelect}
                          />
                        </div>
                        
                        <PromptInput
                          onSubmit={handleSubmit}
                        >
                          <PromptInputBody>
                            <PromptInputTextarea
                              placeholder="Try asking about AI Elements or select a suggestion above..."
                              value={inputValue}
                              onChange={(ev) => setInputValue(ev.currentTarget.value)}
                              disabled={isLoading}
                              className="min-h-[60px] resize-none mobile-input mobile-focus"
                            />
                          </PromptInputBody>
                          <PromptInputTools>
                            <PromptInputSubmit disabled={isLoading || inputValue.trim().length === 0} className="mobile-button touch-feedback" />
                          </PromptInputTools>
                        </PromptInput>
                      </div>
                    </div>
                  )}
                </ConversationContent>
              </Conversation>
            </div>
          </div>

          {/* Input Area */}
          {!showPromptSuggestions && (
            <div className={`p-3 md:p-4 bg-background/95 backdrop-blur-sm border-t ${isMobile ? 'safe-area-bottom' : ''}`}>
              <div className="w-full max-w-5xl mx-auto">
                <PromptInput
                  onSubmit={handleSubmit}
                >
                  <PromptInputBody>
                    <PromptInputTextarea
                      placeholder="Ask me anything about AI development..."
                      value={inputValue}
                      onChange={(ev) => setInputValue(ev.currentTarget.value)}
                      disabled={isLoading}
                      className="min-h-[50px] resize-none mobile-input mobile-focus"
                    />
                  </PromptInputBody>
                  <PromptInputTools>
                    <PromptInputSubmit disabled={isLoading || inputValue.trim().length === 0} className="mobile-button touch-feedback" />
                  </PromptInputTools>
                </PromptInput>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}