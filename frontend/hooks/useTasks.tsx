"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types";
import { toast } from "react-toastify";
import { createTask, editTask, fetchTasks, removeTask } from "@/lib/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    switch (filter) {
      case "1":
        setFilteredTasks(tasks.filter((task) => task.status === "1"));
        break;
      case "2":
        setFilteredTasks(tasks.filter((task) => task.status === "2"));
        break;
      case "3":
        setFilteredTasks(tasks.filter((task) => task.status === "3"));
        break;
      case "all":
      default:
        setFilteredTasks(tasks);
        break;
    }
  }, [tasks, filter]);

  useEffect(() => {
    async function getAllTasks() {
      const response = await fetchTasks();
      if (response?.status) {
        setTasks(response?.data);
      }
    }
    getAllTasks();
  }, []);

  const addTask = async (title: string, description: string = "") => {
    const newTask: { title: string; description: string } = {
      title,
      description,
    };

    setIsLoading(true);

    const response = await createTask(newTask);

    if (response?.status) {
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
    }

    setIsLoading(false);

    console.log("RESPONSE DATA WE GOT :- ", response?.data);

    setTasks((prev) => [...prev, response?.data]);
  };

  const toggleTask = async (id: number) => {
    // const taskToUpdate = tasks?.filter((task) => task.id === id)?.[0];
    // const res = await editTask(id, {
    //   ...taskToUpdate,
    //   status: taskToUpdate?.status === "1" ? "3" : "1",
    // });

    // if (res?.status) {
    //   toast.success(res?.message);
    // }

    setTasks((prev) =>
      prev?.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "1" ? "3" : "1",
            }
          : task
      )
    );
  };

  const deleteTask = async (id: number) => {
    const res = await removeTask(id);
    if (res?.status) {
      setTasks((prev) => prev?.filter((task) => task.id !== id));
    }
    if (res?.status) {
      toast.success(res?.message);
    }
  };

  const updateTask = async (id: number, data: Partial<Task>) => {
    const dataToSend = { ...data, id };
    const res = await editTask(dataToSend);

    if (res?.status) {
      toast.success(res?.message);
    }

    setTasks((prev) =>
      prev?.map((task) => (task.id === id ? { ...task, ...data } : task))
    );
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    isLoading,
    setIsLoading,
  };
}
