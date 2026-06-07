import { db } from "@/db";
import { prompts } from "@/db/schema";
import {
  addFavoriteForUser,
  getCurrentUserId,
  getFavoritePromptsForUser,
} from "@/lib/favorites-api";
import { eq } from "drizzle-orm";
import { corsNoContent, corsResponse } from "@/lib/cors";

function parsePromptId(value: unknown) {
  const parsed = typeof value === "string" || typeof value === "number" ? Number(value) : NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return corsResponse({ error: "No users found." }, { status: 400 });
    }

    const favorites = await getFavoritePromptsForUser(userId);

    return corsResponse({ favorites });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch favorites.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return corsResponse({ error: "No users found." }, { status: 400 });
    }

    const body = (await request.json()) as { promptId?: unknown };
    const promptId = parsePromptId(body.promptId);

    if (!promptId) {
      return corsResponse({ error: "Prompt ID is required." }, { status: 400 });
    }

    const [prompt] = await db.select({ id: prompts.id }).from(prompts).where(eq(prompts.id, promptId)).limit(1);

    if (!prompt) {
      return corsResponse({ error: "Prompt not found." }, { status: 404 });
    }

    const result = await addFavoriteForUser(userId, promptId);

    return corsResponse(
      {
        message: result.created ? "Prompt added to favorites." : "Prompt is already favorited.",
        favoriteId: result.id,
      },
      { status: result.created ? 201 : 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to add favorite.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsNoContent();
}