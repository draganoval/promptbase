"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { PageHeader } from "@/components/page-header";

type StoredUser = {
  name?: string;
  email?: string;
  role?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const savedUser = window.localStorage.getItem("user");

    if (!savedUser) {
      setUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser) as StoredUser;
      setUser(parsedUser);
    } catch {
      setUser(null);
    }
  }, []);

  const hasUser = Boolean(user);
  const displayName = user?.name?.trim() || user?.email?.trim() || "User";
  const displayEmail = user?.email?.trim() || "No email saved";
  const nameParts = displayName.split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}` : displayName.slice(0, 2);

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
              {initials.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                {hasUser ? displayName : "User"}
              </h2>
              <p className="text-sm text-slate-500">{hasUser ? displayEmail : "No email saved"}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            <p>Workspace: PromptBase Enterprise</p>
            <p>Role: {user?.role ?? "user"}</p>
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
              <Input defaultValue={hasUser ? displayName.split(/\s+/)[0] ?? "" : ""} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Last name</label>
              <Input defaultValue={hasUser ? displayName.split(/\s+/)[1] ?? "" : ""} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
              <Input defaultValue={hasUser ? displayEmail : ""} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Department</label>
              <Input defaultValue="" />
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