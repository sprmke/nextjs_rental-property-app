'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAVBAR_HEIGHT } from '@/lib/constants';

import { Button } from './ui/button';

const Navbar = () => {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);

  const isDashboardPage =
    pathname.includes('/managers') || pathname.includes('/tenants');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        hasScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className={`cursor-pointer ${
              hasScrolled
                ? 'hover:!text-primary-700'
                : 'hover:!text-primary-300'
            }`}
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Kame Homes Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div
                className={`text-xl font-bold ${
                  hasScrolled ? 'text-primary-700' : 'text-white'
                }`}
              >
                KAME
                <span
                  className={`font-light ${
                    hasScrolled ? 'text-secondary-600' : 'text-secondary-500'
                  } hover:!text-primary-300`}
                >
                  HOMES
                </span>
              </div>
            </div>
          </Link>
        </div>
        {!isDashboardPage && (
          <p
            className={`hidden md:block ${
              hasScrolled ? 'text-primary-700' : 'text-primary-200'
            }`}
          >
            Discover your perfect rental apartment with our advanced search
          </p>
        )}
        <div className="flex items-center gap-5">
          <Link href="/signin">
            <Button
              variant="outline"
              className={`${
                hasScrolled
                  ? 'text-primary-700 border-primary-700 hover:bg-primary-700 hover:text-white'
                  : 'text-white border-white hover:bg-white hover:text-primary-700'
              } bg-transparent rounded-lg`}
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="secondary"
              className="text-white bg-gradient-to-r from-secondary-600 to-secondary-500 hover:from-secondary-500 hover:to-secondary-400 rounded-lg shadow-lg transition-all duration-300"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
