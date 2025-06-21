import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frameworks | Guardian GRC',
  description: 'Manage compliance frameworks and controls',
};

export default function FrameworksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-6">
      {children}
    </div>
  );
}
