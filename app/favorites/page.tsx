"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PageHeader } from "@/components/page-header";
import { PromptCard } from "@/components/prompt-card";
import type { Prompt } from "@/lib/mock-data";

type FavoritePromptResponse = {
  id: number;
  title: string;
  description: string | null;
  promptText: string;
  status: string;
  categoryId: number | null;
  authorId: number;
  createdAt: string;
  categoryName: string | null;
  authorName: string | null;
  authorRole: string | null;
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

function toPromptCard(prompt: FavoritePromptResponse): Prompt {
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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFavorites() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/favorites", { signal: controller.signal });
        const data = (await response.json()) as {
          error?: string;
          favorites?: FavoritePromptResponse[];
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load favorites.");
        }

        setFavorites((data.favorites ?? []).map(toPromptCard));
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setErrorMessage(
          fetchError instanceof Error ? fetchError.message : "Failed to load favorites."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadFavorites();

    return () => controller.abort();
  }, []);

  return (
    <AppShell activeHref="/favorites">
      <PageHeader
        eyebrow="Saved prompts"
        title="Favorites"
        description="Access the prompts your team saves most often."
        actions={
          <>
            <Button href="/library" variant="secondary">
              Back to library
            </Button>
            <Button href="/prompts/new">Create prompt</Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="teal">High-use</Badge>
        <Badge variant="outline">Recent</Badge>
        <Badge variant="outline">Team favorites</Badge>
      </div>

      {loading ? (
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Loading favorites...</p>
          <div className="mt-4 space-y-3">
            <div className="h-5 w-2/3 rounded-full bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100" />
          </div>
        </Card>
      ) : errorMessage ? (
        <Card className="p-6">
          <p className="text-sm font-semibold text-rose-700">Unable to load favorites.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{errorMessage}</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : favorites.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-950">No favorites yet.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Save a prompt from the library to see it here.
          </p>
        </Card>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {favorites.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </section>
      )}
    </AppShell>
  );
}