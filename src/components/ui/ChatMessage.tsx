import { Message } from "@/types/chat";

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
        className={`max-w-2xl px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-black text-white"
            : "bg-white border"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}