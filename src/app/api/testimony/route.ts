import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/auth"
import { z } from "zod"
import { approveTestimonySchema, getById, testimonyFormSchema } from "@/lib/validation-schema"

// Validation schema for query parameters
const queryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(["created_at", "first_name", "last_name", "email"]).optional().default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})

// GET all testimonies with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const adminData = await verifyAdminToken(req)
    if (!adminData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const url = new URL(req.url)
    const queryParams = {
      page: url.searchParams.get("page") || "1",
      limit: url.searchParams.get("limit") || "10",
      search: url.searchParams.get("search") || undefined,
      sortBy: url.searchParams.get("sortBy") || "created_at",
      sortOrder: url.searchParams.get("sortOrder") || "desc",
    }

    // Validate query parameters
    const validation = queryParamsSchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 })
    }

    const { page, limit, search, sortBy, sortOrder } = validation.data

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      deleted_at: null,
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { first_name: { contains: search, mode: "insensitive" } },
        { last_name: { contains: search, mode: "insensitive" } },
        { testimony: { contains: search, mode: "insensitive" } },
      ]
    }

    // Fetch testimonies with pagination
    const [testimonies, totalCount] = await Promise.all([
      prisma.testimony.findMany({
        where: whereClause,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.testimony.count({
        where: whereClause,
      }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    const response = NextResponse.json({
      testimonies,
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
    console.error("Error fetching testimonies:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    const validation = testimonyFormSchema.safeParse(await req.json());
    // const { session } = await getUserSessionAndPermissions();

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    }

    const testimony = await prisma.testimony.create({
      data: {
        ...validation.data,
      },
    });

    const response = NextResponse.json(testimony);
    
    // CORS Headers
    response.headers.set('Access-Control-Allow-Origin', 'https://www.makingkingsfornations.com');  // Set your frontend URL here
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error) {
    console.error("Error creating testimony:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Verify admin authentication
    const adminData = await verifyAdminToken(req)
    if (!adminData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validation = approveTestimonySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 })
    }

    const { id, approved } = validation.data

    // Check if program exists
    const existingTestimony = await prisma.testimony.findUnique({
      where: {
        id,
        deleted_at: null, // Only update active programs
      },
    })

    if (!existingTestimony) {
      return NextResponse.json({ error: "Testimony not found" }, { status: 404 })
    }

    const updatedTestimony = await prisma.testimony.update({
      where: {id: existingTestimony.id},
      data: {
        approved: approved
      }
    })

    const response = NextResponse.json(updatedTestimony)

    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response

    }catch (error) {
    console.error("Error updating program:", error)
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
