"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { primaryNavItems } from "@/lib/mock-data";

type NavbarProps = {
  activeHref?: string;
  showAuthActions?: boolean;
};

export function Navbar({ activeHref, showAuthActions = false }: NavbarProps) {
  const router = useRouter();
  const [initials, setInitials] = useState("U");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  const isAdmin = role?.toLowerCase() === "admin";

  useEffect(() => {
    const savedToken = window.localStorage.getItem("token");
    const savedUser = window.localStorage.getItem("user");

    if (!savedToken || !savedUser) {
      setHasSession(false);
      setRole(null);
      setUserName(null);
      setUserEmail(null);
      setInitials("U");
      return;
    }

    setHasSession(true);

    try {
      const parsedUser = JSON.parse(savedUser) as { name?: string; email?: string; role?: string };
      const source = parsedUser.name?.trim() || parsedUser.email?.trim() || "U";
      const parts = source.split(/\s+/).filter(Boolean);
      const derivedInitials =
        parts.length >= 2
          ? `${parts[0][0]}${parts[1][0]}`
          : source.slice(0, 2);

      setInitials(derivedInitials.toUpperCase());
      setUserName(parsedUser.name?.trim() ?? null);
      setUserEmail(parsedUser.email?.trim() ?? null);
      setRole(parsedUser.role ?? null);
    } catch {
      setInitials("U");
      setUserName(null);
      setUserEmail(null);
      setRole(null);
      setHasSession(false);
    }
  }, []);

  function handleLogout() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    setHasSession(false);
    setInitials("U");
    setUserName(null);
    setUserEmail(null);
    setRole(null);
    router.push("/login");
  }

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
          {showAuthActions || !hasSession ? (
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
              {isAdmin ? (
                <>
                  <Link
                    href="/admin/users"
                    className={`hidden rounded-full px-4 py-2 text-sm font-medium transition-colors lg:inline-flex ${
                      activeHref === "/admin/users"
                        ? "bg-slate-950 !text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    Admin Users
                  </Link>
                  <Link
                    href="/admin/categories"
                    className={`hidden rounded-full px-4 py-2 text-sm font-medium transition-colors lg:inline-flex ${
                      activeHref === "/admin/categories"
                        ? "bg-slate-950 !text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    Admin Categories
                  </Link>
                </>
              ) : null}
              <div className="ml-2 flex shrink-0 items-center gap-2 whitespace-nowrap pr-1 sm:pr-0">
                <Link
                  href="/profile"
                  className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-[11px] font-semibold text-white shadow-sm shadow-slate-950/10"
                  aria-label="Open profile"
                >
                  {initials}
                </Link>
                <div className="hidden min-w-0 lg:block">
                  <p className="truncate text-sm font-medium text-slate-950">{userName ?? userEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-950 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}