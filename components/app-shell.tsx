import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

type AppShellProps = {
  activeHref?: string;
  children: React.ReactNode;
};

export function AppShell({ activeHref, children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <Navbar activeHref={activeHref} />
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-8">
        <Sidebar activeHref={activeHref} />
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}