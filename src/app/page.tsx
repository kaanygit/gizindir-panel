'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Ana sayfadan dashboard sayfasına yönlendir
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Gizindir Admin Panel</h1>
        <p className="text-gray-600 mb-6">Yükleniyor...</p>
        <div className="w-16 h-16 border-t-4 border-pink-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
