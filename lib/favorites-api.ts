import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { categories, favorites, prompts, users } from "@/db/schema";
import { getFirstUserId } from "@/lib/prompt-api";

export type FavoritePromptRecord = {
  id: number;
  title: string;
  description: string | null;
  promptText: string;
  status: string;
  categoryId: number | null;
  authorId: number;
  createdAt: Date;
  categoryName: string | null;
  authorName: string | null;
  authorRole: string | null;
};

export async function getCurrentUserId() {
  return getFirstUserId();
}

export async function isPromptFavoritedByUser(userId: number, promptId: number) {
  const [favoriteRecord] = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.promptId, promptId)))
    .limit(1);

  return Boolean(favoriteRecord);
}

export async function getFavoritePromptsForUser(userId: number) {
  return db
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
      authorRole: users.role,
    })
    .from(favorites)
    .innerJoin(prompts, eq(favorites.promptId, prompts.id))
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .leftJoin(users, eq(prompts.authorId, users.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));
}

export async function addFavoriteForUser(userId: number, promptId: number) {
  const [existingFavorite] = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.promptId, promptId)))
    .limit(1);

  if (existingFavorite) {
    return { id: existingFavorite.id, created: false };
  }

  const [createdFavorite] = await db
    .insert(favorites)
    .values({ userId, promptId })
    .returning({ id: favorites.id });

  return { id: createdFavorite.id, created: true };
}

export async function removeFavoriteForUser(userId: number, promptId: number) {
  const [deletedFavorite] = await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.promptId, promptId)))
    .returning({ id: favorites.id });

  return deletedFavorite ?? null;
}