"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { Category } from "@/lib/types";
import {
  updateCategory,
  deleteCategory,
  createCategory,
  fetchCategories,
} from "@/lib/store/slices/categoriesSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea"; // For the description
import { useState, useEffect, useCallback } from "react";
import { MoreVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

export default function CategoriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreateCategory = useCallback(
    async (data: z.infer<typeof categorySchema>) => {
      try {
        const { name, description } = data;
        const descriptionToSend = description || "";

        if (editingCategory && editingCategory._id) {
          await dispatch(
            updateCategory({
              id: editingCategory._id,
              name,
              description: descriptionToSend,
            })
          ).unwrap();
        } else {
          await dispatch(
            createCategory({ name, description: descriptionToSend })
          ).unwrap();
        }

        await dispatch(fetchCategories());
        setIsCreateOpen(false);
        setEditingCategory(null);
        reset();
      } catch (error) {
        console.error("Failed to create or update category", error);
      }
    },
    [dispatch, editingCategory, reset]
  );

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsCreateOpen(true);
  }, []);

  const handleDeleteCategory = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        await dispatch(fetchCategories());
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    },
    [dispatch]
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Categories</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  {editingCategory ? "Edit Category" : "New Category"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(handleCreateCategory)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      {...register("name")}
                      placeholder="Enter category name"
                      defaultValue={editingCategory?.name || ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message as string}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">
                      Category Description
                    </Label>
                    <Textarea
                      id="categoryDescription"
                      {...register("description")}
                      placeholder="Enter category description (optional)"
                      defaultValue={editingCategory?.description || ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">
                        {errors.description?.message as string}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    {editingCategory ? "Update Category" : "Create Category"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories && categories.length > 0 ? (
              categories.map((category) =>
                category ? (
                  <Card key={category._id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {category?.name || "Unknown Name"}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {category?.description ||
                              "No description available"}
                          </CardDescription>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditCategory(category)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteCategory(category._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{category?.description}</CardDescription>
                    </CardContent>
                  </Card>
                ) : null
              )
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                <p>
                  No categories found. Create your first category to get
                  started!
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
