"use client";

import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input);

    setInput("");
  };

  return (
    <div className="p-4 border-t bg-white flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) =>
          setInput(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        placeholder="Type your message..."
        className="flex-1 border rounded-lg px-4 py-2"
      />

      <button
        onClick={handleSend}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}