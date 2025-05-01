import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { prisma } from "./prisma"

export async function verifyAdminToken(req: NextRequest) {
  try {
    // Get the token from the cookies
    const token = req.cookies.get("admin-token")?.value

    if (!token) {
      return null
    }

    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.AUTH_KEY)
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
      return null
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}
