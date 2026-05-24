"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@clerk/nextjs";

import ChatInput from "../../components/ui/ChatInput";
import ChatWindow from "../../components/ui/ChatWindow";
import Sidebar from "../../components/ui/Sidebar";

import { Chat, Message } from "@/types/chat";

export default function ChatPage() {
  const { userId } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);

      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");

      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");

      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats");

      const data = await response.json();

      const safeChats = Array.isArray(data) ? data : [];

      setChats(safeChats);

      if (safeChats.length > 0) {
        setCurrentChatId(safeChats[0].id);
      } else {
        // Auto create first chat
        await createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
      });

      const newChat = await response.json();

      setChats((prev) => [newChat, ...prev]);

      setCurrentChatId(newChat.id);

      setSidebarOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChat = async (id: string) => {
    try {
      await fetch(`/api/chats/${id}`, {
        method: "DELETE",
      });

      const updatedChats = chats.filter((chat) => chat.id !== id);

      setChats(updatedChats);

      if (currentChatId === id) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id);
        } else {
          await createNewChat();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (text: string, imageUrl?: string) => {
    if (!currentChatId) return;

    const isFirstMessage = (currentChat?.messages?.length || 0) === 0;

    const generatedTitle = text.length > 30 ? text.slice(0, 30) + "..." : text;

    const userMessage: Message = {
      role: "user",
      content: text,
      imageUrl,
    };

    // Update local state immediately
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) {
          return chat;
        }

        return {
          ...chat,

          title: isFirstMessage ? generatedTitle : chat.title,

          messages: [...(chat.messages || []), userMessage],
        };
      }),
    );

    // Update DB title
    if (isFirstMessage) {
      try {
        await fetch(`/api/chats/${currentChatId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: generatedTitle,
          }),
        });
      } catch (error) {
        console.log(error);
      }
    }

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          imageUrl,
          chatId: currentChatId,
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let aiResponse = "";

      // Add empty assistant message
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== currentChatId) {
            return chat;
          }

          return {
            ...chat,
            messages: [
              ...(chat.messages || []),
              {
                role: "assistant",
                content: "",
              },
            ],
          };
        }),
      );

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        aiResponse += chunk;

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== currentChatId) {
              return chat;
            }

            const updatedMessages = [...(chat.messages || [])];

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

  // Protect page
  if (!userId) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Please sign in
      </div>
    );
  }

  return (
    <div className="h-dvh flex overflow-hidden bg-[#f7f7f8] dark:bg-[#0f0f0f]">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={(id: string) => {
          setCurrentChatId(id);
          setSidebarOpen(false);
        }}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
      />

      <div className="flex flex-1 flex-col min-h-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b bg-white shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            ☰
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="
    ml-auto
    my-2
    mx-2
    px-4
    py-2
    rounded-xl
    border
    dark:border-gray-700
    dark:bg-gray-900
    dark:text-white
  "
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatWindow
            messages={currentChat?.messages || []}
            loading={loading}
          />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t bg-white">
          <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
