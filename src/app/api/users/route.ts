import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/auth"
import { z } from "zod"

// Validation schema for query parameters
const queryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  role: z.enum(["USER", "PREMIUM", "ALL"]).optional().default("ALL"),
  search: z.string().optional(),
  sortBy: z.enum(["created_at", "email", "first_name", "last_name"]).optional().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})

// GET all users with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    // const adminData = await verifyAdminToken(req)
    // if (!adminData) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Parse query parameters
    const url = new URL(req.url)
    const queryParams = {
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "10",
      role: url.searchParams.get("role") || "ALL",
      search: url.searchParams.get("search") || undefined,
      sortBy: url.searchParams.get("sortBy") || "created_at",
      sortOrder: url.searchParams.get("sortOrder") || "desc",
    }

    // Validate query parameters
    const validation = queryParamsSchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 })
    }

    const { page, limit, role, search, sortBy, sortOrder } = validation.data

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      deleted_at: null,
      is_active: true,
    }

    // Filter by role if specified
    if (role !== "ALL") {
      whereClause.role = role
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { first_name: { contains: search, mode: "insensitive" } },
        { last_name: { contains: search, mode: "insensitive" } },
      ]
    }

    // Fetch users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone_number: true,
          city: true,
          country: true,
          status: true,
          gender: true,
          mode_of_participation: true,
          is_email_verified: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          role: true,
          // Exclude password and other sensitive fields
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    const response = NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    })

    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching users:", error)
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
