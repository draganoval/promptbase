import { deleteAdminCategory } from "@/lib/admin-api";
import { corsNoContent, corsResponse } from "@/lib/cors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseCategoryId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const categoryId = parseCategoryId(id);

    if (!categoryId) {
      return corsResponse({ error: "Invalid category id." }, { status: 400 });
    }

    const result = await deleteAdminCategory(categoryId);

    if (!result.deleted) {
      return corsResponse(
        { error: "Category cannot be deleted because it is used by prompts." },
        { status: 400 }
      );
    }

    return corsResponse({ message: "Category deleted successfully.", id: categoryId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete category.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsNoContent();
}