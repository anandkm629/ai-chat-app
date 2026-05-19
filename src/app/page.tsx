"use client";

import Link from "next/link";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } =
    useUser();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      
      <h1 className="text-5xl font-bold mb-6">
        AI Chat App
      </h1>

      <p className="text-gray-400 mb-8 text-center max-w-xl">
        Your AI-powered assistant built
        with Next.js, Prisma, Clerk,
        and Groq.
      </p>

      {!isSignedIn ? (
        <SignInButton>
          <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">
            Sign In
          </button>
        </SignInButton>
      ) : (
        <div className="flex flex-col items-center gap-4">
          
          <UserButton />

          <Link href="/chat">
            <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">
              Open Chat
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}