import { asc, desc, eq, count } from "drizzle-orm";

import { db } from "@/db";
import { categories, prompts, users } from "@/db/schema";

export type PromptInput = {
  title?: string;
  description?: string | null;
  promptText?: string;
  categoryId?: number;
  status?: string;
};

export type PromptRecord = typeof prompts.$inferSelect;

export function normalizePromptInput(body: unknown): PromptInput {
  if (!body || typeof body !== "object") {
    return {};
  }

  const data = body as Record<string, unknown>;

  return {
    title: typeof data.title === "string" ? data.title.trim() : undefined,
    description:
      typeof data.description === "string"
        ? data.description.trim()
        : data.description === null
          ? null
          : undefined,
    promptText: typeof data.promptText === "string" ? data.promptText.trim() : undefined,
    categoryId:
      typeof data.categoryId === "number"
        ? data.categoryId
        : typeof data.categoryId === "string" && data.categoryId.trim()
          ? Number(data.categoryId)
          : undefined,
    status: typeof data.status === "string" ? data.status.trim() : undefined,
  };
}

export function validatePromptInput(input: PromptInput) {
  if (!input.title) {
    return "Title is required.";
  }

  if (!input.promptText) {
    return "Prompt text is required.";
  }

  if (!input.categoryId || Number.isNaN(input.categoryId)) {
    return "Category ID is required.";
  }

  return null;
}

export async function getFirstUserId() {
  const [user] = await db.select({ id: users.id }).from(users).orderBy(asc(users.id)).limit(1);
  return user?.id ?? null;
}

export async function ensureCategoryExists(categoryId: number) {
  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  return Boolean(category);
}

export async function getPromptById(id: number) {
  const [prompt] = await db
    .select({
      id: prompts.id,
      title: prompts.title,
      description: prompts.description,
      promptText: prompts.promptText,
      status: prompts.status,
      categoryId: prompts.categoryId,
      authorId: prompts.authorId,
      createdAt: prompts.createdAt,
      categoryName: categories.name,
      authorName: users.name,
      authorEmail: users.email,
      authorRole: users.role,
    })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .leftJoin(users, eq(prompts.authorId, users.id))
    .where(eq(prompts.id, id))
    .limit(1);

  return prompt ?? null;
}

export async function listPrompts(page: number, limit: number) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 10;
  const offset = (safePage - 1) * safeLimit;

  const [totalRow] = await db.select({ total: count() }).from(prompts);

  const items = await db
    .select({
      id: prompts.id,
      title: prompts.title,
      description: prompts.description,
      promptText: prompts.promptText,
      status: prompts.status,
      categoryId: prompts.categoryId,
      authorId: prompts.authorId,
      createdAt: prompts.createdAt,
      categoryName: categories.name,
      authorName: users.name,
      authorEmail: users.email,
      authorRole: users.role,
    })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .leftJoin(users, eq(prompts.authorId, users.id))
    .orderBy(desc(prompts.createdAt))
    .limit(safeLimit)
    .offset(offset);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: totalRow?.total ?? 0,
      totalPages: Math.max(1, Math.ceil((totalRow?.total ?? 0) / safeLimit)),
    },
  };
}
