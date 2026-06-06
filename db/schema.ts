import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: text("password").notNull(),
    role: varchar("role", { length: 50 }).notNull().default("user"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
});

export const prompts = pgTable(
  "prompts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    promptText: text("prompt_text").notNull(),
    status: varchar("status", { length: 50 }).notNull().default("published"),
    categoryId: integer("category_id").references(() => categories.id),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("prompts_category_idx").on(table.categoryId),
    authorIdx: index("prompts_author_idx").on(table.authorId),
  })
);

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    promptId: integer("prompt_id")
      .notNull()
      .references(() => prompts.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userPromptIdx: uniqueIndex("favorites_user_prompt_idx").on(
      table.userId,
      table.promptId
    ),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
  favorites: many(favorites),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  prompts: many(prompts),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  category: one(categories, {
    fields: [prompts.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [prompts.authorId],
    references: [users.id],
  }),
  favorites: many(favorites),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [favorites.promptId],
    references: [prompts.id],
  }),
}));