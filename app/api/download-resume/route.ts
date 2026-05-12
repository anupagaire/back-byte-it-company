import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const publicId = req.nextUrl.searchParams.get('publicId');
  
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  
  const downloadUrl = `https://res.cloudinary.com/${cloudName}/image/upload/fl_attachment/${publicId}.pdf`;
  
  return NextResponse.redirect(downloadUrl);
}