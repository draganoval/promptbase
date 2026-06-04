import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { Textarea } from "@/components/textarea";
import { getPromptBySlug } from "@/lib/mock-data";

type EditPromptPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EditPromptPageProps) {
  const { id } = await params;
  const prompt = getPromptBySlug(id);

  return {
    title: `Edit ${prompt.title}`,
  };
}

export default async function EditPromptPage({ params }: EditPromptPageProps) {
  const { id } = await params;
  const prompt = getPromptBySlug(id);

  return (
    <AppShell activeHref="/library">
      <PageHeader
        eyebrow="Prompt editor"
        title="Edit Prompt"
        description="Refine an existing prompt using the same structured layout."
        actions={
          <>
            <Button href={`/library/${prompt.slug}`} variant="secondary">
              Preview
            </Button>
            <Button>Save changes</Button>
          </>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Title</label>
              <Input defaultValue={prompt.title} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Category</label>
              <Input defaultValue={prompt.category} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Owner</label>
              <Input defaultValue={prompt.owner} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
              <Input defaultValue={prompt.status} />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Summary</label>
            <Textarea defaultValue={prompt.summary} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Prompt content</label>
            <Textarea rows={10} defaultValue={prompt.content} />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="text-sm font-medium text-slate-500">Version info</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>Prompt slug: {id}</p>
              <p>Last edited: {prompt.updatedAt}</p>
              <p>Current favorites: {prompt.favorites}</p>
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
    </AppShell>
  );
}