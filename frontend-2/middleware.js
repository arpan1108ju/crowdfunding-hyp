import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/signup", "/forgot-password"];

  // Check if the current path is public
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the token from cookies
  // const token = request.cookies.get("auth-token")?.value;

  // // If there's no token, redirect to login
  // if (!token) {
  //   const loginUrl = new URL("/login", request.url);
  //   // Add the current path as a redirect parameter
  //   loginUrl.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // Special case for /home redirect
  if (pathname === "/home") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /sitemap.xml (public files)
     */
    "/((?!api|_next|static|favicon.ico|sitemap.xml).*)",
  ],
};
