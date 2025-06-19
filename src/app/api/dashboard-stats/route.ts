import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/auth"

// GET dashboard statistics
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    // const adminData = await verifyAdminToken(req)
    // if (!adminData) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Fetch counts in parallel for better performance
    const [premiumUsersCount, freeUsersCount, programsCount, testimoniesCount, recentUsers, recentTestimonies] =
      await Promise.all([
        // Count premium users
        prisma.user.count({
          where: {
            role: "PREMIUM",
            deleted_at: null,
            is_active: true,
          },
        }),

        // Count free users
        prisma.user.count({
          where: {
            role: "USER",
            deleted_at: null,
            is_active: true,
          },
        }),

        // Count programs
        prisma.program.count({
          where: {
            deleted_at: null,
          },
        }),

        // Count testimonies
        prisma.testimony.count({
          where: {
            deleted_at: null,
          },
        }),

        // Get recent users
        prisma.user.findMany({
          where: {
            deleted_at: null,
            is_active: true,
          },
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            role: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 3,
        }),

        // Get recent testimonies
        prisma.testimony.findMany({
          where: {
            deleted_at: null,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 3,
        }),
      ])

    const response = NextResponse.json({
      counts: {
        premiumUsers: premiumUsersCount,
        freeUsers: freeUsersCount,
        programs: programsCount,
        testimonies: testimoniesCount,
      },
      recent: {
        users: recentUsers,
        testimonies: recentTestimonies,
      },
    })

    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
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
