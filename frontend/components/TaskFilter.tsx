"use client";

import React from "react";
import { TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

interface TaskFilterProps {
  activeFilter: TaskStatus;
  onFilterChange: (filter: TaskStatus) => void;
  counts: {
    all: number;
    todo: number;
    "in-progress": number;
    completed: number;
  };
}

export default function TaskFilter({
  activeFilter,
  onFilterChange,
  counts,
}: TaskFilterProps) {
  const filters: { value: TaskStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "1", label: "To-Do" },
    { value: "2", label: "In Progress" },
    { value: "3", label: "Completed" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters?.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            {
              "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200":
                activeFilter === filter.value,
              "bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300":
                activeFilter !== filter.value,
            }
          )}
        >
          {filter.label} (
          {
            counts[
              filter.value === "all"
                ? "all"
                : filter.value === "1"
                ? "todo"
                : filter.value === "2"
                ? "in-progress"
                : "completed"
            ]
          }
          )
        </button>
      ))}
    </div>
  );
}
