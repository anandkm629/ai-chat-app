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
      
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  </div>
  );
}
