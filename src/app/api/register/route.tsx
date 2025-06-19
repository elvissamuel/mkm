import { NextRequest, NextResponse } from "next/server";
import { personalInfoSchema } from "@/lib/validation-schema";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { EmailTemplate } from "@/lib/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const validation = personalInfoSchema.safeParse(await req.json());

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    }

    const {city, country, email, firstName, lastName, phoneCountry, phoneNumber, gender, programId} = validation.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered"},
        { status: 400 }
      );
    }

    // Use a transaction to ensure both user creation and email sending succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          first_name: firstName,
          last_name: lastName,
          city,
          country,
          gender,
          phone_number: phoneCountry + phoneNumber,
          password: email,
          program_id: programId 
        },
      });

      // Send email
      const { error } = await resend.emails.send({
        from: 'MakingKings-Admin <admin@makingkingsfornations.com>',
        to: [`${user.email}`],
        subject: 'Welcome',
        react: EmailTemplate({ user: user }),
        text: "MKM2025"
      });

      if (error) {
        throw new Error("Failed to send email");
      }

      return user;
    });

    const response = NextResponse.json(result);
    
    // CORS Headers
    response.headers.set('Access-Control-Allow-Origin', 'https://www.makingkingsfornations.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  } catch (error) {
    console.error("Error in registration:", error);
    
    // Handle specific error cases
    if (error instanceof Error && error.message === "Failed to send email") {
      return NextResponse.json(
        { error: [{ message: "Failed to send welcome email" }] },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: [{ message: "Internal server error" }] },
      { status: 500 }
    );
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
