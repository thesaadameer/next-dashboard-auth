import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow requests if they are for the authentication API or static files
  if (
    pathname.includes("/api/auth") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Redirect to login page if no token exists
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If token has expired, return a 401 Unauthorized response
  const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  if (token.exp && token.exp < currentTime) {
    return new NextResponse("Unauthorized - Token expired", { status: 401 });
  }

  // Role-based access for dashboard paths
  if (pathname.startsWith("/dashboard")) {
    const role = token.role;

    if (role === "admin" && pathname.includes("/admin")) {
      return NextResponse.next();
    } else if (role === "instructor" && pathname.includes("/instructor")) {
      return NextResponse.next();
    } else if (role === "student" && pathname.includes("/student")) {
      return NextResponse.next();
    } else {
      // Unauthorized access to a dashboard route
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
