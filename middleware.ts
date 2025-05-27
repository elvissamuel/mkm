import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Define which routes require authentication
const protectedRoutes = ["/admin/dashboard", "/admin/programs", "/admin/profile", "/admin/testimonies", "/admin/free-users", "/admin/premium-users"]

// Define which routes should be accessible only when not authenticated
const authRoutes = ["/admin/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the path is an auth route (login)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get the token from the cookies
  const token = request.cookies.get("admin-token")?.value

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // If there's a token, verify it
  if (token) {
    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.AUTH_KEY)

      await jwtVerify(token, secret)

      // If it's an auth route and the user is already authenticated, redirect to dashboard
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
    } catch (error) {
      // If token verification fails and it's a protected route, redirect to login
      if (isProtectedRoute) {
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
