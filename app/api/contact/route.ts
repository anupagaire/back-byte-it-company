import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Save to DB
    let contact;
    try {
      contact = await prisma.contact.create({
        data: { name, email, company: company || '', service: service || '', message },
      });
    } catch (dbErr: any) {
      console.error('DB Error:', dbErr);
      return NextResponse.json({ error: 'Database error', detail: dbErr.message }, { status: 500 });
    }

    // 2. Send email to yourself
    try {
      await transporter.sendMail({
        from: `"Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        replyTo: email,
        subject: `New Contact: ${name} — ${service || 'General Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a2744, #505f88); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">New Contact Message</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600; width: 140px;">NAME</td>
                  <td style="padding: 10px 0; color: #1a2744; font-weight: 600;">${name}</td>
                </tr>
                <tr style="border-top: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600;">EMAIL</td>
                  <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #69c8e4;">${email}</a></td>
                </tr>
                ${company ? `<tr style="border-top: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600;">COMPANY</td>
                  <td style="padding: 10px 0; color: #1a2744;">${company}</td>
                </tr>` : ''}
                ${service ? `<tr style="border-top: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600;">SERVICE</td>
                  <td style="padding: 10px 0; color: #1a2744;">${service}</td>
                </tr>` : ''}
                <tr style="border-top: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; color: #6b7280; font-size: 13px; font-weight: 600; vertical-align: top;">MESSAGE</td>
                  <td style="padding: 10px 0; color: #1a2744; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</td>
                </tr>
              </table>
              <div style="margin-top: 24px;">
                <a href="mailto:${email}"
                  style="background: linear-gradient(135deg, #69c8e4, #505f88); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Reply to ${name}
                </a>
              </div>
              <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
                ${new Date().toLocaleString('en-NP')}
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailErr: any) {
      console.error('Email Error:', emailErr);
      // Don't fail the whole request if email fails — contact is saved to DB
      // Just log it and continue
    }

    // 3. Send confirmation to customer (optional — don't fail if this errors)
    try {
      await transporter.sendMail({
        from: `"Back Bytetech" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `We received your message, ${name}! 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a2744, #505f88); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Thank you, ${name}!</h1>
              <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0;">We'll get back to you within 24 hours</p>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #4b5563; line-height: 1.7;">
                We've received your message and will respond within <strong>4 hours</strong>.
              </p>
              <div style="background: white; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb; text-align: left;">
                <p style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px;">Your message:</p>
                <p style="color: #1a2744; line-height: 1.6; margin: 0; font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
              </div>
              <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">
                — The Back Bytetech Team
              </p>
            </div>
          </div>
        `,
      });
    } catch (confirmErr: any) {
      console.error('Confirmation email error:', confirmErr);
    }

    return NextResponse.json({ success: true, contact });

  } catch (error: any) {
    console.error('Unhandled error:', error);
    return NextResponse.json(
      { error: 'Server error', detail: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts', detail: error.message },
      { status: 500 }
    );
  }
}