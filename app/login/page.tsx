"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";

export default function LoginPage() {
  const router = useRouter();
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        token?: string;
        user?: unknown;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to login.");
      }

      if (typeof window !== "undefined") {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      setSuccessMessage(data.message ?? "Login successful. Redirecting to dashboard...");
      window.setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to login.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="order-2 p-8 lg:order-1">
          <Badge variant="teal">Welcome back</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Sign in to PromptBase
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Access your workspace, review team prompts, and keep favorite prompts at your fingertips.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-teal-600" />
                Remember me
              </label>
              <Link href="#" className="font-medium text-teal-700 hover:text-teal-800">
                Forgot password?
              </Link>
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
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            New to PromptBase?{" "}
            <Link href="/register" className="font-medium text-teal-700 hover:text-teal-800">
              Create an account
            </Link>
          </p>
        </Card>

        <Card className="order-1 overflow-hidden p-0 lg:order-2">
          <div className="flex h-full min-h-[520px] flex-col justify-between bg-slate-950 p-8 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                PromptBase
              </p>
              <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-tight">
                A calm, structured workspace for prompt operations.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-100">
                Organize reusable prompt assets, keep your team aligned, and build a reliable internal knowledge base.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Workspace ready",
                "Role-aware views",
                "Responsive by default",
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