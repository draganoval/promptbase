import { asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { categories, prompts, users } from "@/db/schema";

export type AdminUserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export type AdminCategoryRecord = {
  id: number;
  name: string;
  description: string | null;
  promptCount: number;
};

export async function listAdminUsers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.id));
}

export async function listAdminCategories() {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description,
      promptCount: count(prompts.id),
    })
    .from(categories)
    .leftJoin(prompts, eq(prompts.categoryId, categories.id))
    .groupBy(categories.id, categories.name, categories.description)
    .orderBy(asc(categories.id));

  return rows.map((row) => ({
    ...row,
    promptCount: Number(row.promptCount),
  }));
}

export async function createAdminCategory(name: string, description: string | null) {
  const [createdCategory] = await db
    .insert(categories)
    .values({ name, description })
    .returning({ id: categories.id, name: categories.name, description: categories.description });

  return createdCategory;
}

export async function getCategoryPromptCount(categoryId: number) {
  const [row] = await db
    .select({ promptCount: count(prompts.id) })
    .from(prompts)
    .where(eq(prompts.categoryId, categoryId));

  return Number(row?.promptCount ?? 0);
}

export async function deleteAdminCategory(categoryId: number) {
  const promptCount = await getCategoryPromptCount(categoryId);

  if (promptCount > 0) {
    return { deleted: false, promptCount };
  }

  const [deletedCategory] = await db
    .delete(categories)
    .where(eq(categories.id, categoryId))
    .returning({ id: categories.id });

  return { deleted: Boolean(deletedCategory), promptCount };
}
