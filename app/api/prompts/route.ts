import {
  ensureCategoryExists,
  getFirstUserId,
  listPrompts,
  normalizePromptInput,
  validatePromptInput,
} from "@/lib/prompt-api";
import { db } from "@/db";
import { prompts } from "@/db/schema";
import { corsNoContent, corsResponse } from "@/lib/cors";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "10");

    const result = await listPrompts(page, limit);

    return corsResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch prompts.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = normalizePromptInput(body);
    const validationError = validatePromptInput(input);

    if (validationError) {
      return corsResponse({ error: validationError }, { status: 400 });
    }

    if (!(await ensureCategoryExists(input.categoryId as number))) {
      return corsResponse({ error: "Category not found." }, { status: 404 });
    }

    const authorId = await getFirstUserId();

    if (!authorId) {
      return corsResponse({ error: "No users found to assign as author." }, { status: 400 });
    }

    const [createdPrompt] = await db
      .insert(prompts)
      .values({
        title: input.title as string,
        description: input.description ?? null,
        promptText: input.promptText as string,
        categoryId: input.categoryId as number,
        authorId,
        status: input.status || "published",
      })
      .returning();

    return corsResponse({
      message: "Prompt created successfully.",
      prompt: createdPrompt,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create prompt.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsNoContent();
}
