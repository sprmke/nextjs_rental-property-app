import {
  FiltersState,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen,
} from '@/state';
import { useAppSelector } from '@/state/redux';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { cleanParams, cn, formatPriceValue } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PropertyTypeIcons,
  MIN_PRICES,
  MAX_PRICES,
  BEDS,
  BATHS,
} from '@/lib/constants';

const FiltersBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  const [searchInput, setSearchInput] = useState(filters.location);

  const updateURL = debounce((newFilters: FiltersState) => {
    // Remove any empty/null/undefined values from filters
    const cleanFilters = cleanParams(newFilters);
    // Create new URLSearchParams object to build query string
    const updatedSearchParams = new URLSearchParams();

    // Iterate through cleaned filters and add them to URL params
    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        // If value is an array (like price range), join with commas
        // Otherwise convert value to string
        Array.isArray(value) ? value.join(',') : value.toString()
      );
    });

    // Update URL with new search params while preserving current path
    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  });

  const handleFilterChange = (
    key: string,
    value: any,
    isMin: boolean | null
  ) => {
    let newValue = value;

    // Handle price range and square feet filters
    // These filters have min/max values stored as [min, max] arrays
    if (key === 'priceRange' || key === 'squareFeet') {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1; // 0 for min value, 1 for max value
        currentArrayRange[index] = value === 'any' ? null : Number(value);
      }
      newValue = currentArrayRange;
    }
    // Handle coordinates filter
    // Coordinates are stored as [longitude, latitude] array
    else if (key === 'coordinates') {
      newValue = value === 'any' ? [0, 0] : value.map(Number);
    }
    // Handle all other filters (beds, baths, propertyType etc)
    // These are simple string values that can be 'any' or the selected value
    else {
      newValue = value === 'any' ? 'any' : value;
    }

    // Update filters in Redux store and URL params
    const newFilters = { ...filters, [key]: newValue };
    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };

  const handleLocationSearch = async () => {
    try {
    } catch (err) {
      console.error('Error search location:', err);
    }
  };

  return (
    <div className="flex justify-between items-center w-full py-5">
      {/* Filters */}
      <div className="flex justify-between items-center gap-4 p-2">
        {/* All Filters */}
        <Button
          variant="outline"
          className={cn(
            'gap-2 rounded-xl border-primary-400 hover:bg-primary-500 hover:text-primary-100',
            isFiltersFullOpen && 'bg-primary-700 text-primary-100'
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <Filter className="w-4 h-4" />
          <span>All Filters</span>
        </Button>

        {/* Search Location */}
        <div className="flex items-center">
          <Input
            placeholder="Search location"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-40 rounded-l-xl rounded-r-none border-primary-400 border-r-0"
          />
          <Button
            onClick={handleLocationSearch}
            className={`rounded-r-xl rounded-l-none border-l-none border-primary-400 shadow-none 
              border hover:bg-primary-700 hover:text-primary-50`}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Price Range */}
        <div className="flex gap-1">
          {/* Minimum Price Selector */}
          <Select
            value={filters.priceRange[0]?.toString() || 'any'}
            onValueChange={(value) =>
              handleFilterChange('priceRange', value, true)
            }
          >
            <SelectTrigger className="w-22 rounded-xl border-primary-400">
              <SelectValue>
                {formatPriceValue(filters.priceRange[0], true)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Min Price</SelectItem>
              {MIN_PRICES.map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  ${price / 1000}k+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Maximum Price Selector */}
          <Select
            value={filters.priceRange[1]?.toString() || 'any'}
            onValueChange={(value) =>
              handleFilterChange('priceRange', value, false)
            }
          >
            <SelectTrigger className="w-22 rounded-xl border-primary-400">
              <SelectValue>
                {formatPriceValue(filters.priceRange[1], false)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Max Price</SelectItem>
              {MAX_PRICES.map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  &lt;${price / 1000}k
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Beds and Baths */}
        <div className="flex gap-1">
          {/* Beds */}
          <Select
            value={filters.beds}
            onValueChange={(value) => handleFilterChange('beds', value, null)}
          >
            <SelectTrigger className="w-26 rounded-xl border-primary-400">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {BEDS.map((bed) => (
                <SelectItem key={bed.value} value={bed.value}>
                  {bed.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Baths */}
          <Select
            value={filters.baths}
            onValueChange={(value) => handleFilterChange('baths', value, null)}
          >
            <SelectTrigger className="w-26 rounded-xl border-primary-400">
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {BATHS.map((bath) => (
                <SelectItem key={bath.value} value={bath.value}>
                  {bath.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <Select
          value={filters.propertyType || 'any'}
          onValueChange={(value) =>
            handleFilterChange('propertyType', value, null)
          }
        >
          <SelectTrigger className="w-32 rounded-xl border-primary-400">
            <SelectValue placeholder="Home Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="any">Any Property Type</SelectItem>
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center">
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Mode */}
      <div className="flex justify-between items-center gap-4 p-2">
        <div className="flex border rounded-xl">
          <Button
            variant="ghost"
            className={cn(
              'px-3 py-1 rounded-none rounded-l-xl hover:bg-primary-600 hover:text-primary-50',
              viewMode === 'list' ? 'bg-primary-700 text-primary-50' : ''
            )}
            onClick={() => dispatch(setViewMode('list'))}
          >
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            className={cn(
              'px-3 py-1 rounded-none rounded-r-xl hover:bg-primary-600 hover:text-primary-50',
              viewMode === 'grid' ? 'bg-primary-700 text-primary-50' : ''
            )}
            onClick={() => dispatch(setViewMode('grid'))}
          >
            <Grid className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
