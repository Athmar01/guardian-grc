'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

interface Framework {
  id: string;
  name: string;
  version: string;
  description: string | null;
  urn: string;
}

export default function EditFrameworkPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [framework, setFramework] = useState<Framework>({
    id: '',
    name: '',
    version: '',
    description: '',
    urn: '',
  });

  useEffect(() => {
    const fetchFramework = async () => {
      try {
        const response = await fetch(`/api/frameworks/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch framework');
        }
        const data = await response.json();
        setFramework({
          ...data,
          description: data.description || '',
        });
      } catch (error) {
        console.error('Error fetching framework:', error);
        toast({
          title: 'Error',
          description: 'Failed to load framework',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFramework();
  }, [params.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/frameworks/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: framework.name,
          version: framework.version,
          description: framework.description || null,
          urn: framework.urn,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update framework');
      }

      toast({
        title: 'Success',
        description: 'Framework updated successfully',
      });
      router.push(`/dashboard/frameworks/${params.id}`);
    } catch (error) {
      console.error('Error updating framework:', error);
      toast({
        title: 'Error',
        description: 'Failed to update framework',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this framework? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/frameworks/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete framework');
      }

      toast({
        title: 'Success',
        description: 'Framework deleted successfully',
      });
      router.push('/dashboard/frameworks');
    } catch (error) {
      console.error('Error deleting framework:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete framework',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/frameworks/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Framework
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Framework
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Framework Details</CardTitle>
          <CardDescription>
            Update the framework information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={framework.name}
                  onChange={(e) =>
                    setFramework({ ...framework, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input
                  id="version"
                  value={framework.version}
                  onChange={(e) =>
                    setFramework({ ...framework, version: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="urn">URN *</Label>
                <Input
                  id="urn"
                  value={framework.urn}
                  onChange={(e) =>
                    setFramework({ ...framework, urn: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={framework.description || ''}
                  onChange={(e) =>
                    setFramework({ ...framework, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link href={`/dashboard/frameworks/${params.id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
