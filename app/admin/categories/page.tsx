import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";
import { categories } from "@/lib/mock-data";

export const metadata = {
  title: "Admin Categories",
};

export default function AdminCategoriesPage() {
  return (
    <AppShell activeHref="/admin/categories">
      <PageHeader
        eyebrow="Administration"
        title="Admin Categories"
        description="Manage the categories that keep the prompt library organized."
        actions={<Button>Create category</Button>}
      />

      <Card className="grid gap-4 p-5 lg:grid-cols-[1.4fr_repeat(2,minmax(0,1fr))] lg:items-end">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Search</label>
          <Input placeholder="Search categories" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Owner</label>
          <Input placeholder="Any owner" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Status</label>
          <Input placeholder="Active / archived" />
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        {categories.map((category) => (
          <Card key={category.name} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Managed by {category.owner}
                </p>
              </div>
              <Badge variant="outline">{category.color}</Badge>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span>Prompt count</span>
              <span className="font-semibold text-slate-950">{category.prompts}</span>
            </div>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}