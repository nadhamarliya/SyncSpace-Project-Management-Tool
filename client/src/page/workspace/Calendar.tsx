import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import { getCalendarTasksQueryFn } from "@/lib/api";
import { TaskType } from "@/types/api.type";
import TaskCalendarDialog from "@/components/workspace/calendar/task-calendar-dialog";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Task that the user clicked
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const { workspaceId } = useParams();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const calendarStart = startOfWeek(monthStart, {
    weekStartsOn: 1,
  });

  const calendarEnd = endOfWeek(monthEnd, {
    weekStartsOn: 1,
  });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Get tasks from backend
  const { data, isLoading } = useQuery({
    queryKey: [
      "calendarTasks",
      workspaceId,
      calendarStart.toISOString(),
      calendarEnd.toISOString(),
    ],

    queryFn: () =>
      getCalendarTasksQueryFn({
        workspaceId: workspaceId!,
        startDate: calendarStart.toISOString(),
        endDate: calendarEnd.toISOString(),
      }),

    enabled: !!workspaceId,
  });

  const tasks: TaskType[] = data?.tasks || [];

  return (
    <div className="p-6">
      {/* Calendar Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="rounded-md border px-3 py-2"
          >
            ←
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded-md border px-4 py-2"
          >
            Today
          </button>

          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="rounded-md border px-3 py-2"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 border-l border-t">

        {/* Weekday names */}
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div
            key={day}
            className="border-b border-r p-2 text-center text-xs font-semibold"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          // Find tasks belonging to this date
          const dayTasks = tasks.filter(
            (task) =>
              task.dueDate &&
              format(new Date(task.dueDate), "yyyy-MM-dd") ===
                format(day, "yyyy-MM-dd")
          );

          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 border-b border-r p-1.5 ${
                !isSameMonth(day, currentDate)
                  ? "bg-muted/40 text-muted-foreground"
                  : ""
              }`}
            >
              {/* Date number */}
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isToday(day) ? "bg-black text-white" : ""
                }`}
              >
                {format(day, "d")}
              </div>

              {/* Tasks */}
              <div className="mt-1 space-y-1">
                {dayTasks.map((task) => (
                  <button
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    className="w-full truncate rounded bg-primary px-1.5 py-1 text-left text-xs text-primary-foreground hover:opacity-80"
                  >
                    {task.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="mt-4 text-sm text-muted-foreground">
          Loading tasks...
        </p>
      )}

      <TaskCalendarDialog 
        task={selectedTask} onClose={() => 
        setSelectedTask(null)}
      />
      
    </div>
  );
};

export default Calendar;