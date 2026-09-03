import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskType } from "@/types/api.type";

interface TaskCalendarDialogProps {
  task: TaskType | null;
  onClose: () => void;
}

const TaskCalendarDialog = ({
  task,
  onClose,
}: TaskCalendarDialogProps) => {
  return (
    <Dialog
      open={!!task}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        {task && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {task.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Task Code
                </p>
                <p className="font-medium">{task.taskCode}</p>
              </div>

              {task.project && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Project
                  </p>
                  <p className="font-medium">
                    {task.project.emoji} {task.project.name}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>
                <p className="font-medium">{task.status}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Priority
                </p>
                <p className="font-medium">{task.priority}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Due Date
                </p>
                <p className="font-medium">
                  {format(
                    new Date(task.dueDate),
                    "MMMM d, yyyy"
                  )}
                </p>
              </div>

              {task.assignedTo && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Assigned To
                  </p>
                  <p className="font-medium">
                    {task.assignedTo.name}
                  </p>
                </div>
              )}

              {task.description && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm">
                    {task.description}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskCalendarDialog;