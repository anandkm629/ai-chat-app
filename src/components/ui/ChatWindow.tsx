"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";

interface Props {
  messages: Message[];
  loading: boolean;
}

export default function ChatWindow({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="h-full overflow-y-auto pb-25">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              AI Assistant
            </h1>

            <p className="mt-4 text-gray-500 max-w-md">
              Ask anything, upload images, generate ideas, debug code, and chat
              with AI.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
