"use client";

import React, { useState, useRef } from "react";
import { PlusCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onAddTask: (title: string, description: string) => void;
  isLoading: boolean;
}

export default function TaskForm({ onAddTask, isLoading }: TaskFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside form to collapse when expanded
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        isExpanded
      ) {
        if (title.trim() || description.trim()) {
          handleSubmit();
        } else {
          setIsExpanded(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, title, description]);

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onAddTask(title, description);
      setTitle("");
      setDescription("");
      // setIsExpanded(false);
    }
  };

  return (
    <div
      ref={formRef}
      className={cn(
        "mb-8 mx-auto w-full max-w-2xl rounded-lg border border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-gray-950 shadow-sm transition-all duration-200",
        { "shadow-md": isExpanded }
      )}
    >
      <div className="p-4">
        {isExpanded && (
          <input
            disabled={isLoading}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 px-2 py-1.5 text-lg font-medium bg-transparent border-none outline-none focus:ring-0"
            autoFocus
            required
          />
        )}

        <div
          className={cn("flex items-center", { hidden: isExpanded })}
          onClick={() => setIsExpanded(true)}
        >
          <PlusCircle className="text-gray-400 mr-2" size={20} />
          <span className="text-gray-500 dark:text-gray-400">
            Take a note...
          </span>
        </div>

        {isExpanded && (
          <textarea
            disabled={isLoading}
            placeholder="Add description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1.5 bg-transparent border-none outline-none focus:ring-0 resize-none text-gray-700 dark:text-gray-300"
            rows={3}
            required
          />
        )}
      </div>

      {isExpanded && (
        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900/50">
          <button
            disabled={isLoading}
            onClick={() => {
              setIsExpanded(false);
              setTitle("");
              setDescription("");
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X size={18} />
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading || (!title.trim() && !description.trim())}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium",
              title.trim() && description.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      )}
    </div>
  );
}
