import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Entered client middleware");
  const res = await fetch(`${req.nextUrl.origin}/api/auth/me`, {
    headers: { Cookie: req.headers.get("cookie") || "" },
  });

  console.log("CLIMIDD res:::::::", res);
  if (!res.ok) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect the /dashboard route and sub-paths
};
