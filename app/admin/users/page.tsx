"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PageHeader } from "@/components/page-header";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = window.localStorage.getItem("user");

    if (!savedUser) {
      setIsAdmin(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser) as { role?: string };
      setIsAdmin(parsedUser.role?.toLowerCase() === "admin");
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/admin/users", { signal: controller.signal });
        const data = (await response.json()) as { error?: string; users?: AdminUser[] };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load users.");
        }

        setUsers(data.users ?? []);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setErrorMessage(fetchError instanceof Error ? fetchError.message : "Failed to load users.");
      } finally {
        setLoading(false);
      }
    }

    void loadUsers();

    return () => controller.abort();
  }, []);

  async function handleRoleChange(userId: number, role: string) {
    setUpdatingId(userId);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = (await response.json()) as { error?: string; message?: string; user?: AdminUser };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update role.");
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? { ...user, role: data.user?.role ?? role } : user))
      );
      setSuccessMessage(data.message ?? "Role updated successfully.");
    } catch (updateError) {
      setErrorMessage(updateError instanceof Error ? updateError.message : "Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AppShell activeHref="/admin/users">
      <PageHeader
        eyebrow="Administration"
        title="Admin Users"
        description="Review workspace access, roles, and onboarding status."
        actions={isAdmin ? <Button>Invite user</Button> : null}
      />

      {successMessage ? (
        <Card className="p-4">
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </Card>
      ) : null}

      {errorMessage ? (
        <Card className="p-4">
          <p className="text-sm font-medium text-rose-700">{errorMessage}</p>
        </Card>
      ) : null}

      {loading ? (
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-600">Loading users...</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Created At</span>
          </div>
          <div className="divide-y divide-slate-200">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-5 gap-4 px-6 py-4 text-sm text-slate-700">
                <span className="font-medium text-slate-950">{user.id}</span>
                <span className="font-medium text-slate-950">{user.name}</span>
                <span>{user.email}</span>
                <span>
                  {isAdmin ? (
                    <select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      disabled={updatingId === user.id}
                      className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-teal-500"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    <Badge variant={user.role === "admin" ? "teal" : "outline"}>{user.role}</Badge>
                  )}
                </span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AppShell>
  );
}