'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, User, Mail, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';

type Application = {
  id: string;
  name: string;
  email: string;
  resumeUrl: string | null;
  resumePublicId: string | null;
  status: string;
  createdAt: string;
  job: {
    title: string;
    department: string;
  };
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchApplications();
  };

  const downloadResume = (publicId: string, name: string) => {
    window.open(`/api/download-resume?publicId=${encodeURIComponent(publicId)}&name=${encodeURIComponent(name)}`, '_blank');
  };

  if (loading) {
    return <div className="p-6 md:p-10">Loading applications...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-[#1a2744]">Job Applications</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage all received applications</p>
        </div>
        <Button asChild className="w-fit">
          <Link href="/admin">← Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">All Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">

          {/* Desktop Table — hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-medium">Applicant</th>
                  <th className="text-left py-4 px-6 font-medium">Job Position</th>
                  <th className="text-left py-4 px-6 font-medium">Applied On</th>
                  <th className="text-left py-4 px-6 font-medium">Status</th>
                  <th className="text-center py-4 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#69c8e4]/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-[#69c8e4]" />
                        </div>
                        <div>
                          <p className="font-semibold">{app.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-4 h-4" /> {app.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="font-medium">{app.job.title}</p>
                      <p className="text-sm text-gray-500">{app.job.department}</p>
                    </td>
                    <td className="py-5 px-6 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="py-5 px-6">
                      <Select value={app.status} onValueChange={(value) => updateStatus(app.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-5 px-6 text-center">
                      {app.resumePublicId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadResume(app.resumePublicId!, app.name)}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download CV
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards — hidden on desktop */}
          <div className="md:hidden space-y-3 p-4">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border rounded-2xl p-4 bg-white shadow-sm space-y-3"
              >
                {/* Applicant Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#69c8e4]/10 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#69c8e4]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{app.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 shrink-0" /> {app.email}
                    </p>
                  </div>
                  {/* Status badge */}
                  <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                    {app.status}
                  </span>
                </div>

                {/* Job Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-medium truncate">{app.job.title}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 truncate">{app.job.department}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(app.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-3 pt-1">
                  <Select value={app.status} onValueChange={(value) => updateStatus(app.id, value)}>
                    <SelectTrigger className="flex-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  {app.resumePublicId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadResume(app.resumePublicId!, app.name)}
                      className="flex items-center gap-1.5 h-9 text-xs shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      CV
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {applications.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No applications received yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}