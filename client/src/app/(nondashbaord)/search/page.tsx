'use client';

import React, { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/state/redux';

import FiltersBar from './FiltersBar';
import { NAVBAR_HEIGHT } from '@/lib/constants';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  return (
    <div
      className="w-full mx-auto px-5 flex flex-col"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        marginTop: `${NAVBAR_HEIGHT}px`,
      }}
    >
      <FiltersBar />
      <div className="flex justify-between flex-1 overflow-hidden gap-3 mb-5">
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${
            isFiltersFullOpen
              ? 'w-3/12 opacity-100 visible'
              : 'w-0 opacity-0 invisible'
          }`}
        >
          {/* <FiltersFull /> */}
        </div>
        {/* <Map /> */}
        <div className="basis-4/12 overflow-y-auto">{/* <Listings /> */}</div>
      </div>
    </div>
  );
};

export default SearchPage;
