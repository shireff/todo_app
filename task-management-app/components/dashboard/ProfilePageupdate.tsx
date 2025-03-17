"use client";

import { useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  updateProfile,
  updateProfileImage,
} from "@/lib/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  username: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export default function ProfilePageUpdate() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(
    (state: RootState) => state.auth
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const handleUpdateProfile = useCallback(
    async (data: { username: string; email: string }) => {
      try {
        setLoading(true);
        setError("");
        await dispatch(updateProfile(data));
      } catch (err) {
        setError("Failed to update profile");
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
      if (e.type === "drop" || (e.target as HTMLInputElement).files) {
        const selectedFile =
          e.type === "drop"
            ? (e as React.DragEvent).dataTransfer.files[0]
            : (e.target as HTMLInputElement).files![0];
        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          try {
            setLoading(true);
            await dispatch(updateProfileImage(formData));
          } catch (err) {
            setError("Failed to upload image");
          } finally {
            setLoading(false);
          }
        }
      }
    },
    [dispatch]
  );

  const profileDisplay = useMemo(() => {
    return user?.profileImage
      ? user?.profileImage
      : user?.username?.slice(0, 2).toUpperCase();
  }, [user?.profileImage, user?.username]);

  // Styles for drag-and-drop area
  const dropZoneStyles = {
    border: "2px dashed #b3b3b3",
    padding: "20px",
    textAlign: "center" as const,
    borderRadius: "8px",
    cursor: "pointer",
  };

  return (
    <div className="bg-background">
      <DashboardHeader />
      <main className="p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              {profileDisplay && !user?.profileImage ? (
                <span className="text-xl font-bold text-gray-700">
                  {profileDisplay}
                </span>
              ) : (
                <img
                  src={user?.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>
            <div
              style={dropZoneStyles}
              onDrop={handleImageUpload}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <p>Choose a file or drag it here.</p>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Name</Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="Your name"
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Your email"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            onClick={handleSubmit(handleUpdateProfile)}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update Profile"
            )}
          </Button>
        </CardContent>
      </main>
    </div>
  );
}
