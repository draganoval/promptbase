import { NextResponse } from "next/server";

import { createAdminCategory, listAdminCategories } from "@/lib/admin-api";

export async function GET() {
  try {
    const categories = await listAdminCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch categories.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: unknown; description?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const createdCategory = await createAdminCategory(name, description || null);

    return NextResponse.json({ message: "Category created successfully.", category: createdCategory }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create category.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
