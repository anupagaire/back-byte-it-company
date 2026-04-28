// app/api/apply/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (add these to your .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const jobId = formData.get('jobId') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!name || !email || !jobId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let resumeUrl = null;
    let resumePublicId = null;

    // Upload resume to Cloudinary if provided
    if (resumeFile) {
      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',        // allows pdf, doc, etc.
            folder: 'job_applications',
            allowed_formats: ['pdf', 'doc', 'docx'],
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

    // Save application to database
    const application = await prisma.application.create({
      data: {
        jobId,
        name,
        email,
        resumeUrl,
        resumePublicId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });

  } catch (error: any) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application', details: error.message },
      { status: 500 }
    );
  }
}