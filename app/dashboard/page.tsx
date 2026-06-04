import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PageHeader } from "@/components/page-header";
import { PromptCard } from "@/components/prompt-card";
import { dashboardHighlights, mockPrompts, mockStats } from "@/lib/mock-data";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <AppShell activeHref="/dashboard">
      <PageHeader
        eyebrow="Workspace"
        title="Dashboard"
        description="Track the prompts your team relies on, review activity, and jump into the most important actions."
        actions={
          <>
            <Button href="/library" variant="secondary">
              Browse library
            </Button>
            <Button href="/prompts/new">Create prompt</Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        {mockStats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {stat.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{stat.description}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Top prompts</p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Frequently used this week
              </h2>
            </div>
            <Badge variant="teal">Live</Badge>
          </div>
          <div className="mt-6 space-y-4">
            {mockPrompts.slice(0, 3).map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-slate-500">Team notes</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Activity at a glance
          </h2>
          <div className="mt-6 space-y-3">
            {dashboardHighlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}