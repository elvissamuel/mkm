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

    return NextResponse.json(testimony);
  } catch (error) {
    console.error("Error creating testimony:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
