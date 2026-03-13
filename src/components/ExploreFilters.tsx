'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Sports',
  'Kitchen',
  'Stationery',
  'Other',
];

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like new' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low → high' },
  { value: 'price_desc', label: 'Price: high → low' },
];

export default function ExploreFilters() {
  const router = useRouter();

  // Gets the params from the url
  const searchParams = useSearchParams();

  // State for the url
  const [search, setSearch] = useState(searchParams.get('q') ?? '');

  // Sync search input if user navigates back/forward
  useEffect(() => {
    setSearch(searchParams.get('q') ?? '');
  }, [searchParams]);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Apply updates; delete key if value is empty
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      // Reset to page 1 whenever filters change
      if (!('page' in updates)) params.delete('page');

      // These triggers a navigation, so Next.js treats this as a new request to the "/explore" route -> Server componente
      // "page.tsx" run again with the updated URL search params
      router.push(`/explore?${params.toString()}`);
    },
    [router, searchParams],
  );

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    pushParams({ q: search.trim() });
  }

  const activeCategory = searchParams.get('category') ?? '';
  const activeCondition = searchParams.get('condition') ?? '';
  const activeSort = searchParams.get('sort') ?? 'newest';
  const minPrice = searchParams.get('min_price') ?? '';
  const maxPrice = searchParams.get('max_price') ?? '';

  const hasFilters =
    activeCategory || activeCondition || minPrice || maxPrice || search;

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search listings by name..."
          className="w-full rounded-xl border border-gray-700 bg-gray-900/80 pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </form>

      {/* Filter row */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Category */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Category
          </label>
          <select
            value={activeCategory}
            onChange={(e) => pushParams({ category: e.target.value })}
            className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800 bg-[length:16px_16px] bg-[right_0.5rem_center] bg-no-repeat pl-3 pr-8 py-2 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239ca3af'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Condition
          </label>
          <select
            value={activeCondition}
            onChange={(e) => pushParams({ condition: e.target.value })}
            className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800 bg-[length:16px_16px] bg-[right_0.5rem_center] bg-no-repeat pl-3 pr-8 py-2 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239ca3af'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="">Any condition</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Price range (£)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => pushParams({ min_price: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <span className="text-gray-500">–</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => pushParams({ max_price: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Sort by
          </label>
          <select
            value={activeSort}
            onChange={(e) => pushParams({ sort: e.target.value })}
            className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800 bg-[length:16px_16px] bg-[right_0.5rem_center] bg-no-repeat pl-3 pr-8 py-2 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%239ca3af'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E\")",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>

            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 px-3 py-1 text-xs font-medium text-cyan-300">
                Search: {search}
                <button
                  onClick={() => {
                    setSearch('');
                    pushParams({ q: '' });
                  }}
                  className="ml-0.5 hover:text-white transition-colors"
                >
                  ×
                </button>
              </span>
            )}

            {activeCategory && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-600/20 border border-purple-500/30 px-3 py-1 text-xs font-medium text-purple-300">
                Category: {activeCategory}
                <button
                  onClick={() => pushParams({ category: '' })}
                  className="ml-0.5 hover:text-white transition-colors"
                >
                  ×
                </button>
              </span>
            )}

            {activeCondition && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs font-medium text-emerald-300">
                Condition:{' '}
                {CONDITIONS.find((c) => c.value === activeCondition)?.label}
                <button
                  onClick={() => pushParams({ condition: '' })}
                  className="ml-0.5 hover:text-white transition-colors"
                >
                  ×
                </button>
              </span>
            )}

            {minPrice && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-400/30 px-3 py-1 text-xs font-medium text-amber-300">
                Min: £{minPrice}
                <button
                  onClick={() => pushParams({ min_price: '' })}
                  className="ml-0.5 hover:text-white transition-colors"
                >
                  ×
                </button>
              </span>
            )}

            {maxPrice && (
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-500/15 border border-pink-400/30 px-3 py-1 text-xs font-medium text-pink-300">
                Max: £{maxPrice}
                <button
                  onClick={() => pushParams({ max_price: '' })}
                  className="ml-0.5 hover:text-white transition-colors"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setSearch('');
              router.push('/explore');
            }}
            className="shrink-0 rounded-full bg-purple-600/20 px-5 py-2 text-sm font-semibold text-purple-400 hover:bg-purple-600/30 transition-colors hover:cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
