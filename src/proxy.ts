import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { UserRole } from "./types";

/**
 *  HETNEX GLOBAL MIDDLEWARE
 * Handles edge-level authentication, authorization, and route protection.
 */
export default withAuth(
  function middleware(req) {
    console.log("middleware", req.nextauth);
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    //  Auth Page Logic: Redirect logged-in users away from Login/Register
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null; // Let them access Login/Register if not logged in
    }

    // Protection Logic: Ensure users are logged in for dashboard/admin
    if (!isAuth) {
      let from = pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Authorization Logic: Protect Admin routes from non-admin users
    if (pathname.startsWith("/admin") && Number(token?.role) !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true to always run the middleware function above for matched routes
      authorized: () => true,
    },
  }
);

/**
 *  Route Matcher Config
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register"
  ],
};
