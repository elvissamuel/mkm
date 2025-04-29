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

    const {city, country, email, firstName, lastName, phoneCountry, phoneNumber} = validation.data

    const user = await prisma.user.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        city,
        country,
        phone_number: phoneCountry + phoneNumber,
        password: "password"
      },
    });

    if(user){
      const { error } = await resend.emails.send({
            from: 'MakingKings-Admin <admin@makingkingsfornations.com>',
            to: [`${user.email}`],
            subject: 'Welcome',
            react: EmailTemplate({ user: user }),
            text: "MKM2025"
          });
      
          if (error) {
            return Response.json({ error }, { status: 500 });
          }
    }

    const response = NextResponse.json(user);
    
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
