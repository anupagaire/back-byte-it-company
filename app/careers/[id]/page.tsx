'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  ArrowLeft, 
  Calendar 
} from 'lucide-react';

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  department: string;
  published?: boolean;
};

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
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
          <p className="mt-4 text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Job not found</h2>
          <p className="text-gray-500 mt-2">The position you're looking for may have been filled or removed.</p>
          <Link href="/careers" className="mt-6 inline-block">
            <Button variant="outline">← Back to All Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link href="/careers">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-[#1a2744]">
            <ArrowLeft className="w-5 h-5" />
            Back to Careers
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <CardContent className="p-12 space-y-10">

              {/* Header Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-8 h-8 text-[#69c8e4]" />
                  <Badge 
                    variant="secondary"
                    className="bg-[#505f88]/10 text-[#505f88] text-sm px-4 py-1"
                  >
                    {job.department}
                  </Badge>
                </div>

                <h1 className="text-5xl font-bold text-[#1a2744] leading-tight tracking-tighter">
                  {job.title}
                </h1>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#69c8e4]" />
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#69c8e4]" />
                  <span className="font-medium">{job.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#69c8e4]" />
                  <span className="font-medium">Posted recently</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-10" />

              {/* Job Description */}
              <div>
                <h2 className="text-2xl font-semibold text-[#1a2744] mb-6">Job Description</h2>
                <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Requirements / Note Section (Optional) */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
                <h3 className="font-semibold text-lg mb-3 text-[#1a2744]">
                  What We Offer
                </h3>
                <p className="text-gray-600">
                  Competitive salary, flexible working hours, health insurance, 
                  and a collaborative environment where your ideas matter.
                </p>
              </div>

              {/* Apply Section */}
              <div className="pt-8 border-t border-gray-200">
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-semibold mb-2">Ready to make an impact?</h3>
                  <p className="text-gray-600 mb-8">
                    Take the next step in your career with us.
                  </p>

                  <Link href={`/careers/${job.id}/apply`}>
                    <Button 
                      size="lg"
                      className="bg-[#69c8e4] hover:bg-[#58b4d1] text-white text-lg px-12 py-7 rounded-2xl font-semibold shadow-lg shadow-[#69c8e4]/20 transition-all hover:scale-[1.02]"
                    >
                      Apply for this Position
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}