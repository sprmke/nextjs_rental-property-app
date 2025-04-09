'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { signOut } from 'aws-amplify/auth';

import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bell, MessageCircle, Plus, Search } from 'lucide-react';

import { useGetAuthUserQuery } from '@/state/api';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);

  const isDashboardPage =
    pathname.includes('/managers') || pathname.includes('/tenants');
  const isTransparentHeader = !hasScrolled && pathname.includes('/landing');

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

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
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isTransparentHeader ? 'bg-transparent' : 'bg-white shadow-md'
      }`}
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8">
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className={`cursor-pointer ${
              isTransparentHeader
                ? 'hover:!text-primary-300'
                : 'hover:!text-primary-700'
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
                  isTransparentHeader ? 'text-white' : 'text-primary-700'
                }`}
              >
                KAME
                <span
                  className={`font-light ${
                    isTransparentHeader
                      ? 'text-secondary-500'
                      : 'text-secondary-600'
                  } hover:!text-primary-300`}
                >
                  HOMES
                </span>
              </div>
            </div>
          </Link>
          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className="md:ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
              onClick={() =>
                router.push(
                  authUser.userRole?.toLowerCase() === 'manager'
                    ? '/managers/newproperty'
                    : '/search'
                )
              }
            >
              {authUser.userRole?.toLowerCase() === 'manager' ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="hidden md:block ml-2">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        {!isDashboardPage && (
          <p
            className={`hidden md:block ${
              isTransparentHeader ? 'text-primary-200' : 'text-primary-700'
            }`}
          >
            Discover your perfect rental apartment with our advanced search
          </p>
        )}
        <div className="flex items-center gap-5">
          {authUser ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle
                  className={`w-6 h-6 cursor-pointer ${
                    isTransparentHeader
                      ? 'text-primary-200 hover:text-primary-400'
                      : 'text-primary-700 hover:text-primary-500'
                  }`}
                />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
              </div>
              <div className="relative hidden md:block">
                <Bell
                  className={`w-6 h-6 cursor-pointer ${
                    isTransparentHeader
                      ? 'text-primary-200 hover:text-primary-400'
                      : 'text-primary-700 hover:text-primary-500'
                  }`}
                />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                  <Avatar>
                    <AvatarImage src={authUser.userInfo?.image} />
                    <AvatarFallback
                      className={`${
                        isTransparentHeader
                          ? 'bg-primary-300'
                          : 'bg-primary-400'
                      }`}
                    >
                      {authUser.userRole?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p
                    className={`text-primary-200 hidden capitalize md:block ${
                      isTransparentHeader
                        ? 'text-primary-200'
                        : 'text-primary-700'
                    }`}
                  >
                    {authUser.userInfo?.name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-primary-700">
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 font-bold"
                    onClick={() =>
                      router.push(
                        authUser.userRole?.toLowerCase() === 'manager'
                          ? '/managers/properties'
                          : '/tenants/favorites',
                        { scroll: false }
                      )
                    }
                  >
                    Go to Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary-200" />
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                    onClick={() =>
                      router.push(
                        `/${authUser.userRole?.toLowerCase()}s/settings`,
                        { scroll: false }
                      )
                    }
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
