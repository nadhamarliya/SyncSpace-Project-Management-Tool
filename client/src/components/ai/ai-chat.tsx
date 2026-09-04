import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { chatAIMutationFn } from "@/lib/api";

type ChatMessage = {
  role: "user" | "ai";
  content: string;
};

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const userMessage = input.trim();

    if (!userMessage || isLoading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await chatAIMutationFn({
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: response.message,
        },
      ]);
    } catch (error) {
      console.error("AI CHAT ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[380px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
          
          {/* HEADER */}
          <div className="flex items-center justify-between border-b px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>

              <div>
                <h2 className="font-semibold">SyncSpace AI</h2>
                <p className="text-xs text-muted-foreground">
                  Your workspace assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4">
            
            {/* EMPTY STATE */}
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-7 w-7" />
                </div>

                <h3 className="font-semibold">
                  How can I help?
                </h3>

                <p className="mt-1 max-w-[260px] text-sm text-muted-foreground">
                  Ask me about your tasks, projects, priorities or deadlines.
                </p>
              </div>
            )}

            {/* MESSAGE LIST */}
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {/* AI AVATAR */}
                  {message.role === "ai" && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  {/* MESSAGE */}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted"
                    }`}
                  >
                    {message.content.split("\n").map((line, lineIndex) => (
                      <div key={lineIndex}>
                        {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
                          if (
                            part.startsWith("**") &&
                            part.endsWith("**")
                          ) {
                            return (
                              <strong key={partIndex}>
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }

                          return <span key={partIndex}>{part}</span>;
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* TYPING INDICATOR */}
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>

                  <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT */}
          <div className="border-t p-3">
            <div className="flex items-end gap-2 rounded-xl border bg-background p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about your tasks..."
                disabled={isLoading}
                rows={1}
                className="max-h-24 min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />

              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Enter to send · Shift + Enter for new line
            </p>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105 hover:shadow-xl"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
};

export default AIChat;