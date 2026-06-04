import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PromptCard } from "@/components/prompt-card";
import { mockPrompts, mockStats } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar showAuthActions />

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge variant="teal">AI prompt management for teams</Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Centralize the prompts your team actually uses.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  PromptBase helps office teams organize reusable prompts, track versions,
                  and keep high-performing workflows easy to find.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/register" size="lg">
                  Start free
                </Button>
                <Button href="/library" variant="secondary" size="lg">
                  Explore the library
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {mockStats.map((stat) => (
                <Card key={stat.label} className="p-5">
                  <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    {stat.value}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stat.description}</p>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-6">
                <div className="text-sm font-medium text-slate-500">
                  Why teams choose PromptBase
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <li>Reusable prompt templates for support, sales, and ops.</li>
                  <li>Consistent metadata, tags, and version history.</li>
                  <li>Fast search and favorites for everyday access.</li>
                </ul>
              </Card>
              <Card className="overflow-hidden p-0">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-600">
                  Team workflow snapshot
                </div>
                <div className="space-y-3 p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Published prompts</span>
                    <span className="font-medium text-slate-950">128</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Favorites this week</span>
                    <span className="font-medium text-slate-950">1,284</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Admin reviews</span>
                    <span className="font-medium text-slate-950">18 pending</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="space-y-6 p-6 lg:sticky lg:top-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">Featured prompts</p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                High-value prompts your team can reuse today.
              </h2>
            </div>
            <div className="space-y-4">
              {mockPrompts.slice(0, 3).map((prompt) => (
                <PromptCard key={prompt.slug} prompt={prompt} />
              ))}
            </div>
            <Button href="/library" variant="secondary" className="w-full">
              View full library
            </Button>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Organize",
              description: "Group prompts by team, category, status, and use case.",
            },
            {
              title: "Collaborate",
              description: "Share reliable prompt drafts across teams without losing context.",
            },
            {
              title: "Scale",
              description: "Keep a clean, searchable knowledge base as usage grows.",
            },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <Card className="flex flex-col gap-6 overflow-hidden bg-slate-950 p-8 text-white lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="max-w-2xl space-y-3">
            <Badge variant="outline" className="border-white/20 text-white">
              Ready for your workspace
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Launch PromptBase with a clean structure today.
            </h2>
            <p className="text-sm leading-6 text-slate-300 sm:text-base">
              You can start exploring the dashboard, prompt library, favorites, and admin screens immediately using the included mock data.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/login" variant="secondary" className="bg-white text-slate-950 hover:bg-slate-100">
              Log in
            </Button>
            <Button href="/dashboard" className="bg-emerald-500 text-white hover:bg-emerald-400">
              Open dashboard
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
