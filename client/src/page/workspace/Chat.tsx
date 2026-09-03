import { useParams } from "react-router-dom";
import ChatComponent from "@/components/workspace/chat/Chat";

export default function Chat() {
  const { workspaceId } = useParams();

  if (!workspaceId) {
    return <div>Workspace not found</div>;
  }

  return <ChatComponent workspaceId={workspaceId} />;
}