import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Define which routes require authentication
const protectedRoutes = ["/admin/dashboard", "/admin/programs", "/admin/profile", "/admin/testimonies", "/admin/free-users", "/admin/premium-users"]

// Define which routes should be accessible only when not authenticated
const authRoutes = ["/admin/login"]

export async function middleware(request: NextRequest) {
  console.log("Middleware - Starting middleware execution")
  const { pathname } = request.nextUrl
  console.log("Middleware - Current path:", pathname)

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  console.log("Middleware - Is protected route:", isProtectedRoute)

  // Check if the path is an auth route (login)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  console.log("Middleware - Is auth route:", isAuthRoute)

  // Get the token from the cookies
  const token = request.cookies.get("admin-token")?.value
  console.log("Middleware - Token exists:", !!token)
  if (token) {
    console.log("Middleware - Token value:", token.substring(0, 20) + "...")
  }

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    console.log("Middleware - No token for protected route, redirecting to login")
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // If there's a token, verify it
  if (token) {
    try {
      // Create a TextEncoder for the secret
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "makingkingsfornations2025#")
      console.log("Middleware - Verifying token")
      
      // Verify the token using jose
      const { payload } = await jwtVerify(token, secret)
      console.log("Middleware - Token verified successfully:", payload)

      // If it's an auth route and the user is already authenticated, redirect to dashboard
      if (isAuthRoute) {
        console.log("Middleware - Authenticated user trying to access auth route, redirecting to dashboard")
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
    } catch (error) {
      console.error("Middleware - Token verification failed:", error)
      // If token verification fails and it's a protected route, redirect to login
      if (isProtectedRoute) {
        console.log("Middleware - Invalid token for protected route, redirecting to login")
        const url = new URL("/admin/login", request.url)
        url.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(url)
      }
    }
  }

  console.log("Middleware - Proceeding with request")
  return NextResponse.next()
}

// Update the matcher to be more specific
export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/programs/:path*",
    "/admin/profile/:path*",
    "/admin/testimonies/:path*",
    "/admin/free-users/:path*",
    "/admin/premium-users/:path*",
    "/admin/login"
  ]
}
