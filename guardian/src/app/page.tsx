"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to dashboard
    // In production, this will be handled by Active Directory
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-gray-950 text-white">
      <div className="bg-gray-900 bg-opacity-80 rounded-xl shadow-lg p-10 flex flex-col items-center w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Guardian GRC</h1>
        <p className="mb-6 text-lg text-gray-300 text-center">
          Welcome to your Governance, Risk, and Compliance platform.
          <br/>
          Redirecting to dashboard...
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
      <footer className="mt-10 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Guardian GRC. All rights reserved.
      </footer>
    </div>
  );
}
