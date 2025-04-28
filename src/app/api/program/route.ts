import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getById } from "@/lib/validation-schema";

export async function GET() {
  try {
    // Fetch all programs from the database
    const programs = await prisma.program.findMany({
      where: {
        deleted_at: null, // Ensuring we're not fetching deleted programs, you can customize this
      },
    });

    const response = NextResponse.json(programs);

    // CORS Headers
    response.headers.set('Access-Control-Allow-Origin', 'https://www.makingkingsfornations.com'); // Set your frontend URL here
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const validation = getById.safeParse(await req.json());
    // const { session } = await getUserSessionAndPermissions();

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    }

    const program = await prisma.program.findUnique({
      where: {
        id: validation.data.id
      },
    });

    const response = NextResponse.json(program);
    
    // CORS Headers
    response.headers.set('Access-Control-Allow-Origin', 'https://www.makingkingsfornations.com');  // Set your frontend URL here
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error) {
    console.error("Error fetching single program:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// You may also need to handle OPTIONS method for preflight requests (CORS preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });

  // CORS Headers
  response.headers.set('Access-Control-Allow-Origin', 'https://www.makingkingsfornations.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
