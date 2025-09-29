import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
      <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0 }}>
        <li><Link href="/">Home</Link></li>
        <li>/</li>
        <li aria-current="page">Influencers</li>
      </ol>
    </nav>
  );
}

export default async function Page() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const res = await fetch(`${url}/rest/v1/influencers?select=*&order=created_at.desc`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <main style={{ padding: 24 }}>
        <Breadcrumbs />
        <h1>Influencers</h1>
        <p style={{ color: 'crimson' }}>Error: {res.status} {res.statusText}</p>
      </main>
    );
  }
  const data = await res.json();

  return (
    <main>
      <Breadcrumbs />
      <h1 className="text-2xl font-semibold mb-4">Influencers</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Avatar</th>
              <th className="px-3 py-2 text-left">Handle</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(data || []).map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2">
                  {row.twitter_profile_pic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.twitter_profile_pic} alt={row.twitter_handle} width={40} height={40} className="rounded-md object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-md" />
                  )}
                </td>
                <td className="px-3 py-2 font-medium">
                  <Link href={`/influencers/${encodeURIComponent(row.twitter_handle)}`} className="text-blue-600 hover:underline">
                    @{row.twitter_handle}
                  </Link>
                </td>
                <td className="px-3 py-2 text-gray-500">
                  {row.created_at ? new Date(row.created_at).toLocaleString() : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


