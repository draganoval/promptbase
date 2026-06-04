import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { PromptCard } from "@/components/prompt-card";
import { mockPrompts } from "@/lib/mock-data";

export const metadata = {
  title: "Prompt Library",
};

export default function LibraryPage() {
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

      <section className="grid gap-4 xl:grid-cols-2">
        {mockPrompts.map((prompt) => (
          <PromptCard key={prompt.slug} prompt={prompt} />
        ))}
      </section>
    </AppShell>
  );
}