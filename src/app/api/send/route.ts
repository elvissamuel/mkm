import { EmailTemplate } from '@/lib/email-template';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const user = await prisma.user.findFirst({
      where: {deleted_at: null}
    })
    const { data, error } = await resend.emails.send({
      from: 'Admin <elvis@makingkingsfornations.com>',
      to: ['elvissamuel8@gmail.com'],
      subject: 'Congratulations',
      react: EmailTemplate({ user: user! }),
      text: "Testing the text"
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}