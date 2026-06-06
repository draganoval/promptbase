"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to register user.");
      }

      setSuccessMessage(data.message ?? "Registration successful. Redirecting to dashboard...");
      window.setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to register user.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="order-2 p-8 lg:order-1">
          <Badge variant="teal">Create your workspace</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Register for PromptBase
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start organizing prompts with a clean workspace, simple permissions, and a polished team-ready interface.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Name</label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ava Chen"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
              />
            </div>
            {errorMessage ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </p>
            ) : null}
            {successMessage ? (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {successMessage}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-teal-700 hover:text-teal-800">
              Sign in
            </Link>
          </p>
        </Card>

        <Card className="order-1 overflow-hidden p-0 lg:order-2">
          <div className="flex h-full min-h-[520px] flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 p-8 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                Built for teams
              </p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight">
                A polished SaaS foundation for prompt operations.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-100">
                Give your team a shared prompt library, admin controls, and a clean place to work with AI-generated content.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Fast onboarding",
                "Shared favorites",
                "Admin oversight",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-white/15 bg-white/5 p-4 text-sm text-white">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}