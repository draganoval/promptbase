import Link from "next/link";

import { Button } from "@/components/button";
import { primaryNavItems } from "@/lib/mock-data";

type NavbarProps = {
  activeHref?: string;
  showAuthActions?: boolean;
};

export function Navbar({ activeHref, showAuthActions = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/10">
            PB
          </span>
          <span className="space-y-0.5">
            <span className="block text-sm font-semibold tracking-tight text-slate-950">
              PromptBase
            </span>
            <span className="block text-xs text-slate-500">
              Prompt management for office teams
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryNavItems.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-950 !text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {showAuthActions ? (
            <>
              <Button href="/login" variant="ghost" className="hidden sm:inline-flex">
                Log in
              </Button>
              <Button href="/register">Start free</Button>
            </>
          ) : (
            <>
              <Button href="/prompts/new" className="hidden sm:inline-flex !text-white">
                Create prompt
              </Button>
              <Link
                href="/profile"
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white"
                aria-label="Open profile"
              >
                PB
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}