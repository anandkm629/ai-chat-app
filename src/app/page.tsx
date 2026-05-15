import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">
        AI Chat App
      </h1>

      <Link
        href="/chat"
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Start Chatting
      </Link>
    </div>
  );
}