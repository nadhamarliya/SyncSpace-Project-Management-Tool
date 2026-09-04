import { GoogleGenAI } from "@google/genai";
import { config } from "../config/app.config";
import UserModel from "../models/user.model";
import TaskModel from "../models/task.model";

const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

export const chatWithAI = async (
  message: string,
  userId: string
) => {
  // 1. Find user
  const user = await UserModel.findById(userId);

  if (!user || !user.currentWorkspace) {
    throw new Error("User does not have a current workspace");
  }

  const workspaceId = user.currentWorkspace;

  // 2. Get tasks from current workspace
  const tasks = await TaskModel.find({
    workspace: workspaceId,
  })
    .populate("project", "name emoji")
    .populate("assignedTo", "name email")
    .lean();

  // 3. Prepare clean context for Gemini
  const taskContext = tasks.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description || "",

    project: task.project
      ? {
          name: (task.project as any).name,
          emoji: (task.project as any).emoji,
        }
      : null,

    status: task.status,
    priority: task.priority,

    assignedTo: task.assignedTo
      ? {
          name: (task.assignedTo as any).name,
          email: (task.assignedTo as any).email,
        }
      : null,

    dueDate: task.dueDate,
    taskCode: task.taskCode,

    attachments:
      task.attachments?.map((attachment: any) => ({
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        url: attachment.url,
      })) || [],
  }));

  console.log("AI TASKS:", taskContext);

  // 4. Send context + user's question to Gemini
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
You are SyncSpace AI, an AI assistant inside a project
and task management application.

You help users understand their projects and tasks.

IMPORTANT RULES:

1. Only use the workspace data provided below.
2. Never invent tasks, projects, users, priorities, or deadlines.
3. If the information is not available, say so.
4. Keep answers concise and easy to understand.
5. Use bullet points when listing multiple tasks.
6. Format dates in a human-friendly way.
7. Answer the user's question using the workspace data.

CURRENT WORKSPACE TASK DATA:

${JSON.stringify(taskContext, null, 2)}

USER QUESTION:

${message}
`,
  });

  return response.text;
};