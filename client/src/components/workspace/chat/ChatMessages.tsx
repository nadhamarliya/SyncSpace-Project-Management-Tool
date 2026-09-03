import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessagesQueryFn } from "@/lib/api";
import socket from "@/lib/socket";
import useAuth from "@/hooks/api/use-auth";

type ChatMessagesProps = {
  workspaceId: string;
};

export default function ChatMessages({
  workspaceId,
}: ChatMessagesProps) {
  const queryClient = useQueryClient();
  const { data: authData } = useAuth();

  const currentUserId = authData?.user?._id;
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["workspaceMessages", workspaceId],
    queryFn: () => getMessagesQueryFn({ workspaceId }),
  });

  useEffect(() => {
    const handleNewMessage = () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaceMessages", workspaceId],
      });
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [workspaceId, queryClient]);

  const messages = data?.messages ?? [];

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message: any) => {
        const isMine = message.senderId?._id === currentUserId;
        const senderName = message.senderId?.name || "User";

        return (
          <div
            key={message._id}
            className={`flex flex-col ${
              isMine ? "items-end" : "items-start"
            }`}
          >
            {/* Username */}
            <p className="mb-1 px-1 text-xs font-medium text-muted-foreground">
              {senderName}
            </p>

            {/* Message bubble */}
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                isMine
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>

            {/* Timestamp */}
            <p className="mt-1 px-1 text-[10px] text-muted-foreground">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}