"use client";

import { useState, memo } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Response as OriginalResponse } from "@/components/ai-elements/response";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { BundledLanguage } from "shiki";

type ResponseProps = React.ComponentProps<typeof OriginalResponse>;

// Parse markdown content to extract code blocks
const parseMarkdownContent = (content: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const matches: Array<{
    language?: string;
    code: string;
    startIndex: number;
    endIndex: number;
  }> = [];
  let match: RegExpExecArray | null;
  
  while (true) {
    match = codeBlockRegex.exec(content);
    if (match === null) break;
    matches.push({
      language: match[1] as BundledLanguage,
      code: match[2].trim(),
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }
  
  return matches;
};

export const EnhancedResponse = memo(
  ({ className, children, ...props }: ResponseProps) => {
    const [copied, setCopied] = useState(false);
    
    // Extract text content for copy functionality
    const extractTextContent = (node: React.ReactNode): string => {
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      if (node === null || node === undefined) return "";
      if (Array.isArray(node)) return node.map(extractTextContent).join("");
      if (typeof node === "object" && "props" in node) {
        return extractTextContent((node as { props?: { children?: React.ReactNode } }).props?.children ?? "");
      }
      return String(node);
    };

    const renderContentWithCodeBlocks = (text: string) => {
      const codeBlocks = parseMarkdownContent(text);
      
      if (codeBlocks.length === 0) {
        return <OriginalResponse className={className} {...props}>{text}</OriginalResponse>;
      }

      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let codeBlockIndex = 0;

      for (const codeBlock of codeBlocks) {
        // Add text before code block
        if (codeBlock.startIndex > lastIndex) {
          const beforeText = text.slice(lastIndex, codeBlock.startIndex);
          parts.push(
            <OriginalResponse key={`text-${parts.length}`} className={className} {...props}>
              {beforeText}
            </OriginalResponse>
          );
        }

        // Add code block
        const language = (codeBlock.language || "typescript") as BundledLanguage;
        parts.push(
          <div key={`code-${codeBlockIndex++}`} className="my-4">
            <CodeBlock
              code={codeBlock.code}
              language={language}
              showLineNumbers={true}
            >
              <CodeBlockCopyButton />
            </CodeBlock>
          </div>
        );

        lastIndex = codeBlock.endIndex;
      }

      // Add remaining text after last code block
      if (lastIndex < text.length) {
        const afterText = text.slice(lastIndex);
        parts.push(
          <OriginalResponse key={`text-${parts.length}`} className={className} {...props}>
            {afterText}
          </OriginalResponse>
        );
      }

      return parts;
    };

    const handleCopy = async () => {
      try {
        const textContent = extractTextContent(children);
        await navigator.clipboard.writeText(textContent);
        setCopied(true);
        toast.success("Response copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy response");
      }
    };

    // Handle both string content and React nodes
    const content = typeof children === "string" 
      ? renderContentWithCodeBlocks(children)
      : children;

    return (
      <div className="relative group transition-all duration-200">
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none p-4 md:p-6 leading-relaxed">
          {content}
        </div>
        
        {/* Copy button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200",
            "h-8 w-8 p-0 hover:bg-background/80 backdrop-blur-sm rounded-md"
          )}
          onClick={handleCopy}
          title="Copy response"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  },
  (prevProps: ResponseProps, nextProps: ResponseProps) => prevProps.children === nextProps.children
);

EnhancedResponse.displayName = "EnhancedResponse";