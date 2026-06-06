"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { Textarea } from "@/components/textarea";

export default function CreatePromptPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          promptText,
          categoryId: 1,
          status: "published",
        }),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create prompt.");
      }

      setSuccessMessage(data.message ?? "Prompt created successfully.");
      setTitle("");
      setDescription("");
      setPromptText("");
      router.push("/library");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create prompt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell activeHref="/library">
      <PageHeader
        eyebrow="Prompt editor"
        title="Create Prompt"
        description="Draft a new reusable prompt using a clean, guided layout."
        actions={
          <>
            <Button href="/library" variant="secondary">
              Cancel
            </Button>
            <Button form="create-prompt-form" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save prompt"}
            </Button>
          </>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form id="create-prompt-form" className="space-y-6" onSubmit={handleSubmit}>
          <Card className="space-y-6 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Title</label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Prompt title"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Category</label>
                <Input placeholder="Select category" value="Category 1" readOnly />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Owner</label>
                <Input placeholder="Assigned owner" readOnly />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
                <Input placeholder="Draft / Review / Published" value="Published" readOnly />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Summary</label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short description of the prompt purpose"
                disabled={loading}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Prompt content</label>
              <Textarea
                rows={10}
                value={promptText}
                onChange={(event) => setPromptText(event.target.value)}
                placeholder="Write the actual prompt instructions here"
                disabled={loading}
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
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              Tips for a strong prompt
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Keep the instruction clear and directly actionable.</li>
              <li>Include the expected tone, format, and output shape.</li>
              <li>Add a few tags so the prompt is easy to find later.</li>
            </ul>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-slate-500">Next steps</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>Review the draft with the team before publishing.</p>
              <p>Capture a short example response to set expectations.</p>
              <p>Mark the prompt as a favorite if it becomes a standard.</p>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}