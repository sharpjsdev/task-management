"use client";

import TaskForm from "@/components/TaskForm";
import TaskGrid from "@/components/TaskGrid";
import TaskFilter from "@/components/TaskFilter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTasks } from "@/hooks/useTasks";
import { CheckCheck, ListTodo, Inbox, LogOut, Menu, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    tasks,
    allTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    isLoading,
  } = useTasks();

  const counts = {
    all: allTasks?.length,
    todo: allTasks?.filter((task) => task.status === "1").length,
    "in-progress": allTasks?.filter((task) => task.status === "2").length,
    completed: allTasks?.filter((task) => task.status === "3").length,
  };

  const handleLogout = async () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("auth_token");
    toast.success("Logged Out Successfully");
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <ToastContainer position="top-center" />
      {/* Header */}
      {/* <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-semibold">TaskKeep</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm">
              <div className="flex items-center mr-4">
                <Inbox className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                <span>{counts.all} tasks</span>
              </div>
              <div className="flex items-center mr-4">
                <CheckCheck className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                <span>{counts.completed} completed</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header> */}

      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-semibold">TaskKeep</h1>
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop menu */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center text-sm">
                <div className="flex items-center mr-4">
                  <Inbox className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                  <span>{counts.all} tasks</span>
                </div>
                <div className="flex items-center mr-4">
                  <CheckCheck className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                  <span>{counts.completed} completed</span>
                </div>
              </div>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="sm:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center text-sm">
                  <Inbox className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span>{counts.all} tasks</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCheck className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                  <span>{counts.completed} completed</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <ThemeToggle />
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Task Form */}
        <TaskForm onAddTask={addTask} isLoading={isLoading} />

        {/* Task Filters */}
        <TaskFilter
          activeFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />

        {/* Task Grid */}
        <TaskGrid
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </div>
    </main>
  );
}
