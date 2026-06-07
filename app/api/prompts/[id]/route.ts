import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { prompts } from "@/db/schema";
import { verifyAuthToken } from "@/lib/auth";
import { corsNoContent, corsResponse } from "@/lib/cors";
import { getCurrentUserId, isPromptFavoritedByUser } from "@/lib/favorites-api";
import {
  ensureCategoryExists,
  getPromptById,
  normalizePromptInput,
  validatePromptInput,
} from "@/lib/prompt-api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parsePromptId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const promptId = parsePromptId(id);

    if (!promptId) {
      return corsResponse({ error: "Invalid prompt id." }, { status: 400 });
    }

    const prompt = await getPromptById(promptId);

    if (!prompt) {
      return corsResponse({ error: "Prompt not found." }, { status: 404 });
    }

    const userId = await getCurrentUserId();
    const isFavorited = userId ? await isPromptFavoritedByUser(userId, promptId) : false;

    return corsResponse({ prompt: { ...prompt, isFavorited } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch prompt.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const promptId = parsePromptId(id);

    if (!promptId) {
      return corsResponse({ error: "Invalid prompt id." }, { status: 400 });
    }

    const body = await request.json();
    const input = normalizePromptInput(body);
    const validationError = validatePromptInput(input);

    if (validationError) {
      return corsResponse({ error: validationError }, { status: 400 });
    }

    if (!(await ensureCategoryExists(input.categoryId as number))) {
      return corsResponse({ error: "Category not found." }, { status: 404 });
    }

    const [updatedPrompt] = await db
      .update(prompts)
      .set({
        title: input.title as string,
        description: input.description ?? null,
        promptText: input.promptText as string,
        categoryId: input.categoryId as number,
        status: input.status || "published",
      })
      .where(eq(prompts.id, promptId))
      .returning();

    if (!updatedPrompt) {
      return corsResponse({ error: "Prompt not found." }, { status: 404 });
    }

    return corsResponse({
      message: "Prompt updated successfully.",
      prompt: updatedPrompt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update prompt.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authorizationHeader = _request.headers.get("authorization");

    if (authorizationHeader?.toLowerCase().startsWith("bearer ")) {
      const token = authorizationHeader.slice(7).trim();
      const payload = verifyAuthToken(token);

      if (!payload) {
        return corsResponse({ error: "Unauthorized." }, { status: 401 });
      }

      if (payload.role !== "admin") {
        return corsResponse({ error: "Forbidden." }, { status: 403 });
      }
    }

    const { id } = await context.params;
    const promptId = parsePromptId(id);

    if (!promptId) {
      return corsResponse({ error: "Invalid prompt id." }, { status: 400 });
    }

    const [deletedPrompt] = await db
      .delete(prompts)
      .where(eq(prompts.id, promptId))
      .returning({ id: prompts.id });

    if (!deletedPrompt) {
      return corsResponse({ error: "Prompt not found." }, { status: 404 });
    }

    return corsResponse({
      message: "Prompt deleted successfully.",
      id: deletedPrompt.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete prompt.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsNoContent();
}
