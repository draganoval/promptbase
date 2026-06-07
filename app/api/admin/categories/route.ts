import { createAdminCategory, listAdminCategories } from "@/lib/admin-api";
import { corsNoContent, corsResponse } from "@/lib/cors";

export async function GET() {
  try {
    const categories = await listAdminCategories();
    return corsResponse({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch categories.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: unknown; description?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";

    if (!name) {
      return corsResponse({ error: "Category name is required." }, { status: 400 });
    }

    const createdCategory = await createAdminCategory(name, description || null);

    return corsResponse({ message: "Category created successfully.", category: createdCategory }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create category.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsNoContent();
}
