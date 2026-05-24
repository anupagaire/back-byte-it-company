import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const jobId = formData.get('jobId') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!name || !email || !jobId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let resumeUrl = null;
    let resumePublicId = null;

    // Upload resume to Cloudinary
    if (resumeFile) {
      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'job_applications',
            allowed_formats: ['pdf', 'doc', 'docx'],
            access_mode: 'public',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      }) as any;

      resumeUrl = result.secure_url;
      resumePublicId = result.public_id;
    }

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    // Save application
    const application = await prisma.application.create({
      data: {
        jobId,
        name,
        email,
        resumeUrl,
        resumePublicId,
      },
    });

    // =========================
    // EMAIL TO ADMIN
    // =========================
    try {
      await transporter.sendMail({
        from: `"Job Application" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        replyTo: email,
        subject: `New Application for ${job?.title || 'Job Position'}`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
            
            <div style="background: linear-gradient(135deg, #1a2744, #505f88); padding: 30px; border-radius: 12px 12px 0 0;">
              <h1 style="color:white; margin:0;">New Job Application</h1>
            </div>

            <div style="border:1px solid #e5e7eb; padding:30px; border-radius:0 0 12px 12px; background:#f9fafb;">
              
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0; font-weight:bold; width:140px;">Applicant Name</td>
                  <td>${name}</td>
                </tr>

                <tr style="border-top:1px solid #e5e7eb;">
                  <td style="padding:10px 0; font-weight:bold;">Email</td>
                  <td>
                    <a href="mailto:${email}" style="color:#69c8e4;">
                      ${email}
                    </a>
                  </td>
                </tr>

                <tr style="border-top:1px solid #e5e7eb;">
                  <td style="padding:10px 0; font-weight:bold;">Position</td>
                  <td>${job?.title || 'N/A'}</td>
                </tr>
              </table>

              ${
                resumeUrl
                  ? `
                <div style="margin-top:30px;">
                  <a href="${resumeUrl}"
                     target="_blank"
                     style="background:#69c8e4; color:white; padding:12px 22px; border-radius:8px; text-decoration:none; font-weight:bold;">
                     View Resume
                  </a>
                </div>
              `
                  : ''
              }

              <p style="margin-top:25px; color:#9ca3af; font-size:12px;">
                ${new Date().toLocaleString('en-NP')}
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Admin email error:', emailErr);
    }

    // =========================
    // CONFIRMATION EMAIL
    // =========================
    try {
      await transporter.sendMail({
        from: `"Back Bytetech" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Application Received — ${job?.title || 'Position'}`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
            
            <div style="background: linear-gradient(135deg, #1a2744, #505f88); padding: 30px; border-radius: 12px 12px 0 0; text-align:center;">
              <h1 style="color:white; margin:0;">
                Application Received 🎉
              </h1>

              <p style="color:rgba(255,255,255,0.7); margin-top:8px;">
                Thank you for applying
              </p>
            </div>

            <div style="border:1px solid #e5e7eb; padding:30px; border-radius:0 0 12px 12px; background:#f9fafb;">
              
              <p>Hello <strong>${name}</strong>,</p>

              <p style="line-height:1.7; color:#374151;">
                Thank you for applying for 
                <strong>${job?.title || 'this position'}</strong>.
              </p>

              <p style="line-height:1.7; color:#374151;">
                Our recruitment team will review your application and contact you if shortlisted.
              </p>

              <div style="background:white; border:1px solid #e5e7eb; border-radius:10px; padding:18px; margin-top:24px;">
                <p style="margin:0; font-size:13px; color:#6b7280; font-weight:bold;">
                  Applied Position
                </p>

                <p style="margin-top:8px; font-size:18px; color:#1a2744; font-weight:bold;">
                  ${job?.title || 'N/A'}
                </p>
              </div>

              <p style="margin-top:30px; color:#9ca3af; font-size:13px;">
                — Back Bytetech Team
              </p>
            </div>
          </div>
        `,
      });
    } catch (confirmErr) {
      console.error('Confirmation email error:', confirmErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });

  } catch (error: any) {
    console.error('Application error:', error);

    return NextResponse.json(
      {
        error: 'Failed to submit application',
        details: error.message,
      },
      { status: 500 }
    );
  }
}