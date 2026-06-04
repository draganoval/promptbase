import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PageHeader } from "@/components/page-header";
import { PromptCard } from "@/components/prompt-card";
import { getPromptBySlug, mockPrompts } from "@/lib/mock-data";

type PromptDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PromptDetailsPageProps) {
  const { id } = await params;
  const prompt = getPromptBySlug(id);

  return {
    title: prompt.title,
  };
}

export default async function PromptDetailsPage({ params }: PromptDetailsPageProps) {
  const { id } = await params;
  const prompt = getPromptBySlug(id);

  if (!prompt) {
    notFound();
  }

  return (
    <AppShell activeHref="/library">
      <PageHeader
        eyebrow="Prompt details"
        title={prompt.title}
        description={prompt.summary}
        actions={
          <>
            <Button href={`/prompts/${prompt.slug}/edit`} variant="secondary">
              Edit prompt
            </Button>
            <Button href="/favorites">Save to favorites</Button>
          </>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6 p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="teal">{prompt.category}</Badge>
            <Badge variant="outline">{prompt.status}</Badge>
            <Badge variant="blue">{prompt.owner}</Badge>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Prompt content
            </h2>
            <p className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              {prompt.content}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">
              Recommended structure
            </h3>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {prompt.steps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-sm font-medium text-slate-500">Prompt metrics</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Usage</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{prompt.usage}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Favorites</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{prompt.favorites}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-slate-500">Tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-slate-500">Similar prompts</p>
            <div className="mt-4 space-y-4">
              {mockPrompts
                .filter((item) => item.slug !== prompt.slug)
                .slice(0, 2)
                .map((item) => (
                  <PromptCard key={item.slug} prompt={item} />
                ))}
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}