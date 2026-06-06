import { NextResponse } from "next/server";

import {
  ensureCategoryExists,
  getFirstUserId,
  listPrompts,
  normalizePromptInput,
  validatePromptInput,
} from "@/lib/prompt-api";
import { db } from "@/db";
import { prompts } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "10");

    const result = await listPrompts(page, limit);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch prompts.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = normalizePromptInput(body);
    const validationError = validatePromptInput(input);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!(await ensureCategoryExists(input.categoryId as number))) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    const authorId = await getFirstUserId();

    if (!authorId) {
      return NextResponse.json({ error: "No users found to assign as author." }, { status: 400 });
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

    return NextResponse.json({
      message: "Prompt created successfully.",
      prompt: createdPrompt,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create prompt.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
