"use client";

import { useEffect, useState } from "react";

import ChatInput from "../../components/ui/ChatInput";
import ChatWindow from "../../components/ui/ChatWindow";
import Sidebar from "../../components/ui/Sidebar";

import { Chat, Message } from "@/types/chat";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const currentChat = chats.find(
    (chat) => chat.id === currentChatId
  );

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch(
        "/api/chats"
      );

      const data = await response.json();

      setChats(data);

      if (data.length > 0) {
        setCurrentChatId(data[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch(
        "/api/chats",
        {
          method: "POST",
        }
      );

      const newChat = await response.json();

      setChats((prev) => [
        newChat,
        ...prev,
      ]);

      setCurrentChatId(newChat.id);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChat = async (
    id: string
  ) => {
    try {
      await fetch(`/api/chats/${id}`, {
        method: "DELETE",
      });

      const updatedChats =
        chats.filter(
          (chat) => chat.id !== id
        );

      setChats(updatedChats);

      if (currentChatId === id) {
        if (updatedChats.length > 0) {
          setCurrentChatId(
            updatedChats[0].id
          );
        } else {
          await createNewChat();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (
  text: string
) => {
  if (!currentChatId) return;

  const isFirstMessage =
    (currentChat?.messages
      ?.length || 0) === 0;

  const generatedTitle =
    text.length > 30
      ? text.slice(0, 30) + "..."
      : text;

  const userMessage: Message = {
    role: "user",
    content: text,
  };

  // FIRST update local state
  setChats((prev) =>
    prev.map((chat) => {
      if (
        chat.id !== currentChatId
      ) {
        return chat;
      }

      return {
        ...chat,

        title: isFirstMessage
          ? generatedTitle
          : chat.title,

        messages: [
          ...(chat.messages || []),
          userMessage,
        ],
      };
    })
  );

  // THEN update DB title
  if (isFirstMessage) {
    try {
      await fetch(
        `/api/chats/${currentChatId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: generatedTitle,
          }),
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  setLoading(true);

  try {
    const response = await fetch(
      "/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message: text,
          chatId: currentChatId,
        }),
      }
    );
    

    if (!response.body) return;

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    let aiResponse = "";

    // Add empty assistant message
    setChats((prev) =>
      prev.map((chat) => {
        if (
          chat.id !== currentChatId
        ) {
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
      })
    );

    while (true) {
      const { done, value } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      aiResponse += chunk;

      setChats((prev) =>
        prev.map((chat) => {
          if (
            chat.id !==
            currentChatId
          ) {
            return chat;
          }

          const updatedMessages =
            [
              ...(chat.messages ||
                []),
            ];

          updatedMessages[
            updatedMessages.length -
              1
          ] = {
            role: "assistant",
            content: aiResponse,
          };

          return {
            ...chat,
            messages:
              updatedMessages,
          };
        })
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen flex bg-[#f7f7f8]">
      <Sidebar
        chats={chats}
        currentChatId={
          currentChatId
        }
        onSelectChat={
          setCurrentChatId
        }
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={
              currentChat?.messages ||
              []
            }
            loading={loading}
          />
        </div>

        <ChatInput
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}