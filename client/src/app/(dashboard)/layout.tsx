'use client';

import React, { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

import { useGetAuthUserQuery } from '@/state/api';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const { userRole } = authUser || {};
  const userType = userRole?.toLowerCase() ?? 'tenant';

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === 'manager' && pathname.startsWith('/tenants')) ||
        (userRole === 'tenant' && pathname.startsWith('/managers'))
      ) {
        router.push(
          userRole === 'manager'
            ? '/managers/properties'
            : '/tenants/favorites',
          { scroll: false }
        );
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
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />
        <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <Sidebar userType={userType} />
            <div className="flex-grow transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
