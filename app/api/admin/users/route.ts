import { listAdminUsers } from "@/lib/admin-api";
import { corsNoContent, corsResponse } from "@/lib/cors";

export async function GET() {
  try {
    const users = await listAdminUsers();
    return corsResponse({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch users.";
    return corsResponse({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return corsNoContent();
}
