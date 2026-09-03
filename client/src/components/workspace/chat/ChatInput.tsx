import { useState } from "react";
import { createMessageMutationFn } from "@/lib/api";

type ChatInputProps = {
  workspaceId: string;
};

export default function ChatInput({
  workspaceId,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!message.trim()) return;

  try {
    await createMessageMutationFn({
      workspaceId,
      content: message,
    });

    setMessage("");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t p-3"
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-md border px-3 py-2 outline-none"
      />

      <button
        type="submit"
        className="rounded-md border px-4 py-2"
      >
        Send
      </button>
    </form>
  );
}