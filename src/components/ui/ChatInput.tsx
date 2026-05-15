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
   <div className="border-t bg-white p-4">
    <div className="max-w-4xl mx-auto flex gap-2">
      
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
        placeholder="Send a message..."
        className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
      />

      <button
        onClick={handleSend}
        className="bg-black text-white px-6 rounded-xl"
      >
        Send
      </button>
    </div>
  </div>
  );
}