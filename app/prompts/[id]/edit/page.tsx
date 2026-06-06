"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { Textarea } from "@/components/textarea";

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
};

function getPromptId(param: string | string[] | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  return value ?? "";
}

export default function EditPromptPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = getPromptId(params.id);

  const [prompt, setPrompt] = useState<PromptDetails | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        setTitle(data.prompt.title);
        setDescription(data.prompt.description ?? "");
        setPromptText(data.prompt.promptText);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setErrorMessage("Invalid prompt id.");
      return;
    }

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          promptText,
          categoryId: 1,
          status: prompt?.status ?? "published",
        }),
      });

      const data = (await response.json()) as { error?: string; message?: string; prompt?: PromptDetails };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update prompt.");
      }

      setPrompt(data.prompt ?? prompt);
      setSuccessMessage(data.message ?? "Prompt updated successfully.");
    } catch (saveError) {
      setErrorMessage(saveError instanceof Error ? saveError.message : "Failed to update prompt.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell activeHref="/library">
      <PageHeader
        eyebrow="Prompt editor"
        title="Edit Prompt"
        description="Refine an existing prompt using the same structured layout."
        actions={
          <>
            <Button href={prompt ? `/library/${prompt.id}` : "/library"} variant="secondary">
              Preview
            </Button>
            <Button form="edit-prompt-form" type="submit" disabled={saving || loading}>
              {saving ? "Saving..." : "Save changes"}
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
          <div className="mt-4">
            <Button variant="secondary" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : prompt ? (
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <form id="edit-prompt-form" className="space-y-6" onSubmit={handleSubmit}>
            <Card className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Title</label>
                  <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Category</label>
                  <Input value={prompt.categoryName ?? "Category 1"} readOnly />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Owner</label>
                  <Input value={prompt.authorName ?? "Assigned owner"} readOnly />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
                  <Input value={prompt.status} readOnly />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Summary</label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Prompt content</label>
                <Textarea
                  rows={10}
                  value={promptText}
                  onChange={(event) => setPromptText(event.target.value)}
                />
              </div>

              {successMessage ? (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {successMessage}
                </p>
              ) : null}

              {errorMessage ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {errorMessage}
                </p>
              ) : null}
            </Card>
          </form>

          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-sm font-medium text-slate-500">Version info</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>Prompt slug: {id}</p>
                <p>Last edited: {new Date(prompt.createdAt).toLocaleString()}</p>
                <p>Current category: {prompt.categoryName ?? "Category 1"}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                Editing checklist
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Keep the title specific and reusable.</li>
                <li>Preserve any language that defines the expected output.</li>
                <li>Update tags when the prompt scope changes.</li>
              </ul>
            </Card>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
