import { NextResponse } from "next/server";

import { loginUser, signAuthToken, toPublicUser } from "@/lib/auth";

type LoginRequestBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequestBody;
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await loginUser({ email, password });
    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      message: "Login successful.",
      user: toPublicUser(user),
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to login.";

    return NextResponse.json({ error: message }, { status: 401 });
  }
}