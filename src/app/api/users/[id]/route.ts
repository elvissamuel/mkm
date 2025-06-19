import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/auth"
import { z } from "zod"

// Validation schema
const userIdSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
})

// GET a single user by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin authentication
    // const adminData = await verifyAdminToken(req)
    // if (!adminData) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { id } = params

    // Validate ID format
    const validation = userIdSchema.safeParse({ id })
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        id,
        deleted_at: null,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        city: true,
        country: true,
        gender: true,
        status: true,
        is_email_verified: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        role: true,
        program: true,
        // Include user subscriptions
        user_subscriptions: {
          where: {
            deleted_at: null,
          },
          include: {
            program: true,
            payments: true
          },
        },
        // Exclude password and other sensitive fields
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const response = NextResponse.json(user)

    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle OPTIONS method for preflight requests (CORS preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })

  // CORS Headers
  response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  return response
}
