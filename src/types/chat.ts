export interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}