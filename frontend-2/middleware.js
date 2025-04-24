import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // If the pathname is /home, redirect to /
  if (pathname === "/home") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
  matcher: "/home",
};
