import React from 'react';

import Navbar from '@/components/Navbar';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className="h-full flex w-full flex-col">{children}</main>
    </div>
  );
};

export default layout;
