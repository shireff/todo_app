"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";

export default function DashboardHeader() {
  const dispatch = useDispatch();
  const user = useSelector(
    (state: RootState) => (state.auth as { user: any }).user
  );

  const profileDisplay = useMemo(() => {
    return user?.profileImage
      ? user?.profileImage
      : user?.username?.slice(0, 2).toUpperCase();
  }, [user?.profileImage, user?.username]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Manager</h1>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-4">
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className="text-gray-900 dark:text-gray-100"
              >
                Tasks
              </Button>
            </Link>
            <Link href="/categories" passHref>
              <Button
                variant="ghost"
                className="text-gray-900 dark:text-gray-100"
              >
                Categories
              </Button>
            </Link>
          </div>

          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border dark:border-gray-700 shadow-md"
            >
              <Button
                variant="ghost"
                className="relative h-10 w-10 p-0 rounded-full"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full rounded-full bg-gray-500 text-white font-bold text-sm">
                    {profileDisplay}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border dark:border-gray-700 shadow-md"
            >
              <DropdownMenuItem className="font-medium">
                {user?.name}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
