"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { Textarea } from "@/components/textarea";

type AdminCategory = {
  id: number;
  name: string;
  description: string | null;
  promptCount: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = window.localStorage.getItem("user");

    if (!savedUser) {
      setIsAdmin(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser) as { role?: string };
      setIsAdmin(parsedUser.role?.toLowerCase() === "admin");
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/admin/categories", { signal: controller.signal });
        const data = (await response.json()) as { error?: string; categories?: AdminCategory[] };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load categories.");
        }

        setCategories(data.categories ?? []);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setErrorMessage(
          fetchError instanceof Error ? fetchError.message : "Failed to load categories."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCategories();

    return () => controller.abort();
  }, []);

  async function handleCreateCategory() {
    setCreating(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      const data = (await response.json()) as { error?: string; message?: string; category?: AdminCategory };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create category.");
      }

      setCategories((currentCategories) => [data.category ?? { id: Date.now(), name, description, promptCount: 0 }, ...currentCategories]);
      setSuccessMessage(data.message ?? "Category created successfully.");
      setName("");
      setDescription("");
    } catch (createError) {
      setErrorMessage(createError instanceof Error ? createError.message : "Failed to create category.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteCategory(categoryId: number) {
    setDeletingId(categoryId);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete category.");
      }

      setCategories((currentCategories) => currentCategories.filter((category) => category.id !== categoryId));
      setSuccessMessage(data.message ?? "Category deleted successfully.");
    } catch (deleteError) {
      setErrorMessage(deleteError instanceof Error ? deleteError.message : "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppShell activeHref="/admin/categories">
      <PageHeader
        eyebrow="Administration"
        title="Admin Categories"
        description="Manage the categories that keep the prompt library organized."
        actions={isAdmin ? <Button onClick={handleCreateCategory}>Create category</Button> : null}
      />

      {successMessage ? (
        <Card className="p-4">
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </Card>
      ) : null}

      {errorMessage ? (
        <Card className="p-4">
          <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
        </Card>
      ) : null}

      {isAdmin ? (
        <Card className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1.2fr_auto] lg:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Name</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Description</label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Category description"
            />
          </div>
          <div>
            <Button type="button" onClick={handleCreateCategory} disabled={creating}>
              {creating ? "Creating..." : "Create category"}
            </Button>
          </div>
        </Card>
      ) : null}

      {loading ? (
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Loading categories...</p>
        </Card>
      ) : categories.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-950">No categories found.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Add a category to organize prompts.</p>
        </Card>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {categories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {category.description ?? "No description provided."}
                  </p>
                </div>
                <Badge variant={category.promptCount > 0 ? "teal" : "outline"}>
                  {category.promptCount > 0 ? "In use" : "Unused"}
                </Badge>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Prompt count</span>
                <span className="font-semibold text-slate-950">{category.promptCount}</span>
              </div>

              {isAdmin ? (
                <div className="mt-4 flex justify-end">
                  {category.promptCount === 0 ? (
                    <Button
                      variant="secondary"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deletingId === category.id}
                    >
                      {deletingId === category.id ? "Deleting..." : "Delete category"}
                    </Button>
                  ) : (
                    <span className="text-xs font-medium text-slate-500">
                      This category is used by prompts.
                    </span>
                  )}
                </div>
              ) : null}
            </Card>
          ))}
        </section>
      )}
    </AppShell>
  );
}