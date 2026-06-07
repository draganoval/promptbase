import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { corsNoContent, corsResponse } from "@/lib/cors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseUserId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const userId = parseUserId(id);

    if (!userId) {
      return corsResponse({ error: "Invalid user id." }, { status: 400 });
    }

    const body = (await request.json()) as { role?: unknown };
    const role = typeof body.role === "string" ? body.role.trim().toLowerCase() : "";

    if (role !== "user" && role !== "admin") {
      return corsResponse({ error: "Role must be 'user' or 'admin'." }, { status: 400 });
    }

    const [updatedUser] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    if (!updatedUser) {
      return corsResponse({ error: "User not found." }, { status: 404 });
    }

    return corsResponse({ message: "Role updated successfully.", user: updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update user role.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsNoContent();
}
