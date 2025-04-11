'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { Loader2 } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { useGetAuthUserQuery } from '@/state/api';

const layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === 'manager' && pathname.startsWith('/search')) ||
        (userRole === 'manager' && pathname === '/')
      ) {
        router.push('/managers/properties', { scroll: false });
      } else {
        setIsLoading(false);
      }
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin opacity-50" />
      </div>
    );

  return (
    <div className="h-full w-full">
      <Navbar />
      <main className="h-full flex w-full flex-col">{children}</main>
    </div>
  );
};

export default layout;
