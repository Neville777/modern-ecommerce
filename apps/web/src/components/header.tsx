// components/header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SearchBox } from './search-box';
import { UserMenu } from './navbar/user-menu';
import { CartIcon } from '@/modules/cart/components/cart-icon';
import { ThemeToggle } from './theme-toggle';
import { Container } from './ui/container';
import { useTheme } from 'next-themes';
import { Heart, RefreshCw } from 'lucide-react';
import { Badge } from './ui/badge';
import { useWishlist } from '@/modules/wishlist/context/wishlist-context';
import { useCompare } from '@/modules/compare/context/compare-context';
import { CompareDrawer } from '@/modules/compare/context/compare-drawer';

export const Header = () => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const { items: wishlistItems } = useWishlist();
  const { items: compareItems } = useCompare();

  const openSideNav = () => setIsSideNavOpen(true);
  const closeSideNav = () => setIsSideNavOpen(false);

  const toggleCategoryDropdown = () =>
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  const toggleLanguageDropdown = () =>
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-red-600 dark:bg-gray-900 text-white">
      {/* Top custom menu */}
      <div className="border-b border-red-500 dark:border-gray-800">
        <Container>
          <div className="py-2 flex justify-center md:justify-start space-x-4 text-sm overflow-x-auto">
            <Link href="#" className="hover:text-red-100 whitespace-nowrap">
              Best Sellers
            </Link>
            <Link href="#" className="hover:text-red-100 whitespace-nowrap">
              Gift Ideas
            </Link>
            <Link href="#" className="hover:text-red-100 whitespace-nowrap">
              New Releases
            </Link>
            <Link href="#" className="hover:text-red-100 whitespace-nowrap">
              Today's Deals
            </Link>
            <Link href="#" className="hover:text-red-100 whitespace-nowrap">
              Customer Service
            </Link>
          </div>
        </Container>
      </div>

      {/* Logo section */}
      <div className="py-4 border-b border-red-500 dark:border-gray-800">
        <Container>
          <div className="flex justify-center">
            <Link href="/" className="block">
              <div className="h-10 relative">
                <Image
                  src="/images/download.jpeg"
                  alt="Nevos Shop Logo"
                  width={150}
                  height={40}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
        </Container>
      </div>

      {/* Main header section */}
      <Container>
        <div className="py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Sidenav toggle and category dropdown */}
          <div className="flex items-center gap-3">
            {/* Mobile toggle button */}
            <button
              onClick={openSideNav}
              className="text-white flex items-center p-1"
              aria-label="Open navigation menu"
            >
              <span className="sr-only">Menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Category dropdown - Desktop */}
            <div className="relative hidden md:block">
              <button
                onClick={toggleCategoryDropdown}
                className="bg-gray-700 dark:bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                All Categories
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute mt-1 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded shadow-lg z-10">
                  <Link
                    href="/fashion"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Fashion
                  </Link>
                  <Link
                    href="/electronic"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Electronic
                  </Link>
                  <Link
                    href="/jewellery"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Jewellery
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <SearchBox />
            </div>
          </div>

          {/* Language selector and actions */}
          <div className="flex items-center gap-4">
            {/* Language selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center gap-2 text-white hover:text-red-100 transition-colors"
              >
                <div className="w-5 h-5 relative">
                  <Image
                    src="/images/download1.png"
                    alt="UK Flag"
                    width={20}
                    height={20}
                    className="rounded-sm"
                  />
                </div>
                <span>English</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute mt-1 w-36 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded shadow-lg z-10">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <div className="w-5 h-5 relative">
                      <Image
                        src="/images/flag-france.png"
                        alt="France Flag"
                        width={20}
                        height={20}
                        className="rounded-sm"
                      />
                    </div>
                    <span>French</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist, Compare, Cart and user menu */}
            <div className="flex items-center gap-3">
              {/* Wishlist Icon */}
              <Link href="/wishlist" className="relative flex items-center justify-center text-white">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center p-0 text-xs bg-yellow-400 text-black">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Link>
              
              {/* Compare Icon with Drawer */}
              <CompareDrawer
                trigger={
                  <button className="relative flex items-center justify-center text-white">
                    <RefreshCw className="h-5 w-5" />
                    {compareItems.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center p-0 text-xs bg-yellow-400 text-black">
                        {compareItems.length}
                      </Badge>
                    )}
                  </button>
                }
              />
              
              <CartIcon />
              <UserMenu />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Container>

      {/* Side Navigation Overlay */}
      {isSideNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeSideNav}
        ></div>
      )}

      {/* Side Navigation */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isSideNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="block" onClick={closeSideNav}>
            <div className="h-8 relative">
              <Image
                src="/images/download.jpeg"
                alt="Nevos Shop Logo"
                width={120}
                height={32}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </Link>
          <button
            onClick={closeSideNav}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            aria-label="Close navigation menu"
          >
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="px-4 py-2">
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className={`block py-2 ${isActive('/') ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'}`}
                onClick={closeSideNav}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/fashion"
                className={`block py-2 ${isActive('/fashion') ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'}`}
                onClick={closeSideNav}
              >
                Fashion
              </Link>
            </li>
            <li>
              <Link
                href="/electronic"
                className={`block py-2 ${isActive('/electronic') ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'}`}
                onClick={closeSideNav}
              >
                Electronic
              </Link>
            </li>
            <li>
              <Link
                href="/jewellery"
                className={`block py-2 ${isActive('/jewellery') ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'}`}
                onClick={closeSideNav}
              >
                Jewellery
              </Link>
            </li>
            <li>
              <Link
                href="/wishlist"
                className={`block py-2 ${isActive('/wishlist') ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'}`}
                onClick={closeSideNav}
              >
                My Wishlist
              </Link>
            </li>
            <li>
              <Link
                href="/compare"
                className={`block py-2 ${isActive('/compare') ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'}`}
                onClick={closeSideNav}
              >
                Compare Products
              </Link>
            </li>
            <li className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
              <Link
                href="/login"
                className="flex items-center py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                onClick={closeSideNav}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  ></path>
                </svg>
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};