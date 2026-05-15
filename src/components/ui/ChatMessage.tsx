import { Message } from "@/types/chat";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  return (
    <div
      className={`p-3 rounded-lg max-w-xl ${
        message.role === "user"
          ? "bg-blue-500 text-white ml-auto"
          : "bg-gray-200 text-black"
      }`}
    >
      {message.content}
    </div>
  );
}