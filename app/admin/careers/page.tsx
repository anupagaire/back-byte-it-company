// components/admin/AdminCareers.tsx or wherever it is
'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CreateJobModal from '@/components/admin/CreateJobModal';
import EditJobModal from '@/components/admin/EditJobModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  department?: string;
  description?: string;
  published: boolean;
};

export default function AdminCareers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');

  const fetchJobs = async () => {
    const res = await fetch('/api/jobs');
    if (!res.ok) return;
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const togglePublish = async (job: Job) => {
    await fetch(`/api/jobs/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...job,                    // send current data
        published: !job.published 
      }),
    });
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });

    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } else {
      alert('Failed to delete job');
    }
  };

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">Career Dashboard</h1>

        <div className="flex gap-3">
          <Input
            placeholder="Search jobs..."
            className="w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
          <CreateJobModal onSuccess={fetchJobs} />
        </div>
      </div>

      <div className="border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Publish</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-bold">{job.title}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Badge>{job.type}</Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={job.published}
                    onCheckedChange={() => togglePublish(job)}
                  />
                </TableCell>
                <TableCell className="flex gap-2">
                  <EditJobModal job={job} onSuccess={fetchJobs} />
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}