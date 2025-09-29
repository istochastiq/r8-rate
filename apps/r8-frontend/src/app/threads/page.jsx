'use client';

function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
      <ol className="flex gap-2">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li>/</li>
        <li><a href="/threads" className="text-gray-900">Threads</a></li>
      </ol>
    </nav>
  );
}

import RequireAuth from '../../components/RequireAuth';

export default function Page() {
  const rows = [];
  return (
    <main>
      <Breadcrumbs />
      <h1 className="text-2xl font-semibold mb-4">Threads</h1>
      <RequireAuth>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <li className="px-3 py-6 text-center text-gray-500">No threads yet.</li>
            )}
          </ul>
        </div>
      </RequireAuth>
    </main>
  );
}


