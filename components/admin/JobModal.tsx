'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function JobModal({ refresh }: any) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    department: '',
  });

  const submit = async () => {
    await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Job</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input placeholder="Title"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Input placeholder="Location"
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <Input placeholder="Type"
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />

          <Textarea placeholder="Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button onClick={submit} className="w-full">
            Save Job
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}