'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, Calendar, User, Mail } from 'lucide-react';
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

  const downloadResume = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_')}_resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="p-10">Loading applications...</div>;
  }

  return (
    <div className="p-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-[#1a2744]">Job Applications</h1>
          <p className="text-gray-600 mt-2">Manage all received applications</p>
        </div>
        <Button asChild>
          <Link href="/admin">← Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                      <div>
                        <p className="font-medium">{app.job.title}</p>
                        <p className="text-sm text-gray-500">{app.job.department}</p>
                      </div>
                    </td>

                    <td className="py-5 px-6 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="py-5 px-6">
                      <Select
                        value={app.status}
                        onValueChange={(value) => updateStatus(app.id, value)}
                      >
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
                      {app.resumeUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadResume(app.resumeUrl!, app.name)}
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

            {applications.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No applications received yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}