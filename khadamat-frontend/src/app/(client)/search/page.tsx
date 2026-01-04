'use client';

import { Professional } from '@/lib/mocks/services-mocks';

export default function SearchPage() {
  const searchQuery = (typeof window !== 'undefined') ? (new URLSearchParams(window.location.search).get('q') || '') : '';

  // TODO: Implement search functionality
  const results: any[] = [];
  const isLoading = false;
  const error = null;

  if (isLoading) return <div className="text-center py-8">Searching...</div>;
  if (error) return <div className="text-red-500">Error during search</div>;
  if (results.length === 0) return <div className="text-gray-500">No results found</div>;

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(results as Professional[]).map((result) => (
          <div key={result.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{result.fullName}</h2>
            <p className="text-sm text-gray-600">{result.serviceCategoryName}</p>
            <p className="text-sm text-gray-500">{result.shortBio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
