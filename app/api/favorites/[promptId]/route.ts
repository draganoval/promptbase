import { NextResponse } from "next/server";

import { getCurrentUserId, removeFavoriteForUser } from "@/lib/favorites-api";

function parsePromptId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

type RouteContext = {
  params: Promise<{ promptId: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { promptId: promptIdParam } = await context.params;
    const promptId = parsePromptId(promptIdParam);

    if (!promptId) {
      return NextResponse.json({ error: "Invalid prompt id." }, { status: 400 });
    }

    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "No users found." }, { status: 400 });
    }

    const deletedFavorite = await removeFavoriteForUser(userId, promptId);

    if (!deletedFavorite) {
      return NextResponse.json({ error: "Favorite not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Prompt removed from favorites.", promptId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove favorite.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}