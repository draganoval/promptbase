import "dotenv/config";

import { hashSync } from "bcryptjs";
import { desc, eq } from "drizzle-orm";

import { db } from "../db";
import { categories, prompts, users } from "../db/schema";

const TOTAL_PROMPTS = 200;
const BATCH_SIZE = 250;
const SEED_USER_EMAIL = "seed.large@promptbase.local";
const SEED_USER_NAME = "Seed User";
const SEED_CATEGORY_NAME = "Scale Test";

type SeedUser = typeof users.$inferSelect;
type SeedCategory = typeof categories.$inferSelect;

function chunk<T>(items: T[], size: number) {
  const batches: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }

  return batches;
}

function makeRunLabel() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function ensureSeedUser(): Promise<SeedUser> {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, SEED_USER_EMAIL))
    .limit(1);

  if (existingUser) {
    return existingUser;
  }

  const [createdUser] = await db
    .insert(users)
    .values({
      name: SEED_USER_NAME,
      email: SEED_USER_EMAIL,
      password: hashSync("PromptbaseSeed123!", 10),
      role: "user",
    })
    .returning();

  return createdUser;
}

async function ensureSeedCategory(): Promise<SeedCategory> {
  const [existingCategory] = await db
    .select()
    .from(categories)
    .where(eq(categories.name, SEED_CATEGORY_NAME))
    .limit(1);

  if (existingCategory) {
    return existingCategory;
  }

  const [createdCategory] = await db
    .insert(categories)
    .values({
      name: SEED_CATEGORY_NAME,
      description: "Seed data for scalability testing.",
    })
    .returning();

  return createdCategory;
}

async function main() {
  const runLabel = makeRunLabel();

  console.log(`Starting large seed run ${runLabel}`);

  const [seedUser, seedCategory] = await Promise.all([
    ensureSeedUser(),
    ensureSeedCategory(),
  ]);

  const totalBatches = Math.ceil(TOTAL_PROMPTS / BATCH_SIZE);
  const promptRows = Array.from({ length: TOTAL_PROMPTS }, (_, index) => {
    const number = index + 1;
    const paddedNumber = String(number).padStart(5, "0");

    return {
      title: `Scale Test Prompt ${paddedNumber} ${runLabel}`,
      description: `Generated seed prompt ${number} for scalability testing.`,
      promptText: [
        `Prompt ${number}: build a scalable PromptBase workflow.`,
        `Run label: ${runLabel}`,
        `Category: ${seedCategory.name}`,
      ].join("\n"),
      status: "published",
      categoryId: seedCategory.id,
      authorId: seedUser.id,
    };
  });

  const batches = chunk(promptRows, BATCH_SIZE);

  for (const [batchIndex, batch] of batches.entries()) {
    const currentBatch = batchIndex + 1;

    console.log(
      `Inserting batch ${currentBatch}/${totalBatches} (${batch.length} prompts)...`,
    );

    await db.insert(prompts).values(batch);

    console.log(`Completed batch ${currentBatch}/${totalBatches}`);
  }

  const latestPrompt = await db
    .select({ id: prompts.id, title: prompts.title })
    .from(prompts)
    .orderBy(desc(prompts.id))
    .limit(1);

  console.log(
    `Seed complete: inserted ${TOTAL_PROMPTS} prompts. Latest prompt: ${latestPrompt[0]?.title ?? "n/a"}`,
  );
}

main().catch((error) => {
  console.error("Large seed run failed:", error);
  process.exitCode = 1;
});