import { Message } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
  message: Message;
  isStreaming?: boolean;
}

export default function ChatMessage({ message , isStreaming,}: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-full px-4 py-3 mb-2 rounded-2xl ${
          isUser
            ? "bg-black text-white"
            : "bg-white border dark:bg-[#1e1e1e] dark:border-gray-700 dark:text-white"
        }`}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="uploaded"
            className="mb-3 rounded-xl max-w-xs border"
          />
        )}
        <ReactMarkdown
          components={{
            code(props) {
              const { children, className } = props;

              const match = /language-(\w+)/.exec(className || "");

              return match ? (
                <div className="relative my-4">
                  <button
                    onClick={() => handleCopy(String(children))}
                    className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs text-white hover:bg-gray-700"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>

                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: "12px",
                      padding: "16px",
                      overflowX: "auto",
                    }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="bg-gray-200 px-1 rounded">{children}</code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
         {isStreaming && (
    <span className="ml-1 animate-pulse">
      ▍
    </span>
  )}
      </div>
    </div>
  );
}
