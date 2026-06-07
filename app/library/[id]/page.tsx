"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PageHeader } from "@/components/page-header";
import { PromptCard } from "@/components/prompt-card";
import { mockPrompts } from "@/lib/mock-data";

type PromptDetails = {
  id: number;
  title: string;
  description: string | null;
  promptText: string;
  status: string;
  categoryId: number;
  createdAt: string;
  categoryName: string | null;
  authorName: string | null;
  authorRole: string | null;
  isFavorited?: boolean;
};

function getPromptId(param: string | string[] | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  return value ?? "";
}

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

export default function PromptDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = getPromptId(params.id);

  const [prompt, setPrompt] = useState<PromptDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setErrorMessage("Invalid prompt id.");
      return;
    }

    const controller = new AbortController();

    async function loadPrompt() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/prompts/${id}`, { signal: controller.signal });
        const data = (await response.json()) as { error?: string; prompt?: PromptDetails };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load prompt.");
        }

        if (!data.prompt) {
          throw new Error("Prompt not found.");
        }

        setPrompt(data.prompt);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setErrorMessage(fetchError instanceof Error ? fetchError.message : "Failed to load prompt.");
      } finally {
        setLoading(false);
      }
    }

    void loadPrompt();

    return () => controller.abort();
  }, [id]);

  async function handleDelete() {
    if (!id) {
      setErrorMessage("Invalid prompt id.");
      return;
    }

    setDeleting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete prompt.");
      }

      setSuccessMessage(data.message ?? "Prompt deleted successfully.");
      router.push("/library");
    } catch (deleteError) {
      setErrorMessage(deleteError instanceof Error ? deleteError.message : "Failed to delete prompt.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleFavoriteToggle() {
    if (!prompt) {
      return;
    }

    setFavoriting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        prompt.isFavorited ? `/api/favorites/${prompt.id}` : "/api/favorites",
        prompt.isFavorited
          ? {
              method: "DELETE",
            }
          : {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ promptId: prompt.id }),
            }
      );

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update favorite state.");
      }

      setPrompt((currentPrompt) =>
        currentPrompt ? { ...currentPrompt, isFavorited: !currentPrompt.isFavorited } : currentPrompt
      );
      setSuccessMessage(data.message ?? "Favorite updated successfully.");
    } catch (favoriteError) {
      setErrorMessage(
        favoriteError instanceof Error ? favoriteError.message : "Unable to update favorite state."
      );
    } finally {
      setFavoriting(false);
    }
  }

  const promptCard = prompt
    ? {
        slug: String(prompt.id),
        title: prompt.title,
        summary: prompt.description ?? prompt.promptText.slice(0, 120),
        category: prompt.categoryName ?? "Uncategorized",
        status: prompt.status,
        owner: prompt.authorName ?? "Unknown",
        updatedAt: formatUpdatedAt(prompt.createdAt),
        favorites: 0,
        usage: 0,
        tags: [prompt.categoryName ?? "uncategorized"],
        content: prompt.promptText,
        steps: prompt.description ? [prompt.description] : [prompt.promptText],
      }
    : null;

  return (
    <AppShell activeHref="/library">
      <PageHeader
        eyebrow="Prompt details"
        title={prompt?.title ?? "Prompt details"}
        description={prompt?.description ?? "Review and manage this prompt."}
        actions={
          <>
            <Button href={prompt ? `/prompts/${prompt.id}/edit` : "/library"} variant="secondary">
              Edit prompt
            </Button>
            <Button onClick={handleFavoriteToggle} disabled={favoriting || loading} variant="secondary">
              {favoriting
                ? "Saving..."
                : prompt?.isFavorited
                  ? "Unfavorite prompt"
                  : "Favorite prompt"}
            </Button>
            <Button onClick={handleDelete} disabled={deleting || loading}>
              {deleting ? "Deleting..." : "Delete prompt"}
            </Button>
          </>
        }
      />

      {loading ? (
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Loading prompt...</p>
          <div className="mt-4 space-y-3">
            <div className="h-5 w-1/2 rounded-full bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100" />
          </div>
        </Card>
      ) : errorMessage ? (
        <Card className="p-6">
          <p className="text-sm font-semibold text-rose-700">Unable to load prompt.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{errorMessage}</p>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" onClick={() => router.refresh()}>
              Retry
            </Button>
            <Button href="/library" variant="secondary">
              Back to library
            </Button>
          </div>
        </Card>
      ) : prompt && promptCard ? (
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="space-y-6 p-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="teal">{prompt.categoryName ?? "Uncategorized"}</Badge>
              <Badge variant="outline">{prompt.status}</Badge>
              <Badge variant="blue">{prompt.authorName ?? "Unknown"}</Badge>
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Prompt content
              </h2>
              <p className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                {prompt.promptText}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                Recommended structure
              </h3>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {(prompt.description ? [prompt.description] : [prompt.promptText]).map(
                  (step, index) => (
                    <li key={step} className="flex gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  )
                )}
              </ol>
            </div>

            {successMessage ? (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {successMessage}
              </p>
            ) : null}
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-sm font-medium text-slate-500">Prompt metrics</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Usage</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">0</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Favorites</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">0</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-medium text-slate-500">Tags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">#{prompt.categoryName ?? "uncategorized"}</Badge>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-sm font-medium text-slate-500">Similar prompts</p>
              <div className="mt-4 space-y-4">
                {mockPrompts
                  .filter((item) => item.slug !== String(prompt.id))
                  .slice(0, 2)
                  .map((item) => (
                    <PromptCard key={item.slug} prompt={item} />
                  ))}
              </div>
            </Card>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}