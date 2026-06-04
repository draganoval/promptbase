import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { Textarea } from "@/components/textarea";

export const metadata = {
  title: "Create Prompt",
};

export default function CreatePromptPage() {
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
            <Button>Save prompt</Button>
          </>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Title</label>
              <Input placeholder="Prompt title" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Category</label>
              <Input placeholder="Select category" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Owner</label>
              <Input placeholder="Assigned owner" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
              <Input placeholder="Draft / Review / Published" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Summary</label>
            <Textarea placeholder="Short description of the prompt purpose" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Prompt content</label>
            <Textarea rows={10} placeholder="Write the actual prompt instructions here" />
          </div>
        </Card>

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