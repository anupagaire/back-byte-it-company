
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ApplyForm from '@/components/ApplyForm';  
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function JobApplyPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        const foundJob = data.find((j: any) => j.id === id);
        setJob(foundJob);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#69c8e4] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Job not found</h2>
          <Link href="/careers" className="mt-6 inline-block">
            <Button variant="outline">← Back to Careers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Back Button */}
        <Link href={`/careers/${id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a2744] mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to Job Details
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#1a2744] mb-3">
            Apply for {job.title}
          </h1>
          <p className="text-gray-600">
            {job.location} • {job.type}
          </p>
        </div>

        {/* Apply Form */}
        <ApplyForm 
          jobId={id as string} 
          jobTitle={job.title} 
        />

      </div>
    </div>
  );
}