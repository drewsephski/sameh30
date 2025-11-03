"use client";

import SimpleChatbot from "@/components/simple-chatbot";

export default function ChatPage() {
  return (
      <div className="max-w-4xl mx-auto p-6 h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Chat with Sam's AI Assistant</h1>
          <p className="text-foreground/80">
            Ask me anything about Sam's background, experience, projects, or get help with petroleum engineering topics.
          </p>
        </div>
        <div className="h-[calc(100vh-300px)] rounded-lg bg-neutral-500/10">
          <SimpleChatbot />
        </div>
      </div>
  );
}