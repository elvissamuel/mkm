import { NextRequest, NextResponse } from "next/server";
import { testimonyFormSchema } from "@/lib/validation-schema";
import { prisma } from "@/lib/prisma";
// import { getUserSessionAndPermissions } from "@/lib/auth";

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

// You may also need to handle OPTIONS method for preflight requests (CORS preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });

  // CORS Headers
  response.headers.set('Access-Control-Allow-Origin', 'https://www.makingkingsfornations.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
