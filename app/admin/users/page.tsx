import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PageHeader } from "@/components/page-header";
import { users } from "@/lib/mock-data";

export const metadata = {
  title: "Admin Users",
};

export default function AdminUsersPage() {
  return (
    <AppShell activeHref="/admin/users">
      <PageHeader
        eyebrow="Administration"
        title="Admin Users"
        description="Review workspace access, roles, and onboarding status."
        actions={<Button>Invite user</Button>}
      />

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span>Name</span>
          <span>Role</span>
          <span>Team</span>
          <span>Prompt count</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-slate-200">
          {users.map((user) => (
            <div key={user.name} className="grid grid-cols-5 gap-4 px-6 py-4 text-sm text-slate-700">
              <span className="font-medium text-slate-950">{user.name}</span>
              <span>{user.role}</span>
              <span>{user.team}</span>
              <span>{user.prompts}</span>
              <span>
                <Badge variant={user.status === "Active" ? "teal" : "outline"}>
                  {user.status}
                </Badge>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}