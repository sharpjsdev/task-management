"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Task, TaskState } from "@/types";
import {
  MoreVertical,
  CheckCircle2,
  Circle,
  GripVertical,
  Clock,
  PlayCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Task>) => void;
}

const stateColors = {
  todo: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
  "in-progress":
    "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  completed:
    "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
};

const StateIcon = ({ state }: { state: TaskState }) => {
  switch (state) {
    case "1":
      return <Clock size={14} className="mr-1" />;
    case "2":
      return <PlayCircle size={14} className="mr-1" />;
    case "3":
      return <CheckCircle2 size={14} className="mr-1" />;
  }
};

export default function TaskCard({
  task,
  onToggle,
  onDelete,
  onUpdate,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const saveChanges = useCallback(() => {
    if (title.trim()) {
      onUpdate(task.id, { title, description });
      setIsEditing(false);
    }
  }, [description, onUpdate, title, task.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isEditing &&
        titleRef.current &&
        descriptionRef.current &&
        !titleRef.current.contains(event.target as Node) &&
        !descriptionRef.current.contains(event.target as Node)
      ) {
        saveChanges();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, title, description, saveChanges]);

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      title?.length &&
      description?.length
    ) {
      e.preventDefault();
      saveChanges();
    }
  };

  const updateTaskState = (status: TaskState) => {
    onUpdate(task.id, { status });
  };

  const getStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200",
        "border border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-gray-950",
        "flex flex-col h-full",
        { "bg-green-50 dark:bg-green-950/20": String(task.status) === "3" }
      )}
    >
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical size={16} className="text-gray-400" />
          </div>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium flex items-center",
              stateColors[
                String(task.status) === "1"
                  ? "todo"
                  : String(task.status) === "2"
                  ? "in-progress"
                  : "completed"
              ]
            )}
          >
            <StateIcon state={task.status} />
            {String(task.status) === "1"
              ? getStatus("todo")
              : String(task.status) === "2"
              ? getStatus("in-progress")
              : getStatus("completed")}
          </div>
        </div>

        {isEditing ? (
          <>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full mb-2 text-lg font-medium bg-transparent border-none outline-none focus:ring-0"
              placeholder="Title"
            />
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none bg-transparent border-none outline-none focus:ring-0 text-gray-600 dark:text-gray-400 min-h-[60px]"
              placeholder="Add description..."
              rows={3}
            />
          </>
        ) : (
          <div
            className="flex-grow cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <h3
              className={cn("text-lg font-medium mb-1 break-words", {
                "line-through opacity-70": task.completed,
              })}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={cn(
                  "text-gray-600 dark:text-gray-400 break-words whitespace-pre-wrap text-sm",
                  { "line-through opacity-70": task.completed }
                )}
              >
                {task.description}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <button
          // onClick={() => onToggle(task.id)}
          className={cn(
            "p-2 rounded-full transition-colors",
            String(task.status) === "3"
              ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20"
              : String(task.status) === "1"
              ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
              : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
          )}
          aria-label={
            String(task.status) === "3"
              ? "Mark as incomplete"
              : "Mark as complete"
          }
        >
          {/* We have to update this so that a right marker should alwasy be visible */}
          <CheckCircle2 size={20} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              aria-label="Task options"
            >
              <MoreVertical size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={task?.status === "1"}
              className="cursor-pointer"
              onClick={() => updateTaskState("1")}
            >
              Mark as Todo
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={task?.status === "2"}
              className="cursor-pointer"
              onClick={() => updateTaskState("2")}
            >
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={task?.status === "3"}
              className="cursor-pointer"
              onClick={() => updateTaskState("3")}
            >
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
