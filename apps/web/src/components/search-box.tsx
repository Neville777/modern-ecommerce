// components/search-box.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export const SearchBox = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search/${keyword}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="relative flex w-full">
      <input
        type="text"
        name="search"
        placeholder="Search products..."
        onChange={e => setKeyword(e.target.value)}
        className="w-full py-2 px-4 rounded-l text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-300 border-r-0 transition-all duration-200"
      />
      <button
        type="submit"
        className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 rounded-r flex items-center justify-center transition duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
};
