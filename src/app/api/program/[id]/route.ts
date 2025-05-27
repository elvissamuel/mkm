import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getById } from "@/lib/validation-schema"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { id } = params

    // Validate ID format
    const validation = getById.safeParse({ id })
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 })
    }

    // Find the user
    const program = await prisma.program.findUnique({
      where: {
        id,
        deleted_at: null,
      }
    })

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    const response = NextResponse.json(program)

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
