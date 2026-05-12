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
import { MapPin, Briefcase, Trash2, Search } from 'lucide-react';

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
        ...job,
        published: !job.published,
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
    <div className="p-4 md:p-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl md:text-3xl font-black">Career Dashboard</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              className="pl-9 w-full sm:w-56"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CreateJobModal onSuccess={fetchJobs} />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-xl">
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
                  <Button variant="destructive" onClick={() => handleDelete(job.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="border rounded-2xl p-4 bg-white shadow-sm space-y-3"
          >
            {/* Title + Published toggle */}
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-base leading-tight">{job.title}</p>
              <Switch
                checked={job.published}
                onCheckedChange={() => togglePublish(job)}
              />
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                <Badge className="text-xs px-2 py-0">{job.type}</Badge>
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                job.published
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {job.published ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <div className="flex-1">
                <EditJobModal job={job} onSuccess={fetchJobs} />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(job.id)}
                className="flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No jobs found.
        </div>
      )}
    </div>
  );
}