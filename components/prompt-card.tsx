import Link from "next/link";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import type { Prompt } from "@/lib/mock-data";

type PromptCardProps = {
  prompt: Prompt;
  href?: string;
};

export function PromptCard({ prompt, href = `/library/${prompt.slug}` }: PromptCardProps) {
  return (
    <Card className="group p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-35px_rgba(15,23,42,0.3)]">
      <Link href={href} className="block space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="teal">{prompt.category}</Badge>
              <Badge variant="outline">{prompt.status}</Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                {prompt.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{prompt.summary}</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {prompt.updatedAt}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500">
          <div>
            <span className="font-medium text-slate-900">{prompt.owner}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{prompt.favorites} favorites</span>
            <span>{prompt.usage} uses</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}