'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { PlusCircle, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Framework {
  id: string;
  name: string;
  version: string;
  description: string | null;
  urn: string;
  createdAt: string;
  updatedAt: string;
}

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const response = await fetch('/api/frameworks');
        if (!response.ok) {
          throw new Error('Failed to fetch frameworks');
        }
        const data = await response.json();
        setFrameworks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load frameworks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFrameworks();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Frameworks</h1>
          <p className="text-muted-foreground">
            Manage and organize your compliance frameworks and controls
          </p>
        </div>
        <Link href="/dashboard/frameworks/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Framework
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Frameworks</CardTitle>
          <CardDescription>
            {frameworks.length} {frameworks.length === 1 ? 'framework' : 'frameworks'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : frameworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-1">
                <h3 className="text-lg font-medium">No frameworks found</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating a new compliance framework
                </p>
              </div>
              <Link href="/dashboard/frameworks/new" className="mt-2">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Framework
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>URN</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {frameworks.map((framework) => (
                    <TableRow key={framework.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/frameworks/${framework.id}`}
                          className="hover:underline"
                        >
                          {framework.name}
                        </Link>
                      </TableCell>
                      <TableCell>{framework.version}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {framework.urn}
                      </TableCell>
                      <TableCell>
                        {new Date(framework.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/frameworks/${framework.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
