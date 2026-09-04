import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";

export const titleSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();

export const assignedToSchema = z.string().trim().min(1).nullable().optional();

export const prioritySchema = z.enum(
  Object.values(TaskPriorityEnum) as [string, ...string[]]
);

export const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]]
);

export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      return !val || !isNaN(Date.parse(val));
    },
    {
      message: "Invalid date format. Please provide a valid date string.",
    }
  );

export const taskIdSchema = z.string().trim().min(1);

export const attachmentSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  type: z.string().min(1),
  size: z.number().nonnegative(),
});

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,

  attachments: z.array(attachmentSchema).optional(),
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});
