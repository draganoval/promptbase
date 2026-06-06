import { NextResponse } from "next/server";

import { registerUser, signAuthToken, toPublicUser } from "@/lib/auth";

type RegisterRequestBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const user = await registerUser({ name, email, password });
    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: toPublicUser(user),
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to register user.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
