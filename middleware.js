import { NextResponse } from "next/server";
import { authMiddleware } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "./config";

// Define paths that should be protected
const PROTECTED_PATHS = ["/dashboard", "/dashboard/utazasok-modositasa", "/dashboard/blog"]; // Add all protected paths here

export async function middleware(request) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }, headers) => {
      const path = request.nextUrl.pathname;

      // Redirect authenticated users from login page to dashboard
      if (path === "/login") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async (reason) => {
      const path = request.nextUrl.pathname;

      // Redirect to login page if trying to access protected paths without valid token
      if (PROTECTED_PATHS.includes(path)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Allow access to non-protected paths
      return NextResponse.next();
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error });

      const path = request.nextUrl.pathname;

      // Redirect to login page in case of an error if trying to access protected paths
      if (PROTECTED_PATHS.includes(path)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Allow access to non-protected paths
      return NextResponse.next();
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api|.*\\.).*)", "/api/login", "/api/logout"],
};
