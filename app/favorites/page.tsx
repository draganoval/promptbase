import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { PromptCard } from "@/components/prompt-card";
import { favorites } from "@/lib/mock-data";

export const metadata = {
  title: "Favorites",
};

export default function FavoritesPage() {
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

      <section className="grid gap-4 xl:grid-cols-2">
        {favorites.map((prompt) => (
          <PromptCard key={prompt.slug} prompt={prompt} />
        ))}
      </section>
    </AppShell>
  );
}