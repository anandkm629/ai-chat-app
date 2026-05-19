import { Chat } from "@/types/chat";
import { UserButton } from "@clerk/nextjs";

interface Props {
  chats: Chat[];
  currentChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: Props) {
  return (
    <div className="w-72 bg-black text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg py-3"
        >
          + New Chat
        </button>
      </div>

      <div className="ml-3">
        <UserButton userProfileMode="modal" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between px-4 py-3 hover:bg-gray-800 ${
              currentChatId === chat.id ? "bg-gray-800" : ""
            }`}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className="flex-1 text-left truncate"
            >
              {chat.title}
            </button>

            <button
              onClick={() => onDeleteChat(chat.id)}
              className="ml-2 text-gray-400 hover:text-red-500"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
