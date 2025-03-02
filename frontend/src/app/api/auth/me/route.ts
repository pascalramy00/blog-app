import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const res = await fetch("http://localhost:3001/api/auth/verify-token", {
      headers: { Cookie: `token=${token}` },
    });
    if (!res.ok)
      return NextResponse.json({ authenticated: false }, { status: 401 });

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error }, { status: 500 });
  }
}
