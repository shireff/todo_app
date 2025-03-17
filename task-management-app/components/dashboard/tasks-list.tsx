"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { Task } from "@/lib/types";
import {
  updateTask,
  deleteTask,
  createTask,
  fetchTasks,
} from "@/lib/store/slices/tasksSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import { useCallback, useMemo, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface TasksListProps {
  tasks: Task[];
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export default function TasksList({ tasks }: TasksListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof taskSchema>) => {
      try {
        const taskData = {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
        };

        await dispatch(createTask(taskData)).unwrap();
        reset();
        await dispatch(fetchTasks()).unwrap();
        setIsCreateOpen(false);
      } catch (error) {
        console.error("❌ Failed to create task:", error);
      }
    },
    [dispatch, reset]
  );

  const handleStatusChange = useCallback(
    async (task: Task, newStatus: TaskStatus) => {
      try {
        await dispatch(
          updateTask({ id: task._id, updates: { status: newStatus } })
        ).unwrap();

        await dispatch(fetchTasks()).unwrap();
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    },
    [dispatch]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        await dispatch(deleteTask(taskId));
        await dispatch(fetchTasks()).unwrap();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    },
    [dispatch]
  );

  const noTasks = useMemo(() => tasks.length === 0, [tasks.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter task description"
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  {...register("dueDate")}
                />
                {errors.dueDate && (
                  <p className="text-sm text-destructive">
                    {errors.dueDate.message as string}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task._id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {task.description}
                  </CardDescription>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      <span onClick={() => handleDeleteTask(task._id)}>
                        Delete
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`px-5 py-2 ${
                        task.status === TaskStatus.COMPLETED
                          ? "bg-green-500 text-white"
                          : task.status === TaskStatus.PENDING
                          ? "bg-yellow-500 text-white"
                          : task.status === TaskStatus.CANCELLED
                          ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {task.status
                        ? task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)
                        : "Unknown"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {Object.values(TaskStatus).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(task, status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}

        {noTasks && (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No tasks found. Create your first task to get started!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
