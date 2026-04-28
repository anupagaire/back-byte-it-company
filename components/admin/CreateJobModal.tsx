'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function CreateJobModal({ onSuccess }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    department: '',
    description: '',
    published: true,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setOpen(false);
        setForm({
          title: '',
          location: '',
          type: 'Full-time',
          department: '',
          description: '',
          published: true,
        });

        onSuccess?.();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#69c8e4]">
          + Create Job
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">

          <Input
            placeholder="Job Title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />

            <Input
              placeholder="Department"
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
            />
          </div>

          <Input
            placeholder="Type (Full-time / Remote / Part-time)"
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
          />

          <Textarea
            placeholder="Job Description"
            rows={5}
            value={form.description}
            onChange={(e) =>
              handleChange('description', e.target.value)
            }
          />

          {/* Publish toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Publish immediately
            </span>

            <Switch
              checked={form.published}
              onCheckedChange={(val) =>
                handleChange('published', val)
              }
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#505f88] hover:bg-[#69c8e4]"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}