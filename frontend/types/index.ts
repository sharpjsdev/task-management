export type TaskStatus = "all" | "1" | "2" | "3";
export type TaskState = "1" | "2" | "3";

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  status: TaskState;
}
