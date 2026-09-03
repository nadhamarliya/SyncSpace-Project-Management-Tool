import { useEffect } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import socket from "@/lib/socket";

type ChatProps = {
  workspaceId: string;
};

export default function Chat({ workspaceId }: ChatProps) {
  useEffect(() => {
    socket.connect();

    socket.emit("join-workspace", workspaceId);

    return () => {
      socket.disconnect();
    };
  }, [workspaceId]);

  return (
    <div className="flex h-[600px] flex-col rounded-lg border">
      <div className="border-b p-4">
        <h2 className="font-semibold">Workspace Chat</h2>
        <p className="text-sm text-muted-foreground">
          Chat with your workspace members
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages workspaceId={workspaceId} />
      </div>

      <ChatInput workspaceId={workspaceId} />
    </div>
  );
}