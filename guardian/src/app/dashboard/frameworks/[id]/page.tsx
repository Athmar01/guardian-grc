import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { ArrowLeft, FileText, Pencil, PlusCircle } from 'lucide-react';
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

export default async function FrameworkDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/frameworks/${params.id}`,
    {
      next: { revalidate: 1 },
    }
  );

  if (!response.ok) {
    notFound();
  }

  const framework: Framework = await response.json();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/frameworks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Frameworks
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {framework.name}
            <span className="text-muted-foreground text-base font-normal ml-2">
              v{framework.version}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/frameworks/${framework.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href="/dashboard/controls/new">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Control
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Framework Details</CardTitle>
            <CardDescription>
              Overview of the compliance framework and its properties
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{framework.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p>{framework.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">URN</p>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {framework.urn}
                </code>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p>{format(new Date(framework.createdAt), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p>{format(new Date(framework.updatedAt), 'MMM d, yyyy')}</p>
              </div>
            </div>

            {framework.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{framework.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Controls</CardTitle>
                <CardDescription>
                  Controls associated with this framework
                </CardDescription>
              </div>
              <Link href={`/dashboard/frameworks/${framework.id}/mapping`}>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Map Controls
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12 text-center">
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No controls mapped to this framework yet.
                </p>
                <Link href={`/dashboard/frameworks/${framework.id}/mapping`}>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Map Controls
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
