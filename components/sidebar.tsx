import Link from "next/link";

import { Badge } from "@/components/badge";
import { adminNavItems, primaryNavItems } from "@/lib/mock-data";

type SidebarProps = {
  activeHref?: string;
};

export function Sidebar({ activeHref }: SidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Workspace
          </p>
          <nav className="mt-4 space-y-1">
            {primaryNavItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <Badge variant="outline" className="border-white/20 text-white">
                      Active
                    </Badge>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Administration
          </p>
          <nav className="mt-4 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}