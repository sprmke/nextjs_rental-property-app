'use client';

import Navbar from '@/components/Navbar';
import { useGetAuthUserQuery } from '@/state/api';

const layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser } = useGetAuthUserQuery();
  console.log('authUser::', authUser);
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className="h-full flex w-full flex-col">{children}</main>
    </div>
  );
};

export default layout;
