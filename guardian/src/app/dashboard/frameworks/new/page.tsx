'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewFrameworkPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      version: formData.get('version') as string,
      description: formData.get('description') as string,
      urn: formData.get('urn') as string,
    };

    try {
      const response = await fetch('/api/frameworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create framework');
      }

      const result = await response.json();
      router.push(`/dashboard/frameworks/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/frameworks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Frameworks
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Compliance Framework</CardTitle>
          <CardDescription>
            Create a new compliance framework to manage controls and requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., ISO 27001"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="version">Version *</Label>
                  <Input
                    id="version"
                    name="version"
                    placeholder="e.g., 1.0.0"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="urn">URN *</Label>
                  <Input
                    id="urn"
                    name="urn"
                    placeholder="e.g., iso:27001:2022"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Framework description..."
                  rows={4}
                />
              </div>
            </div>
            
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Framework'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
