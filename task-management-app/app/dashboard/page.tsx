"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import TasksList from "@/components/dashboard/tasks-list";
import TaskStats from "@/components/dashboard/task-stats";
import { Loader2 } from "lucide-react";
import { fetchTasks } from "@/lib/store/slices/tasksSlice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { tasks: tasksResponse, loading } = useSelector(
    (state: RootState) => state.tasks
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  //@ts-ignore
  const tasksList = useMemo(() => tasksResponse?.data || [], [tasksResponse]);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 space-y-6">
        <TaskStats tasks={tasksList} />

        <TasksList tasks={tasksList} />
      </main>
    </div>
  );
}
