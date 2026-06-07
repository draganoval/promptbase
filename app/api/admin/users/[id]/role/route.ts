import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

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
      return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
    }

    const body = (await request.json()) as { role?: unknown };
    const role = typeof body.role === "string" ? body.role.trim().toLowerCase() : "";

    if (role !== "user" && role !== "admin") {
      return NextResponse.json({ error: "Role must be 'user' or 'admin'." }, { status: 400 });
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
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Role updated successfully.", user: updatedUser });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update user role.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
