'use client';

import { useState } from 'react';
import { Loader2, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplyForm({ 
  jobId, 
  jobTitle 
}: { 
  jobId: string; 
  jobTitle?: string; 
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    resume: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.resume) {
      alert("Please fill all fields and upload your PDF resume.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('jobId', jobId);
    if (form.resume) data.append('resume', form.resume);

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to submit application');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-600 text-lg">
            Thank you for applying for <strong>{jobTitle}</strong>.
          </p>
          <p className="text-sm text-gray-500 mt-8">
            Our team will review your application and get back to you soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Submit Your Application</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="resume">Resume (PDF only) *</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-[#69c8e4]">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                {form.resume ? form.resume.name : "Click to upload your resume"}
              </p>
              <input
                id="resume"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })}
                required
              />
              <label
                htmlFor="resume"
                className="cursor-pointer inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium"
              >
                Choose PDF File
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#69c8e4] hover:bg-[#58b4d1] py-7 text-lg rounded-2xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}