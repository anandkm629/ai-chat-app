"use client";

import { useState } from "react";

import ChatInput from "../../components/ui/ChatInput";
import ChatWindow from "../../components/ui/ChatWindow";
import Sidebar from "../../components/ui/Sidebar";

import { Chat, Message } from "@/types/chat";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    },
  ]);

  const [currentChatId, setCurrentChatId] = useState(chats[0].id);

  const [loading, setLoading] = useState(false);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const createNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);

    setCurrentChatId(newChat.id);
  };

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      role: "user",
      content: text,
    };

    // Add user message
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat;

        return {
          ...chat,

          // Update title only first time
          title:
            chat.messages.length === 0
              ? text.length > 30
                ? text.slice(0, 30) + "..."
                : text
              : chat.title,

          messages: [...chat.messages, userMessage],
        };
      }),
    );

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

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let aiResponse = "";

      // Add empty assistant message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    content: "",
                  },
                ],
              }
            : chat,
        ),
      );

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        aiResponse += chunk;

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== currentChatId) return chat;

            const updatedMessages = [...chat.messages];

            updatedMessages[updatedMessages.length - 1] = {
              role: "assistant",
              content: aiResponse,
            };

            return {
              ...chat,
              messages: updatedMessages,
            };
          }),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = (id: string) => {
  const updatedChats = chats.filter(
    (chat) => chat.id !== id
  );

  setChats(updatedChats);

  // If deleted current chat
  if (currentChatId === id) {
    if (updatedChats.length > 0) {
      setCurrentChatId(
        updatedChats[0].id
      );
    } else {
      // Create new empty chat
      const newChat: Chat = {
        id: crypto.randomUUID(),
        title: "New Chat",
        messages: [],
      };

      setChats([newChat]);
      setCurrentChatId(newChat.id);
    }
  }
};

  return (
    <div className="h-screen flex bg-[#f7f7f8]">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={currentChat?.messages || []}
            loading={loading}
          />
        </div>

        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
