"use client";

import { useState } from "react";
import ChatInput from "../../components/ui/ChatInput";
import ChatWindow from "../../components/ui/ChatWindow";
import { Message } from "@/types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
      }),
    });

    const data = await response.json();

    const aiMessage: Message = {
      role: "assistant",
      content: data.message,
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <div className="h-screen flex flex-col">
      <ChatWindow messages={messages} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}