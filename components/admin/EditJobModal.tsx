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

export default function EditJobModal({
  job,
  onSuccess,
}: {
  job: any;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: job.title,
    location: job.location,
    type: job.type,
    department: job.department,
    description: job.description,
    published: job.published,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

 const handleUpdate = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setOpen(false);
      onSuccess?.();
    } else {
      alert('Failed to update job');
    }
  } catch (err) {
    console.error(err);
    alert('Error updating job');
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

<DialogContent className=" max-w-2xl rounded-2xl p-4 md:p-6 max-h-[90vh] overflow-y-auto">        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">

          <Input
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />

            <Input
              value={form.department}
              onChange={(e) =>
                handleChange('department', e.target.value)
              }
            />
          </div>

          <Input
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
          />

          <Textarea
            rows={5}
            value={form.description}
            onChange={(e) =>
              handleChange('description', e.target.value)
            }
          />

          {/* Publish toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Published
            </span>

            <Switch
              checked={form.published}
              onCheckedChange={(val) =>
                handleChange('published', val)
              }
            />
          </div>

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-[#505f88]"
          >
            {loading ? 'Updating...' : 'Update Job'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}