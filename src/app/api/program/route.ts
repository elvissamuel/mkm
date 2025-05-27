import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAdminToken } from "@/lib/auth"
import { z } from "zod"
import { createProgramSchema, programIdSchema, updateProgramSchema } from "@/lib/validation-schema"

// GET all programs
export async function GET() {
  try {
    // Fetch all programs from the database
    const programs = await prisma.program.findMany({
      where: {
        deleted_at: null, // Ensuring we're not fetching deleted programs
      },
    })

    const response = NextResponse.json(programs)

    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error fetching programs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// CREATE a new program
export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    // const adminData = await verifyAdminToken(req)
    // if (!adminData) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Parse and validate request body
    const body = await req.json()
    const validation = createProgramSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 })
    }

    const { name, features, duration, price } = validation.data

    // Check if program with this name already exists
    const existingProgram = await prisma.program.findUnique({
      where: { name },
    })

    if (existingProgram) {
      return NextResponse.json({ error: "Program with this name already exists" }, { status: 409 })
    }

    // Create the program
    const program = await prisma.program.create({
      data: {
        name,
        features,
        duration,
        price,
      },
    })

    const response = NextResponse.json(program)

    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error creating program:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// UPDATE an existing program
export async function PUT(req: NextRequest) {
  try {
    // Verify admin authentication
    // const adminData = await verifyAdminToken(req)
    // if (!adminData) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Parse and validate request body
    const body = await req.json()
    const validation = updateProgramSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 })
    }

    const { id, ...updateData } = validation.data

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: {
        id,
        deleted_at: null, // Only update active programs
      },
    })

    if (!existingProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    // If name is being updated, check for duplicates
    if (updateData.name && updateData.name !== existingProgram.name) {
      const duplicateName = await prisma.program.findUnique({
        where: { name: updateData.name },
      })

      if (duplicateName) {
        return NextResponse.json({ error: "Program with this name already exists" }, { status: 409 })
      }
    }

    // Update the program
    const updatedProgram = await prisma.program.update({
      where: { id },
      data: updateData,
    })

    const response = NextResponse.json(updatedProgram)

    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error updating program:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a program (soft delete)
export async function DELETE(req: NextRequest) {
  try {
    // Verify admin authentication
    // const adminData = await verifyAdminToken(req)
    // if (!adminData) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    const body = await req.json()

    // Validate ID format
    const validation = programIdSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 })
    }

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: {
        id: validation.data.id,
        deleted_at: null, // Only delete active programs
      },
    })

    if (!existingProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    // Soft delete the program by setting deleted_at
    const deletedProgram = await prisma.program.update({
      where: { id: validation.data.id },
      data: {
        deleted_at: new Date(),
      },
    })

    const response = NextResponse.json({
      message: "Program deleted successfully",
      id: deletedProgram.id,
    })

    // CORS Headers
    response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  } catch (error) {
    console.error("Error deleting program:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle OPTIONS method for preflight requests (CORS preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })

  // CORS Headers
  response.headers.set("Access-Control-Allow-Origin", "https://www.makingkingsfornations.com")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  return response
}
