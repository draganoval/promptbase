"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { PromptCard } from "@/components/prompt-card";
import type { Prompt } from "@/lib/mock-data";

type ApiPrompt = {
  id: number;
  title: string;
  description: string | null;
  promptText: string;
  status: string;
  categoryId: number;
  authorId: number;
  createdAt: string;
  categoryName: string | null;
  authorName: string | null;
};

function formatUpdatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Updated recently";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `Updated ${Math.max(diffMinutes, 1)} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  if (diffHours < 24) {
    return `Updated ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  if (diffDays < 7) {
    return `Updated ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return `Updated on ${date.toLocaleDateString()}`;
}

function toLibraryPrompt(prompt: ApiPrompt): Prompt {
  const category = prompt.categoryName ?? "Uncategorized";
  const owner = prompt.authorName ?? "Unknown";

  return {
    slug: String(prompt.id),
    title: prompt.title,
    summary: prompt.description ?? prompt.promptText.slice(0, 120),
    category,
    status: prompt.status,
    owner,
    updatedAt: formatUpdatedAt(prompt.createdAt),
    favorites: 0,
    usage: 0,
    tags: [category.toLowerCase()],
    content: prompt.promptText,
    steps: prompt.description ? [prompt.description] : [prompt.promptText],
  };
}

export default function LibraryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPrompts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/prompts?page=1&limit=20", {
          signal: controller.signal,
        });

        const data = (await response.json()) as {
          error?: string;
          items?: ApiPrompt[];
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load prompts.");
        }

        setPrompts((data.items ?? []).map(toLibraryPrompt));
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : "Failed to load prompts.");
      } finally {
        setLoading(false);
      }
    }

    void loadPrompts();

    return () => controller.abort();
  }, []);

  return (
    <AppShell activeHref="/library">
      <PageHeader
        eyebrow="Library"
        title="Prompt Library"
        description="Search, filter, and reuse the team prompts that are already working well."
        actions={
          <>
            <Button href="/prompts/new">Create prompt</Button>
            <Button href="/favorites" variant="secondary">
              Favorites
            </Button>
          </>
        }
      />

      <Card className="grid gap-4 p-5 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] lg:items-end">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Search</label>
          <Input placeholder="Search prompts, tags, categories..." />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Category</label>
          <Input placeholder="All categories" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Owner</label>
          <Input placeholder="All owners" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
          <Input placeholder="Published / Draft / Review" />
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {["All", "Operations", "Customer Success", "Support", "Product", "HR"].map((filter, index) => (
          <Badge key={filter} variant={index === 0 ? "teal" : "outline"}>
            {filter}
          </Badge>
        ))}
      </div>

      {loading ? (
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Loading prompts...</p>
          <div className="mt-4 space-y-3">
            <div className="h-5 w-2/3 rounded-full bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100" />
          </div>
        </Card>
      ) : error ? (
        <Card className="p-6">
          <p className="text-sm font-semibold text-rose-700">Unable to load prompts.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setLoading(true);
                setError("");
                void (async () => {
                  try {
                    const response = await fetch("/api/prompts?page=1&limit=20");
                    const data = (await response.json()) as { error?: string; items?: ApiPrompt[] };

                    if (!response.ok) {
                      throw new Error(data.error ?? "Failed to load prompts.");
                    }

                    setPrompts((data.items ?? []).map(toLibraryPrompt));
                  } catch (retryError) {
                    setError(
                      retryError instanceof Error ? retryError.message : "Failed to load prompts."
                    );
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
            >
              Retry
            </Button>
          </div>
        </Card>
      ) : prompts.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-950">No prompts found.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create the first prompt to start building the library.
          </p>
        </Card>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </section>
      )}
    </AppShell>
  );
}