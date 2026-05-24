"use client";

import { useState } from "react";

import { UploadButton } from "@/utils/uploadthing";

import { ImagePlus } from "lucide-react";

interface Props {
  onSend: (message: string, imageUrl?: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const handleSend = () => {
    if (!input.trim() && !imageUrl) return;

    onSend(input, imageUrl);

    setInput("");
    setImageUrl("");
  };

  return (
    <div className="border-t bg-white dark:bg-[#111] p-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Image Preview */}
        {imageUrl && (
          <div className="relative w-fit">
            <img
              src={imageUrl}
              alt="upload"
              className="w-32 h-32 object-cover rounded-xl border"
            />

            <button
              onClick={() => setImageUrl("")}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full"
            >
              ×
            </button>
          </div>
        )}

        {/* Input Row */}
        <div className="flex gap-2 items-end">
          {/* Upload Button */}
          <UploadButton
            endpoint="imageUploader"
            content={{
              button() {
                return <ImagePlus size={18} />;
              },
            }}
            appearance={{
              button: `
    w-12
    h-12
    rounded-xl
    bg-black
    text-white
    flex
    items-center
    justify-center
    hover:bg-gray-900

    dark:bg-white
    dark:text-black
    dark:hover:bg-gray-200

    transition
    `,
            }}
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                setImageUrl(res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />

          {/* Text Input */}
          {/* <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Send a message..."
            className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          /> */}
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);

              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                handleSend();
              }
            }}
            placeholder="Send a message..."
            rows={1}
            className="
    flex-1
    resize-none
    overflow-hidden
    max-h-40
    border
    rounded-2xl
    px-4
    py-3
    outline-none
    focus:ring-2
    focus:ring-black
    dark:bg-[#1e1e1e]
dark:text-white
dark:border-gray-700
  "
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="
  bg-black
  text-white
  px-6
  py-3
  rounded-xl
  hover:bg-gray-900
  dark:bg-white
  dark:text-black
  dark:hover:bg-gray-200
  transition
"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
