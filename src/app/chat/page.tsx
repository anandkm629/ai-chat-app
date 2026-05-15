"use client";

import { useState } from "react";
import ChatInput from "../../components/ui/ChatInput";
import ChatWindow from "../../components/ui/ChatWindow";
import { Message } from "@/types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
  const userMessage: Message = {
    role: "user",
    content: text,
  };

  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  setLoading(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
      }),
    });

    if (!response.body) return;

    const reader =
      response.body.getReader();

    const decoder = new TextDecoder();

    let aiResponse = "";

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
      },
    ]);

    while (true) {
      const { done, value } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      aiResponse += chunk;

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "assistant",
          content: aiResponse,
        };

        return updated;
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen bg-[#f7f7f8] flex flex-col">
    
    <div className="flex-1 overflow-hidden">
      <ChatWindow
        messages={messages}
        loading={loading}
      />
    </div>

    <ChatInput onSend={sendMessage} />
  </div>
  );
}