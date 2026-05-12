'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  department: string;
  published?: boolean;
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter((job) => job.published !== false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#69c8e4] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
<section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
         

          <h1 className="text-6xl md:text-7xl font-black text-[#1a2744] tracking-tighter mb-6">
            Join Our Growing Team
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Help us build innovative solutions and shape the future. 
            Discover meaningful opportunities that match your passion.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-8 mb-16 text-sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#69c8e4]">{filteredJobs.length}</p>
            <p className="text-gray-500">Open Positions</p>
          </div>
          <div className="h-12 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[#505f88]">Kathmandu</p>
            <p className="text-gray-500">+ Remote Friendly</p>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No open positions at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <Card className="group h-full rounded-3xl overflow-hidden border border-gray-100 hover:border-[#69c8e4]/30 shadow-sm hover:shadow-2xl transition-all duration-500 bg-white">
                  <CardContent className="p-8 flex flex-col h-full">
                    
                    {/* Department Badge */}
                    <div className="mb-6">
                      <Badge 
                        variant="secondary" 
                        className="bg-[#505f88]/10 text-[#505f88] hover:bg-[#505f88]/20 font-medium"
                      >
                        {job.department}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-[#1a2744] leading-tight mb-6 group-hover:text-[#69c8e4] transition-colors">
                      {job.title}
                    </h2>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#69c8e4]" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#69c8e4]" />
                        <span>{job.type}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 line-clamp-4 leading-relaxed mb-10 flex-grow">
                      {job.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 mt-auto pt-6 border-t border-gray-100">
                      <Link href={`/careers/${job.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full rounded-2xl border-gray-300 hover:border-[#69c8e4] hover:text-[#69c8e4]"
                        >
                          View Details
                        </Button>
                      </Link>

                      <Link href={`/careers/${job.id}/apply`} className="flex-1">
                        <Button 
                          className="w-full bg-[#69c8e4] hover:bg-[#58b4d1] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 group"
                        >
                          Apply Now
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-20"
        >
          {/* <p className="text-gray-500 mb-4">
            Don't see your perfect role? 
          </p> */}
          {/* <Button 
            variant="outline" 
            size="lg"
            className="rounded-2xl px-10 py-6 text-base"
          >
            Send us your CV
          </Button> */}
        </motion.div>
      </div>
    </section>
  );
}