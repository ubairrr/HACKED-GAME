'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/register');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="text-green-400 font-mono text-xl sm:text-2xl lg:text-3xl animate-pulse text-center">
        INITIALIZING HACK THE FIREWALL...
      </div>
    </div>
  );
}