'use client';

function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
      <ol className="flex gap-2">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li>/</li>
        <li><a href="/account/positions" className="text-gray-900">My positions</a></li>
      </ol>
    </nav>
  );
}

import RequireAuth from '../../../components/RequireAuth';

export default function Page() {
  // TODO: replace with real portfolio fetch (server-side)
  const rows = [];
  return (
    <main>
      <Breadcrumbs />
      <h1 className="text-2xl font-semibold mb-4">My positions</h1>
      <RequireAuth>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Market</th>
                <th className="px-3 py-2 text-left">Side</th>
                <th className="px-3 py-2 text-right">Qty</th>
                <th className="px-3 py-2 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">No positions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </RequireAuth>
    </main>
  );
}


