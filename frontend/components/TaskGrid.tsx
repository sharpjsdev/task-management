"use client";

import React, { useState, useEffect } from "react";
import { Task } from "@/types";
import TaskCard from "./TaskCard";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

interface TaskGridProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Task>) => void;
  onReorder?: (updatedTasks: Task[]) => void; // optional if you want to lift state
}

export default function TaskGrid({
  tasks,
  onToggle,
  onDelete,
  onUpdate,
  onReorder,
}: TaskGridProps) {
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = taskList.findIndex((task) => task.id === active.id);
      const newIndex = taskList.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(taskList, oldIndex, newIndex);
      setTaskList(newTasks);

      if (onReorder) {
        onReorder(newTasks); // Pass reordered list to parent if needed
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={taskList?.map((task) => task.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {taskList?.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">No tasks found</p>
              <p className="text-sm mt-1">Add a new task to get started</p>
            </div>
          ) : (
            taskList?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
