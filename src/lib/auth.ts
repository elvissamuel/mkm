import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "./prisma"

export async function verifyAdminToken(req: NextRequest) {
  try {
    // Get the token from the cookies
    const token = req.cookies.get("admin-token")?.value

    if (!token) {
      console.error("No admin token found in cookies")
      return null
    }

    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.AUTH_KEY)
    if (!process.env.JWT_SECRET && !process.env.AUTH_KEY) {
      console.error("JWT_SECRET or AUTH_KEY environment variable is not set")
      return null
    }

    try {
      const { payload } = await jwtVerify(token, secret)
      
      // Check if the admin still exists and is active
      const admin = await prisma.admin.findUnique({
        where: {
          id: payload.id as string,
          is_active: true,
          deleted_at: null,
        },
      })

      if (!admin) {
        console.error("Admin not found or inactive:", payload.id)
        return null
      }

      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      }
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError)
      return null
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}
