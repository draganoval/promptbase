import Link from "next/link";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
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

          <form className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">First name</label>
                <Input placeholder="Ava" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Last name</label>
                <Input placeholder="Chen" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Work email</label>
              <Input type="email" placeholder="name@company.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Password</label>
              <Input type="password" placeholder="Create a password" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Company</label>
              <Input placeholder="PromptBase" />
            </div>
            <Button type="submit" className="w-full">
              Create account
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