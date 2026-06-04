import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <AppShell activeHref="/profile">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your personal details, preferences, and prompt activity."
        actions={<Button variant="secondary">Save profile</Button>}
      />

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-lg font-semibold text-white">
              PB
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Priya Morgan
              </h2>
              <p className="text-sm text-slate-500">Operations Manager</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            <p>Workspace: PromptBase Enterprise</p>
            <p>Role: Editor</p>
            <p>Timezone: GMT-5</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="teal">Active</Badge>
            <Badge variant="outline">Weekly digest</Badge>
          </div>
        </Card>

        <Card className="space-y-6 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">First name</label>
              <Input defaultValue="Priya" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Last name</label>
              <Input defaultValue="Morgan" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
              <Input defaultValue="priya@promptbase.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Department</label>
              <Input defaultValue="Operations" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Theme</label>
              <Input defaultValue="Light" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Notifications</label>
              <Input defaultValue="Email digest" />
            </div>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}