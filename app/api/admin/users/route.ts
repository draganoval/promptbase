import { NextResponse } from "next/server";

import { listAdminUsers } from "@/lib/admin-api";

export async function GET() {
  try {
    const users = await listAdminUsers();
    return NextResponse.json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch users.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
