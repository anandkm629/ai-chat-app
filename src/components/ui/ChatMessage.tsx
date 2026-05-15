import { Message } from "@/types/chat";
import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } 
from "react-syntax-highlighter";
import { oneDark } 
from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Props {
  message: Message;
}

export default function ChatMessage({
  message,
}: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-full px-4 py-3 mb-2 rounded-2xl ${
          isUser
            ? "bg-black text-white"
            : "bg-white border"
        }`}
      >
        <ReactMarkdown
          components={{
            code(props) {
              const { children, className } = props;

              const match = /language-(\w+)/.exec(
                className || ""
              );

              return match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-200 px-1 rounded">
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}